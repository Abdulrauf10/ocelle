import { IndividualRecipePack, Recipe } from './enums';

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 * price = saleor variant price
 */
export const subscriptionProducts = {
  [Recipe.Chicken]: {
    name: 'Fresh Chicken Recipe',
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
    name: 'Fresh Beef Recipe',
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
    name: 'Fresh Duck Recipe',
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
    name: 'Fresh Lamb Recipe',
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
    name: 'Fresh Pork Recipe',
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
    name: 'Tester Bundle',
    slug: 'bundle-pack',
    description: [
      'A complete assortment of nutrient-packed, freshly made food for your dog to sample.',
      '5 Fresh Recipes: Chicken (100g), Beef (100g), Pork (100g), Lamb (100g), Duck (100g).',
    ],
    variant: {
      sku: 'guest-bundle',
      weightKGs: 0.5,
      price: 150,
    },
    zhHant: {
      name: 'Tester Bundle',
      description: [
        'A complete assortment of nutrient-packed, freshly made food for your dog to sample.',
        '5 Fresh Recipes: Chicken (100g), Beef (100g), Pork (100g), Lamb (100g), Duck (100g).',
      ],
    },
  },
  [IndividualRecipePack.Chicken]: {
    name: 'Fresh Chicken Recipe',
    slug: 'chicken-pack',
    description: [
      'A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat.',
    ],
    variant: {
      sku: 'guest-chicken',
      weightKGs: 0.2,
      price: 50,
    },
    zhHant: {
      name: 'Fresh Chicken Recipe',
      description: [
        'A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat.',
      ],
    },
  },
  [IndividualRecipePack.Beef]: {
    name: 'Fresh Beef Recipe',
    slug: 'beef-pack',
    description: [
      'This hearty meal delivers high-quality beef for strength, a rainbow of veggies for antioxidant power, and superfoods to boost immunity. Hit the ground running with every bowl!',
    ],
    variant: {
      sku: 'guest-beef',
      weightKGs: 0.2,
      price: 55,
    },
    zhHant: {
      name: 'Fresh Beef Recipe',
      description: [
        'This hearty meal delivers high-quality beef for strength, a rainbow of veggies for antioxidant power, and superfoods to boost immunity. Hit the ground running with every bowl!',
      ],
    },
  },
  [IndividualRecipePack.Duck]: {
    name: 'Fresh Duck Recipe',
    slug: 'duck-pack',
    description: [
      'A wholesome feast, tailored for digestive health, luxurious coats, and improved vitality! Perfect for dogs seeking a unique and hypoallergenic dining experience without compromising on taste and health.',
    ],
    variant: {
      sku: 'guest-duck',
      weightKGs: 0.2,
      price: 80,
    },
    zhHant: {
      name: 'Fresh Duck Recipe',
      description: [
        'A wholesome feast, tailored for digestive health, luxurious coats, and improved vitality! Perfect for dogs seeking a unique and hypoallergenic dining experience without compromising on taste and health.',
      ],
    },
  },
  [IndividualRecipePack.Lamb]: {
    name: 'Fresh Lamb Recipe',
    slug: 'lamb-pack',
    description: [
      'A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters. Crafted for muscle strength, immune support, radiant health, and a shiny coat!',
    ],
    variant: {
      sku: 'guest-lamb',
      weightKGs: 0.2,
      price: 65,
    },
    zhHant: {
      name: 'Fresh Lamb Recipe',
      description: [
        'A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters. Crafted for muscle strength, immune support, radiant health, and a shiny coat!',
      ],
    },
  },
  [IndividualRecipePack.Pork]: {
    name: 'Fresh Pork Recipe',
    slug: 'pork-pack',
    description: [
      'Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for dogs with sensitive stomachs or allergies!',
    ],
    variant: {
      sku: 'guest-pork',
      weightKGs: 0.2,
      price: 45,
    },
    zhHant: {
      name: 'Fresh Pork Recipe',
      description: [
        'Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for dogs with sensitive stomachs or allergies!',
      ],
    },
  },
};

export const individualPackProductsValues = Object.values(individualPackProducts);
