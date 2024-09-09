import Stripe from 'stripe';
import invariant from 'ts-invariant';

import channelService from './channel';
import PriceService from './price';
import productService from './product';

import { Frequency } from '@/enums';
import {
  OrderAddDiscountError,
  OrderCancelError,
  OrderCancelTransactionError,
  OrderCompleteError,
  OrderCreateError,
  OrderDeleteError,
  OrderInitialTransactionError,
  OrderNotFoundError,
  OrderUpdateError,
  OrderVariantNotFoundError,
} from '@/errors/order';
import {
  AddOrderDiscountDocument,
  CancelDraftOrderDocument,
  CompleteDraftOrderDocument,
  CountryCode,
  CreateDraftOrderDocument,
  DeleteDraftOrderDocument,
  DiscountValueTypeEnum,
  FindOrdersDocument,
  FindOrdersQueryVariables,
  GetOrderDocument,
  InitializeTransactionDocument,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  RequestTransactionActionDocument,
  TransactionActionEnum,
  UpdateDraftOrderDocument,
  UpdateDraftOrderMutationVariables,
} from '@/gql/graphql';
import { awaitable } from '@/helpers/async';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import RecipeHelper from '@/helpers/recipe';
import { multipleRecipesToVariant, recipeToVariant } from '@/helpers/saleor';
import { getSubRecipeSlug, subscriptionProducts } from '@/products';
import { DogOrderDto } from '@/types/dto';

class OrderService {
  async find(variables?: FindOrdersQueryVariables) {
    const { orders } = await executeGraphQL(FindOrdersDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: variables ?? {},
    });
    return orders?.edges.map((edge) => edge.node) || [];
  }
  async getById(id: string) {
    const { order } = await executeGraphQL(GetOrderDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id },
    });

    if (!order) {
      throw new OrderNotFoundError();
    }

    return order;
  }
  async create(dogs: DogOrderDto[], starterBox: boolean) {
    invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

    const channel = await channelService.getDefault();

    const productSlugsToBeAddToLine = new Set<string>();

    for (const dog of dogs) {
      productSlugsToBeAddToLine.add(getSubRecipeSlug(dog.recipe1));
      if (dog.recipe2) {
        productSlugsToBeAddToLine.add(getSubRecipeSlug(dog.recipe2));
        productSlugsToBeAddToLine.add(getSubRecipeSlug(dog.recipe1, dog.recipe2));
      }
    }

    const slugs = [...productSlugsToBeAddToLine];

    // make sure the settings of saleor is ready for create checkout
    const products = await productService.find({
      channel: process.env.SALEOR_CHANNEL_SLUG,
      where: {
        slug: {
          oneOf: slugs,
        },
      },
    });

    if (products.length !== slugs.length) {
      throw new OrderCreateError();
    }

    const lines = [];

    for (const dog of dogs) {
      const recipe1Total = PriceService.calculateRecipeBoxPrice(
        products,
        dog.breeds,
        dog.dateOfBirth,
        dog.isNeutered,
        dog.weight,
        dog.bodyCondition,
        dog.activityLevel,
        { recipeToBeCalcuate: dog.recipe1, recipeReference: dog.recipe2 },
        dog.mealPlan,
        starterBox ? Frequency.TwoWeek : dog.frequency,
        starterBox ? dog.isEnabledTransitionPeriod : false
      );
      if (!dog.recipe2) {
        lines.push({
          variantId: recipe1Total.variant.id,
          quantity: 1,
          price: Math.round(recipe1Total.price),
        });
        continue;
      }
      const recipe2Variant = recipeToVariant(products, dog.breeds, dog.dateOfBirth, dog.recipe2);
      if (!recipe2Variant) {
        throw new OrderVariantNotFoundError(
          'failed to add recipe 2 to checkout, variant not found'
        );
      }
      const crossJoinVariant = multipleRecipesToVariant(
        products,
        dog.breeds,
        dog.dateOfBirth,
        dog.recipe1,
        dog.recipe2
      );
      if (!crossJoinVariant) {
        throw new OrderVariantNotFoundError(
          'failed to add cross join recipe to checkout, variant not found'
        );
      }
      const recipe2Total = PriceService.calculateRecipeBoxPrice(
        products,
        dog.breeds,
        dog.dateOfBirth,
        dog.isNeutered,
        dog.weight,
        dog.bodyCondition,
        dog.activityLevel,
        { recipeToBeCalcuate: dog.recipe2, recipeReference: dog.recipe1 },
        dog.mealPlan,
        starterBox ? Frequency.TwoWeek : dog.frequency,
        starterBox ? dog.isEnabledTransitionPeriod : false
      );
      lines.push({
        variantId: crossJoinVariant.id,
        quantity: 1,
        price: Math.round(recipe1Total.price + recipe2Total.price),
      });
    }

    // create draft order
    const { draftOrderCreate } = await executeGraphQL(CreateDraftOrderDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        input: {
          channelId: channel.id,
          lines,
        },
      },
    });

    if (!draftOrderCreate || draftOrderCreate.errors.length > 0) {
      throw new OrderCreateError(draftOrderCreate?.errors);
    }

    if (starterBox) {
      return this.addDiscount(
        draftOrderCreate.order!.id,
        DiscountValueTypeEnum.Percentage,
        50,
        '50% Off Starter Box'
      );
    }

    return draftOrderCreate.order!;
  }
  async initialTransaction(
    id: string,
    data: Omit<Stripe.PaymentIntentCreateParams, 'amount' | 'currency'>
  ) {
    const checkout = await this.getById(id);

    const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
      variables: {
        checkoutOrOrderId: checkout.id,
        paymentGateway: {
          id: getStripeAppId(),
          data,
        },
      },
    });

    if (!transactionInitialize || transactionInitialize.errors.length > 0) {
      transactionInitialize && console.error();
      throw new OrderInitialTransactionError(transactionInitialize?.errors);
    }

    const initializeData = transactionInitialize.data as {
      paymentIntent: { client_secret: string };
      publishableKey: string;
    };

    return {
      transaction: transactionInitialize.transaction!,
      transactionEvent: transactionInitialize.transactionEvent!,
      data: initializeData,
    };
  }
  async update(id: string, input: UpdateDraftOrderMutationVariables['input']) {
    const { draftOrderUpdate } = await executeGraphQL(UpdateDraftOrderDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id, input },
    });

    if (!draftOrderUpdate || draftOrderUpdate.errors.length > 0) {
      console.error(input);
      throw new OrderUpdateError(draftOrderUpdate?.errors);
    }

    return draftOrderUpdate.order!;
  }
  async updateAddress(
    id: string,
    deliveryAddress: {
      firstName: string;
      lastName: string;
      streetAddress1: string;
      streetAddress2: string;
      district: string;
      region: string;
    },
    billingAddress: {
      firstName: string;
      lastName: string;
      streetAddress1: string;
      streetAddress2: string;
      district: string;
      region: string;
      postalCode?: string;
      country: CountryCode;
    }
  ) {
    return this.update(id, {
      shippingAddress: {
        firstName: deliveryAddress.firstName,
        lastName: deliveryAddress.lastName,
        streetAddress1: deliveryAddress.streetAddress1,
        streetAddress2: deliveryAddress.streetAddress2,
        city: deliveryAddress.district,
        countryArea: deliveryAddress.region,
        country: CountryCode.Hk,
      },
      billingAddress: {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        streetAddress1: billingAddress.streetAddress1,
        streetAddress2: billingAddress.streetAddress2,
        city:
          billingAddress.country === CountryCode.Hk
            ? billingAddress.district
            : billingAddress.region,
        countryArea:
          billingAddress.country === CountryCode.Hk
            ? billingAddress.region
            : billingAddress.district,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
      },
    });
  }
  async addDiscount(id: string, type: DiscountValueTypeEnum, value: number, reason?: string) {
    const { orderDiscountAdd } = await executeGraphQL(AddOrderDiscountDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id: id,
        input: { valueType: type, value, reason },
      },
    });

    if (!orderDiscountAdd || orderDiscountAdd.errors.length > 0) {
      throw new OrderAddDiscountError(orderDiscountAdd?.errors);
    }

    return orderDiscountAdd.order!;
  }
  async cancelOrderTransactions(id: string) {
    const order = await this.getById(id);
    for (const transaction of order.transactions) {
      const { transactionRequestAction } = await executeGraphQL(RequestTransactionActionDocument, {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          id: transaction.id,
          actionType: TransactionActionEnum.Cancel,
        },
      });
      if (!transactionRequestAction || transactionRequestAction.errors.length > 0) {
        throw new OrderCancelTransactionError(transactionRequestAction?.errors);
      }
    }
  }
  async complete(id: string) {
    // we need to wait for the payment hook to be called before completing the checkout
    await awaitable(
      () => this.getById(id),
      ({ authorizeStatus, chargeStatus }) =>
        authorizeStatus !== OrderAuthorizeStatusEnum.None &&
        chargeStatus !== OrderChargeStatusEnum.None
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { draftOrderComplete } = await executeGraphQL(CompleteDraftOrderDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id,
      },
    });

    if (!draftOrderComplete || draftOrderComplete.errors.length > 0) {
      throw new OrderCompleteError(draftOrderComplete?.errors);
    }

    return draftOrderComplete.order!;
  }
}

const orderService = new OrderService();

export default orderService;
