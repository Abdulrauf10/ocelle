import { IndividualRecipePack, Recipe } from './enums';
import { LifeStage } from './enums';
import { LanguageCodeEnum } from './gql/graphql';

export function getSubRecipeSlug(recipe1: Recipe, recipe2?: Recipe) {
  if (!recipe2) {
    return `fresh-${recipe1.toLowerCase()}-subs`;
  }
  const recipes = [recipe1, recipe2].sort();
  return `fresh-${recipes[0].toLowerCase()}-${recipes[1].toLowerCase()}-subs`;
}

export function getSubRecipeSKU(lifeStage: LifeStage, recipe1: Recipe, recipe2?: Recipe) {
  if (!recipe2) {
    return `subs-${recipe1.toLowerCase()}-${lifeStage.toLowerCase()}`;
  }
  const recipes = [recipe1, recipe2].sort();
  return `subs-${recipes[0].toLowerCase()}-${recipes[1].toLowerCase()}-${lifeStage.toLowerCase()}`;
}

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 * price = saleor variant price
 */
export const subscriptionProducts: {
  [key in Recipe]: {
    name: string;
    slug: string;
    variants: { [key in LifeStage]: { unitPrice: number } };
  };
} = {
  [Recipe.Chicken]: {
    name: 'Fresh Chicken Recipe',
    slug: getSubRecipeSlug(Recipe.Chicken),
    variants: {
      [LifeStage.Puppy]: {
        unitPrice: 1797.6,
      },
      [LifeStage.Adult]: {
        unitPrice: 1697.6,
      },
      [LifeStage.Senior]: {
        unitPrice: 1647.6,
      },
    },
  },
  [Recipe.Beef]: {
    name: 'Fresh Beef Recipe',
    slug: getSubRecipeSlug(Recipe.Beef),
    variants: {
      [LifeStage.Puppy]: {
        unitPrice: 1892.19,
      },
      [LifeStage.Adult]: {
        unitPrice: 1792.19,
      },
      [LifeStage.Senior]: {
        unitPrice: 1742.19,
      },
    },
  },
  [Recipe.Duck]: {
    name: 'Fresh Duck Recipe',
    slug: getSubRecipeSlug(Recipe.Duck),
    variants: {
      [LifeStage.Puppy]: {
        unitPrice: 3679.06,
      },
      [LifeStage.Adult]: {
        unitPrice: 3579.06,
      },
      [LifeStage.Senior]: {
        unitPrice: 3529.06,
      },
    },
  },
  [Recipe.Lamb]: {
    name: 'Fresh Lamb Recipe',
    slug: getSubRecipeSlug(Recipe.Lamb),
    variants: {
      [LifeStage.Puppy]: {
        unitPrice: 2934.25,
      },
      [LifeStage.Adult]: {
        unitPrice: 2834.25,
      },
      [LifeStage.Senior]: {
        unitPrice: 2784.25,
      },
    },
  },
  [Recipe.Pork]: {
    name: 'Fresh Pork Recipe',
    slug: getSubRecipeSlug(Recipe.Pork),
    variants: {
      [LifeStage.Puppy]: {
        unitPrice: 1509.3,
      },
      [LifeStage.Adult]: {
        unitPrice: 1409.3,
      },
      [LifeStage.Senior]: {
        unitPrice: 1359.3,
      },
    },
  },
};

export const subscriptionProductsValues = Object.entries(subscriptionProducts).map(
  ([recipe, values]) => ({ ...values, recipe: recipe as Recipe })
);

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
    translation: {
      [LanguageCodeEnum.ZhHant]: {
        name: '鮮食體驗組合',
        description: [
          '為您的狗狗提供一系列新鮮製造、營養滿分的鮮食，讓狗狗開展美食探索之旅',
          '5 款鮮食食譜：雞肉，牛肉，豬肉，羊肉，鴨肉',
        ],
      },
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
    translation: {
      [LanguageCodeEnum.ZhHant]: {
        name: '鮮雞肉食譜',
        description: [
          '為腸胃較敏感的狗狗而設，成份溫和兼美味的食譜。混合高蛋白質、全穀物及含富抗氧化的超級食物，有助健康、提高活力及保持毛髮光澤。',
        ],
      },
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
    translation: {
      [LanguageCodeEnum.ZhHant]: {
        name: '鮮牛肉食譜',
        description: [
          '營養豐富的牛肉食譜可增強體力，各色蔬菜具有強效抗氧化作用，並有超級食物提升免疫力。每一餐都為狗狗加添活力！',
        ],
      },
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
    translation: {
      [LanguageCodeEnum.ZhHant]: {
        name: '鮮鴨肉食譜',
        description: [
          '專為改善狗狗腸道健康、令毛髮光澤亮麗和提高活力而設！適合尋求低敏飲食且不影響味道和健康的狗狗。',
        ],
      },
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
    translation: {
      [LanguageCodeEnum.ZhHant]: {
        name: '鮮羊肉食譜',
        description: [
          '營養與美味並存，輕鬆征服挑食的狗狗。專為強化肌肉、增強免疫力，並讓毛髮光澤亮麗，每一口都令狗狗精神煥發！',
        ],
      },
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
    translation: {
      [LanguageCodeEnum.ZhHant]: {
        name: '鮮豬肉食譜',
        description: [
          '透過低敏食譜，全面照顧狗狗的營養所需。結合了新型蛋白質及綠菜蔬菜，有助消化、增強免疫力，並讓毛髮光澤亮麗。非常適合腸胃敏感或過敏的狗狗！',
        ],
      },
    },
  },
};

export const individualPackProductsValues = Object.values(individualPackProducts);
