import invariant from 'ts-invariant';

import { awaitable } from '../helpers/async';
import {
  calculateRecipeTotalProtionsInBox,
  calculateTotalDaysInBox,
  getLifeStage,
} from '../helpers/dog';
import { getStripeAppId } from '../helpers/env';
import { executeGraphQL } from '../helpers/graphql';
import { recipeToVariant } from '../helpers/saleor';

import { DEFUALT_SHIPPING_ZONE, SHIPPING_METHOD_SF_EXPRESS_FREE } from '@/consts';
import { Dog, RecurringBox, User } from '@/entities';
import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import CreateUserError from '@/errors/api/CreateUserError';
import UpdateAddressError from '@/errors/api/UpdateAddressError';
import {
  CompleteDraftOrderDocument,
  CountryCode,
  CreateDraftOrderDocument,
  FindProductsDocument,
  FindProductsQueryVariables,
  FindShippingZonesDocument,
  FindUserDocument,
  GetChannelDocument,
  GetOrderDocument,
  InitializeTransactionDocument,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  ProductFragment,
  RegisterAccountDocument,
  UpdateDraftOrderDocument,
  UpdateDraftOrderMutationVariables,
} from '@/gql/graphql';
import { subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

export async function getThrowableChannel() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_CHANNEL_SLUG,
    },
  });

  if (!channel) {
    throw new Error('channel not found');
  }

  return channel;
}

export async function findProducts(variables?: FindProductsQueryVariables) {
  const { products } = await executeGraphQL(FindProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: variables ?? {},
  });
  return products?.edges.map((edge) => edge.node) || [];
}

function calculateRecipeTotalPriceInBox(
  products: ProductFragment[],
  breeds: BreedDto[],
  dateOfBirth: Date,
  neutered: boolean,
  currentWeight: number,
  condition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  plan: MealPlan,
  frequency: Frequency,
  transitionPeriod: boolean
) {
  const lifeStage = getLifeStage(breeds, dateOfBirth);
  const meta = subscriptionProducts[recipes.recipeToBeCalcuate];
  const channelPrice = products
    .find((product) => product.slug === meta.slug)
    ?.variants?.find((varient) => varient.sku === meta.variants[lifeStage].sku)
    ?.channelListings?.at(0);
  if (!channelPrice) {
    throw new Error('product or varient not found in any channels');
  }
  console.log(products.find((product) => product.slug === meta.slug));
  const totalProtionsInBox = calculateRecipeTotalProtionsInBox(
    breeds,
    dateOfBirth,
    neutered,
    currentWeight,
    condition,
    activityLevel,
    recipes,
    plan,
    frequency,
    transitionPeriod
  );
  return totalProtionsInBox * channelPrice.price!.amount;
}

export async function calculateTotalPriceInBox(
  breeds: BreedDto[],
  dateOfBirth: Date,
  neutered: boolean,
  currentWeight: number,
  condition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipe1: Recipe; recipe2?: Recipe },
  plan: MealPlan,
  frequency: Frequency,
  transitionPeriod: boolean
) {
  const products = await findProducts({
    where: {
      slug: {
        oneOf: Object.values(subscriptionProducts).map((product) => product.slug),
      },
    },
  });
  const recipe1Price = calculateRecipeTotalPriceInBox(
    products,
    breeds,
    dateOfBirth,
    neutered,
    currentWeight,
    condition,
    activityLevel,
    { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
    plan,
    frequency,
    transitionPeriod
  );
  if (!recipes.recipe2) {
    return recipe1Price;
  }
  return (
    recipe1Price +
    calculateRecipeTotalPriceInBox(
      products,
      breeds,
      dateOfBirth,
      neutered,
      currentWeight,
      condition,
      activityLevel,
      { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
      plan,
      frequency,
      transitionPeriod
    )
  );
}

export async function calculateTotalPerDayPrice(
  breeds: BreedDto[],
  dateOfBirth: Date,
  neutered: boolean,
  currentWeight: number,
  condition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipe1: Recipe; recipe2?: Recipe },
  plan: MealPlan,
  frequency: Frequency,
  transitionPeriod: boolean
) {
  const products = await findProducts({
    where: {
      slug: {
        oneOf: Object.values(subscriptionProducts).map((product) => product.slug),
      },
    },
  });
  const recipe1Days = calculateTotalDaysInBox(
    { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
    frequency,
    transitionPeriod
  );
  const recipe1TotalPriceInBox = calculateRecipeTotalPriceInBox(
    products,
    breeds,
    dateOfBirth,
    neutered,
    currentWeight,
    condition,
    activityLevel,
    { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
    plan,
    frequency,
    transitionPeriod
  );
  const recipe1PerDayPrice =
    recipe1TotalPriceInBox / (recipe1Days.transitionPeriodDays + recipe1Days.normalDays);

  if (!recipes.recipe2) {
    return recipe1PerDayPrice;
  }

  const recipe2Days = calculateTotalDaysInBox(
    { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
    frequency,
    transitionPeriod
  );
  const recipe2TotalPriceInBox = calculateRecipeTotalPriceInBox(
    products,
    breeds,
    dateOfBirth,
    neutered,
    currentWeight,
    condition,
    activityLevel,
    { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
    plan,
    frequency,
    transitionPeriod
  );
  const recipe2PerDayPrice =
    recipe2TotalPriceInBox / (recipe2Days.transitionPeriodDays + recipe2Days.normalDays);

  return recipe1PerDayPrice + recipe2PerDayPrice;
}

export async function upsertUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  channel: string,
  redirectUrl: string
) {
  const { user } = await executeGraphQL(FindUserDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { email },
  });
  if (user) {
    return user;
  }
  const { accountRegister } = await executeGraphQL(RegisterAccountDocument, {
    variables: {
      input: {
        firstName,
        lastName,
        password,
        email,
        redirectUrl,
        channel,
      },
    },
  });
  if (!accountRegister || accountRegister.errors.length > 0) {
    throw new CreateUserError(accountRegister);
  }
  return accountRegister.user!;
}

export async function updateOrderAddress(
  id: string,
  deliveryAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
  },
  billingAddress?: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
  }
) {
  const shippingAddress = {
    firstName: deliveryAddress.firstName,
    lastName: deliveryAddress.lastName,
    streetAddress1: deliveryAddress.streetAddress1,
    streetAddress2: deliveryAddress.streetAddress2,
    city: deliveryAddress.district,
    countryArea: deliveryAddress.region,
    country: CountryCode.Hk,
  };

  const { draftOrderUpdate } = await executeGraphQL(UpdateDraftOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      id,
      input: {
        shippingAddress,
        billingAddress: billingAddress
          ? {
              firstName: billingAddress.firstName,
              lastName: billingAddress.lastName,
              streetAddress1: billingAddress.streetAddress1,
              streetAddress2: billingAddress.streetAddress2,
              city: billingAddress.district,
              countryArea: billingAddress.region,
              country: CountryCode.Hk,
            }
          : shippingAddress,
      },
    },
  });

  if (!draftOrderUpdate || draftOrderUpdate.errors.length > 0) {
    throw new UpdateAddressError(draftOrderUpdate);
  }
}

async function findSubscriptionShippingMethod() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { shippingZones } = await executeGraphQL(FindShippingZonesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      filter: {
        search: DEFUALT_SHIPPING_ZONE,
      },
    },
  });

  const shippingZone = shippingZones && shippingZones.edges[0].node;

  if (!shippingZone) {
    throw new Error('cannot find shipping zone');
  }

  const shippingMethod = shippingZone.shippingMethods?.find(
    (shippingMethod) => shippingMethod.name === SHIPPING_METHOD_SF_EXPRESS_FREE
  );

  if (!shippingMethod) {
    throw new Error('cannot find shipping method');
  }

  return shippingMethod;
}

export async function updateDraftOrder(variables: UpdateDraftOrderMutationVariables) {
  const { draftOrderUpdate } = await executeGraphQL(UpdateDraftOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables,
  });

  if (!draftOrderUpdate || draftOrderUpdate.errors.length > 0) {
    draftOrderUpdate && console.error(draftOrderUpdate.errors);
    throw new Error('cannot update the draft order');
  }
}

export async function orderRecurringBox(
  user: User,
  orderLines: Array<{ dog: Dog; box: RecurringBox }>
) {
  const shippingMethod = await findSubscriptionShippingMethod();
  const channel = await getThrowableChannel();
  const products = await findProducts();
  const lines = [];
  for (const { dog, box } of orderLines) {
    const breeds = dog.breeds.map((x) => x.breed);
    const recipe1Variant = recipeToVariant(products, breeds, dog.dateOfBirth, box.recipe1);
    if (!recipe1Variant) {
      throw new Error('recipe1 variant not found in saleor');
    }
    const recipe1TotalProtions = calculateRecipeTotalProtionsInBox(
      breeds,
      dog.dateOfBirth,
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipeToBeCalcuate: box.recipe1, recipeReference: box.recipe2 },
      box.mealPlan,
      box.frequency,
      box.isTransitionPeriod
    );
    lines.push({
      variantId: recipe1Variant.id,
      quantity: Math.ceil(recipe1TotalProtions),
    });
    if (box.recipe2) {
      const recipe2Variant = recipeToVariant(products, breeds, dog.dateOfBirth, box.recipe2);
      if (!recipe2Variant) {
        throw new Error('recipe2 variant not found in saleor');
      }
      const recipe2TotalProtions = calculateRecipeTotalProtionsInBox(
        breeds,
        dog.dateOfBirth,
        dog.isNeutered,
        dog.weight,
        dog.bodyCondition,
        dog.activityLevel,
        { recipeToBeCalcuate: box.recipe2, recipeReference: box.recipe1 },
        box.mealPlan,
        box.frequency,
        box.isTransitionPeriod
      );
      lines.push({
        variantId: recipe2Variant.id,
        quantity: Math.ceil(recipe2TotalProtions),
      });
    }
  }

  const { draftOrderCreate } = await executeGraphQL(CreateDraftOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        user: user.id,
        channelId: channel.id,
        shippingMethod: shippingMethod.id,
        lines,
      },
    },
  });

  if (!draftOrderCreate || draftOrderCreate.errors.length > 0) {
    draftOrderCreate && console.error(draftOrderCreate?.errors);
    throw new Error('create draft order failed');
  }

  // do payment processing
  const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      checkoutOrOrderId: draftOrderCreate.order!.id,
      paymentGateway: {
        id: getStripeAppId(),
        data: {
          customer: user.stripe,
          payment_method: user.stripePaymentMethod,
          off_session: true,
          confirm: true,
        },
      },
    },
  });

  //TODO: get status of payment intent using transactionInitialize.transaction.pspReference, possible 3D secure

  if (!transactionInitialize || transactionInitialize.errors.length > 0) {
    transactionInitialize && console.error(transactionInitialize);
    // TODO: delete draft order when payment failed?
    throw new Error('cannot initialize transaction');
  }

  // we need to wait for the payment hook to be called before completing the draft order
  await awaitable(
    async () => {
      const { order } = await executeGraphQL(GetOrderDocument, {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: { id: draftOrderCreate.order!.id },
      });
      if (!order) {
        throw new Error('order not found');
      }
      return order;
    },
    ({ authorizeStatus, chargeStatus }) =>
      authorizeStatus !== OrderAuthorizeStatusEnum.None &&
      chargeStatus !== OrderChargeStatusEnum.None
  );

  const { draftOrderComplete } = await executeGraphQL(CompleteDraftOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { id: draftOrderCreate.order!.id },
  });

  if (!draftOrderCreate || draftOrderCreate.errors.length > 0) {
    draftOrderCreate && console.error(draftOrderCreate?.errors);
    throw new Error('complete draft order failed');
  }

  return {
    order: draftOrderComplete!.order!,
    transaction: transactionInitialize!.transaction!,
    transactionEvent: transactionInitialize!.transactionEvent!,
  };
}
