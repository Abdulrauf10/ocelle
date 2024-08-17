import Stripe from 'stripe';
import invariant from 'ts-invariant';

import channelService from './channel';
import productService from './product';

import { Frequency } from '@/enums';
import {
  OrderAddDiscountError,
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
  UpdateDraftOrderDocument,
  UpdateDraftOrderMutationVariables,
} from '@/gql/graphql';
import { awaitable } from '@/helpers/async';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import RecipeHelper from '@/helpers/recipe';
import { recipeToVariant } from '@/helpers/saleor';
import { subscriptionProducts } from '@/products';
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

    const productSlugsToBeAddToLine = [];

    for (const dog of dogs) {
      const slug1 = subscriptionProducts[dog.recipe1].slug;
      const slug2 = dog.recipe2 ? subscriptionProducts[dog.recipe2].slug : undefined;

      if (productSlugsToBeAddToLine.indexOf(slug1) === -1) {
        productSlugsToBeAddToLine.push(slug1);
      }

      if (slug2 && productSlugsToBeAddToLine.indexOf(slug2) === -1) {
        productSlugsToBeAddToLine.push(slug2);
      }
    }

    // make sure the settings of saleor is ready for create checkout
    const products = await productService.find({
      channel: process.env.SALEOR_CHANNEL_SLUG,
      where: {
        slug: {
          oneOf: productSlugsToBeAddToLine,
        },
      },
    });

    if (products.length !== productSlugsToBeAddToLine.length) {
      throw new OrderCreateError();
    }

    const lines = [];

    for (const dog of dogs) {
      const recipe1Variant = recipeToVariant(products, dog.breeds, dog.dateOfBirth, dog.recipe1);
      if (!recipe1Variant) {
        throw new OrderVariantNotFoundError(
          'failed to add recipe 1 to checkout, variant not found'
        );
      }
      const recipe1TotalProtions = RecipeHelper.calculateRecipeTotalProtionsInBox(
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
      lines.push({
        variantId: recipe1Variant.id,
        quantity: Math.ceil(recipe1TotalProtions),
      });
      if (dog.recipe2) {
        const recipe2Variant = recipeToVariant(products, dog.breeds, dog.dateOfBirth, dog.recipe2);
        if (!recipe2Variant) {
          throw new OrderVariantNotFoundError(
            'failed to add recipe 2 to checkout, variant not found'
          );
        }
        const recipe2TotalProtions = RecipeHelper.calculateRecipeTotalProtionsInBox(
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
          variantId: recipe2Variant.id,
          quantity: Math.ceil(recipe2TotalProtions),
        });
      }
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
  async delete(id: string) {
    const { draftOrderDelete } = await executeGraphQL(DeleteDraftOrderDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id },
    });

    if (!draftOrderDelete || draftOrderDelete.errors.length > 0) {
      throw new OrderDeleteError(draftOrderDelete?.errors);
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
