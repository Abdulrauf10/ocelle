'use server';

import Stripe from 'stripe';
import invariant from 'ts-invariant';

import channelService from './channel';
import { CheckoutInitialTransactionError } from './checkout';
import productService from './product';

import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import {
  AddOrderDiscountDocument,
  CompleteDraftOrderDocument,
  CountryCode,
  CreateDraftOrderDocument,
  DeleteDraftOrderDocument,
  DiscountValueTypeEnum,
  GetOrderDocument,
  InitializeTransactionDocument,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  UpdateDraftOrderDocument,
  UpdateDraftOrderMutationVariables,
} from '@/gql/graphql';
import { awaitable } from '@/helpers/async';
import { calculateRecipeTotalProtionsInBox } from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { recipeToVariant } from '@/helpers/saleor';
import { subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

export class OrderCreateError extends Error {}
export class OrderNotFoundError extends Error {}
export class OrderInitialTransactionError extends Error {}
export class OrderAppendLineError extends Error {}
export class OrderUpdateLineError extends Error {}
export class OrderDeleteLineError extends Error {}
export class OrderSetCouponError extends Error {}
export class OrderNotLinkedEmailError extends Error {}
export class OrderCompleteError extends Error {}
export class OrderUpdateError extends Error {}
export class OrderUpdateEmailError extends Error {}
export class OrderUpdateAddressError extends Error {}
export class OrderAddDiscountError extends Error {}
export class OrderDeleteError extends Error {}

interface DogOrderCreate {
  breeds: BreedDto[];
  isNeutered: boolean;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  mealPlan: MealPlan;
  recipe1: Recipe;
  recipe2?: Recipe;
  frequency: Frequency;
  isEnabledTransitionPeriod: boolean;
}

class OrderService {
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
  async create(dogs: DogOrderCreate[], starterBox: boolean) {
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
        throw new OrderCreateError('failed to add recipe 1 to checkout, variant not found');
      }
      const recipe1TotalProtions = calculateRecipeTotalProtionsInBox(
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
          throw new OrderCreateError('failed to add recipe 2 to checkout, variant not found');
        }
        const recipe2TotalProtions = calculateRecipeTotalProtionsInBox(
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
      draftOrderCreate && console.error(draftOrderCreate?.errors);
      throw new OrderCreateError();
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
      transactionInitialize && console.error(transactionInitialize);
      throw new CheckoutInitialTransactionError();
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
      draftOrderUpdate && console.error(draftOrderUpdate.errors);
      throw new OrderUpdateError();
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
        city: billingAddress.district,
        countryArea: billingAddress.region,
        country: CountryCode.Hk,
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
      orderDiscountAdd && console.error(orderDiscountAdd?.errors);
      throw new OrderAddDiscountError();
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
      draftOrderDelete && console.error(draftOrderDelete?.errors);
      throw new OrderDeleteError();
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
      draftOrderComplete && console.error(draftOrderComplete.errors);
      throw new OrderCompleteError();
    }

    return draftOrderComplete.order!;
  }
}

const orderService = new OrderService();

export default orderService;
