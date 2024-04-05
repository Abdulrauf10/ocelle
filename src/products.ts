import { IndividualRecipePack, Recipe } from './enums';

/**
 * used in saleor product variant unit price
 */
export const saleorSubscriptionProductUnitPrice = 0.1;

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 * price = saleor variant price
 */
export const subscriptionProducts = {
  [Recipe.Chicken]: {
    name: 'S: Fresh Chicken Recipe',
    slug: 'fresh-chicken-subscription',
    variants: {
      Puppy: {
        sku: 'subs-chicken-puppy',
        pricePerUnit: 0.17976,
      },
      Adult: {
        sku: 'subs-chicken-adult',
        pricePerUnit: 0.16976,
      },
      Senior: {
        sku: 'subs-chicken-senior',
        pricePerUnit: 0.16476,
      },
    },
  },
  [Recipe.Beef]: {
    name: 'S: Fresh Beef Recipe',
    slug: 'fresh-beef-subscription',
    variants: {
      Puppy: {
        sku: 'subs-beef-puppy',
        pricePerUnit: 0.18922,
      },
      Adult: {
        sku: 'subs-beef-adult',
        pricePerUnit: 0.17922,
      },
      Senior: {
        sku: 'subs-beef-senior',
        pricePerUnit: 0.17422,
      },
    },
  },
  [Recipe.Duck]: {
    name: 'S: Fresh Duck Recipe',
    slug: 'fresh-duck-subscription',
    variants: {
      Puppy: {
        sku: 'subs-duck-puppy',
        pricePerUnit: 0.36791,
      },
      Adult: {
        sku: 'subs-duck-adult',
        pricePerUnit: 0.35791,
      },
      Senior: {
        sku: 'subs-duck-senior',
        pricePerUnit: 0.35291,
      },
    },
  },
  [Recipe.Lamb]: {
    name: 'S: Fresh Lamb Recipe',
    slug: 'fresh-lamb-subscription',
    variants: {
      Puppy: {
        sku: 'subs-lamb-puppy',
        pricePerUnit: 0.29342,
      },
      Adult: {
        sku: 'subs-lamb-adult',
        pricePerUnit: 0.28342,
      },
      Senior: {
        sku: 'subs-lamb-senior',
        pricePerUnit: 0.27842,
      },
    },
  },
  [Recipe.Pork]: {
    name: 'S: Fresh Pork Recipe',
    slug: 'fresh-pork-subscription',
    variants: {
      Puppy: {
        sku: 'subs-pork-puppy',
        pricePerUnit: 0.15093,
      },
      Adult: {
        sku: 'subs-pork-adult',
        pricePerUnit: 0.14093,
      },
      Senior: {
        sku: 'subs-pork-senior',
        pricePerUnit: 0.13593,
      },
    },
  },
};

export const subscriptionProductsValues = Object.values(subscriptionProducts);

export const individualPackProducts = {
  [IndividualRecipePack.Bundle]: {
    name: 'Test Bundle',
    slug: 'bundle-pack',
    variant: {
      sku: 'guest-bundle',
      weightKGs: 0.5,
      price: 150,
    },
  },
  [IndividualRecipePack.Chicken]: {
    name: 'Fresh Chicken Recipe',
    slug: 'chicken-pack',
    variant: {
      sku: 'guest-chicken',
      weightKGs: 0.2,
      price: 50,
    },
  },
  [IndividualRecipePack.Beef]: {
    name: 'Fresh Beef Recipe',
    slug: 'beef-pack',
    variant: {
      sku: 'guest-beef',
      weightKGs: 0.2,
      price: 55,
    },
  },
  [IndividualRecipePack.Duck]: {
    name: 'Fresh Duck Recipe',
    slug: 'duck-pack',
    variant: {
      sku: 'guest-duck',
      weightKGs: 0.2,
      price: 80,
    },
  },
  [IndividualRecipePack.Lamb]: {
    name: 'Fresh Lamb Recipe',
    slug: 'lamb-pack',
    variant: {
      sku: 'guest-lamb',
      weightKGs: 0.2,
      price: 65,
    },
  },
  [IndividualRecipePack.Pork]: {
    name: 'Fresh Pork Recipe',
    slug: 'pork-pack',
    variant: {
      sku: 'guest-pork',
      weightKGs: 0.2,
      price: 45,
    },
  },
};

export const individualPackProductsValues = Object.values(individualPackProducts);
