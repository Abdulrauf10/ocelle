import Button from '@/components/Button';
import Newsletter from '@/components/Newsletter';
import Container from '@/components/Container';
import RecipeBenefits from './Benefits';
import { useTranslations } from 'next-intl';
import Block from '@/components/layouts/Block';
import Marquee from '@/components/Marquee';
import pluralize from 'pluralize';
import ImageContentBlock from '@/components/layouts/ImageContentBlock';
import RecipeIngredientsDialog from '@/components/dialogs/RecipeIngredients';
import { Recipe } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';
import { colon, freshRecipe } from '@/helpers/translation';

function EndAdornment({
  recipe,
  ingredients,
  calorie,
  analysis,
}: {
  recipe: Recipe;
  ingredients: Array<{
    spacing?: number;
    picture: string;
    title: string;
    description: string;
  }>;
  calorie: number;
  analysis: {
    protein: number;
    fat: number;
    fibre: number;
    moisture: number;
  };
}) {
  const t = useTranslations();

  return (
    <div className="mx-auto mt-10 max-w-[480px]">
      <div className="-m-2 flex flex-wrap">
        <div className="w-1/2 p-2 text-center max-xs:w-full">
          <RecipeIngredientsDialog
            recipe={freshRecipe(t, recipe)}
            recipePicture={`/recipes/dispersion/${getRecipeSlug(recipe)}.jpg`}
            ingredients={ingredients}
            calorie={calorie}
            analysis={analysis}
          >
            <Button className="w-[232px]" reverse>
              {t('learn-more')}
            </Button>
          </RecipeIngredientsDialog>
        </div>
        <div className="w-1/2 p-2 text-center max-xs:w-full">
          <Button className="w-[232px]" href="/get-started">
            {t('build-my-plan')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const t = useTranslations();
  const className = {
    container: 'lg:px-20',
    image: 'pt-[80.6%] shadow-[7px_7px_15px_rgba(0,0,0,0.05)]',
  };

  const ingredients = {
    'chicken-breast': {
      picture: '/recipes/ingredients/chicken-breast.png',
      spacing: 15,
      title: t('chicken-breast'),
      description:
        'A lean source of high-quality protein, essential for muscle growth and repair. It also supplies glucosamine and chondroitin, the building blocks of joint cartilage, tendons, and ligaments.',
    },
    'chicken-liver': {
      picture: '/recipes/ingredients/chicken-liver.png',
      spacing: -10,
      title: t('chicken-liver'),
      description:
        'A nutrient powerhouse, packed with iron for healthy blood, vitamin A for sharp vision, B vitamins for energy metabolism, and choline for healthy brain function.',
    },
    'whole-grain-rice': {
      picture: '/recipes/ingredients/whole-grain-rice.png',
      spacing: -20,
      title: t('whole-grain-rice'),
      description:
        "A wholesome source of complex carbohydrates, whole-grain rice provides dogs with sustained energy. It's also gentle on the digestive system, making it a good choice for dogs with sensitive stomachs.",
    },
    'shiitake-mushroom': {
      picture: '/recipes/ingredients/mushroom.png',
      spacing: -20,
      title: pluralize.plural(t('shiitake-mushroom')),
      description:
        'Shiitake mushrooms are known for their immune-boosting properties and are also a good source of B vitamins.',
    },
    spinach: {
      picture: '/recipes/ingredients/spinach.png',
      spacing: -15,
      title: t('spinach'),
      description:
        'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
    },
    peas: {
      picture: '/recipes/ingredients/peas.png',
      spacing: -10,
      title: t('peas'),
      description:
        'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
    },
    cranberry: {
      picture: '/recipes/ingredients/cranberry.png',
      spacing: -30,
      title: pluralize.plural(t('cranberry')),
      description:
        'Rich in antioxidants, cranberries can help support urinary tract health and may prevent urinary infections. They are also beneficial for dental health.',
    },
    flaxseed: {
      picture: '/recipes/ingredients/flaxseed.png',
      spacing: -20,
      title: t('flaxseed'),
      description:
        'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
    },
    'salmon-oil': {
      picture: '/recipes/ingredients/salmon-oil.png',
      spacing: 16,
      title: t('salmon-oil'),
      description:
        'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
    },
    'ocelle-targeted-nutrient-blend': {
      picture: '/recipes/ingredients/targeted-nutrient-blend.png',
      spacing: 70,
      title: t('ocelle-targeted-nutrient-blend'),
      description:
        'Each recipe contains a specific formulation of vitamins and minerals, designed to synergize with our carefully chosen ingredients, ensuring that meals are packed with the life-stage-specific nutrients needed to thrive.',
    },
    'beef-chuck': {
      picture: '/recipes/ingredients/beef-chuck.png',
      spacing: 15,
      title: t('beef-chuck'),
      description:
        "Lean beef chuck is an excellent source of high-quality protein, crucial for muscle maintenance and overall body functions. It's also rich in minerals and essential nutrients, like iron and zinc, which are important for healthier immune systems, stronger bones, and wound healing.",
    },
    'beef-liver': {
      picture: '/recipes/ingredients/beef-liver.png',
      title: t('beef-liver'),
      description:
        'Beef liver is extremely nutrient-dense, offering a rich source of vitamin A for eye health, iron for healthy blood cells, and B vitamins for energy production.',
    },
    carrot: {
      picture: '/recipes/ingredients/carrot.png',
      spacing: 20,
      title: pluralize.plural(t('carrot')),
      description:
        "Carrots are high in beta-carotene, which converts to vitamin A and supports vision health. They're also a good source of fibre, aiding in digestive health, and have antioxidants for immune support.",
    },
    kale: {
      picture: '/recipes/ingredients/kale.png',
      spacing: 15,
      title: t('kale'),
      description:
        'This leafy green is packed with vitamins A, C, and K, along with antioxidants and iron. It supports immune health, vision, and overall wellness.',
    },
    potato: {
      picture: '/recipes/ingredients/potato.png',
      spacing: -20,
      title: pluralize.plural(t('potato')),
      description:
        'Potatoes are a good source of carbohydrates, potassium, and vitamins C and B6. They provide energy and are easily digestible, making them suitable for sensitive stomachs.',
    },
    blueberry: {
      picture: '/recipes/ingredients/blueberry.png',
      spacing: 30,
      title: pluralize.plural(t('blueberry')),
      description:
        'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
    },
    'pork-loin': {
      picture: '/recipes/ingredients/pork-loin.png',
      spacing: 20,
      title: t('pork-loin'),
      description:
        "Pork is lean and a novel protein for most dogs, providing high-quality nutrients for muscle development and overall body function. It's also a good source of B vitamins, particularly B1 (thiamine), which is crucial for carbohydrate metabolism.",
    },
    'pork-liver': {
      picture: '/recipes/ingredients/pork-liver.png',
      spacing: 10,
      title: t('pork-liver'),
      description:
        'Pork liver is nutrient rich, offering high levels of iron and vitamins A and B. These nutrients are key for maintaining healthy vision, blood health, and energy levels.',
    },
    celery: {
      picture: '/recipes/ingredients/celery.png',
      spacing: 20,
      title: t('celery'),
      description:
        'Water spinach is a beneficial leafy green, offering vitamins A and C, iron, and antioxidants. It supports immune health, digestive wellness, and provides anti-inflammatory benefits.',
    },
    'lamb-leg': {
      picture: '/recipes/ingredients/lamb-leg.png',
      spacing: 16,
      title: t('lamb-leg'),
      description:
        "Lamb is a highly palatable meat and an excellent source of quality protein and essential fats, which help with energy levels, proper growth, and overall health. It's also a good source of iron and zinc, which are crucial for immune function and skin health.",
    },
    'duck-breast': {
      picture: '/recipes/ingredients/duck-breast.png',
      title: t('duck-breast'),
      description:
        'Duck is lean and packed with essential amino acids, vitamins, and antioxidants to promote good health. It’s also a novel protein for many dogs, making it suitable for those with sensitivities or allergies.',
    },
    'winter-melon': {
      picture: '/recipes/ingredients/winter-melon.png',
      spacing: 14,
      title: t('winter-melon'),
      description:
        "Winter melon is very low in calories and high in fibre, aiding in digestion. It's also hydrating and can be beneficial for dogs with kidney issues or those needing a low-fat diet.",
    },
    'goji-berry': {
      picture: '/recipes/ingredients/goji-berry.png',
      spacing: -15,
      title: pluralize.plural(t('goji-berry')),
      description:
        'Goji berries are known for their high antioxidant content, supporting immune health, vision, and overall cellular function.',
    },
    'whole-grain-pasta': {
      picture: '/recipes/ingredients/whole-grain-pasta.png',
      spacing: 20,
      title: t('whole-grain-pasta'),
      description:
        'A source of complex carbohydrates, whole grain pasta provides sustained energy. It is also a good source of fibre, which aids in digestion, and B vitamins for energy metabolism.',
    },
  };

  return (
    <main>
      <div className="bg-[url('./recipes-bg-mb.jpg')] bg-[length:100%_auto] bg-bottom bg-repeat-x py-10 max-lg:pb-[70%] lg:bg-[url('./recipes-bg.jpg')] lg:bg-[length:auto_100%] lg:bg-center">
        <div className="px-[2vw] py-[4vw] text-xl text-white max-lg:w-full lg:pr-0">
          <h1 className="heading-headline font-bold">
            Real Food.
            <br />
            That’s Our Secret.
          </h1>
          <div className="w-full lg:w-1/3">
            <p className="body-1 mt-5">
              Crafted to human-grade standards, our recipes are skilfully balanced for total
              nutrition. We use quality proteins and vegetables, combined with targeted vitamins and
              minerals to nourish your dog at every stage of life.
            </p>
            <p className="body-1 mt-3">
              No heat-blasted ingredients. No preservatives. No fillers. No nonsense. Just wholesome
              food that&apos;s as appetizing as it looks.
            </p>
          </div>
          <div className="mt-5">
            <Button href="/get-started">{t('get-started')}</Button>
          </div>
        </div>
      </div>
      <Marquee
        items={[
          {
            icon: '/feature/icon-1.svg',
            alt: t('real-good-food'),
            width: 53,
            height: 46,
            title: t('real-good-food'),
          },
          {
            icon: '/feature/icon-2.svg',
            alt: t('vet-approved'),
            width: 43,
            height: 46,
            title: t('vet-approved'),
          },
          {
            icon: '/feature/icon-3.svg',
            alt: t('human-grade'),
            width: 38,
            height: 46,
            title: t('human-grade'),
          },
          {
            icon: '/feature/icon-4.svg',
            alt: t('made-fresh'),
            width: 38,
            height: 46,
            title: t('made-fresh'),
          },
          {
            icon: '/feature/icon-5.svg',
            alt: t('high-quality-ingredients'),
            width: 36,
            height: 46,
            title: t('high-quality-ingredients'),
          },
          {
            icon: '/feature/icon-6.svg',
            alt: t('no-fillers'),
            width: 40,
            height: 46,
            title: t('no-fillers'),
          },
          {
            icon: '/feature/icon-7.svg',
            alt: t('no-preservatives'),
            width: 40,
            height: 46,
            title: t('no-preservatives'),
          },
          {
            icon: '/feature/icon-8.svg',
            alt: t('no-artificial-flavours'),
            width: 40,
            height: 46,
            title: t('no-artificial-flavours'),
          },
        ]}
      />
      <ImageContentBlock
        className={{
          ...className,
          block: 'bg-primary bg-opacity-10',
        }}
        image={`/recipes/${getRecipeSlug(Recipe.Chicken)}.jpg`}
        alt={freshRecipe(t, Recipe.Chicken)}
        endAdornment={
          <EndAdornment
            recipe={Recipe.Chicken}
            ingredients={[
              ingredients['chicken-breast'],
              ingredients['chicken-liver'],
              ingredients['whole-grain-rice'],
              ingredients['shiitake-mushroom'],
              ingredients['spinach'],
              ingredients['peas'],
              ingredients['cranberry'],
              ingredients['flaxseed'],
              ingredients['salmon-oil'],
              ingredients['ocelle-targeted-nutrient-blend'],
            ]}
            calorie={1540}
            analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
          />
        }
      >
        <div className="max-md:px-2">
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(t, Recipe.Chicken)}</h2>
          <p className="body-1 mt-4">
            A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend
            of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a
            shiny coat.
          </p>
          <p className="heading-4 mt-6 font-bold text-brown">{colon(t, 'ingredients')}</p>
          <p className="body-1">
            {[
              t('chicken-breast'),
              t('chicken-liver'),
              t('whole-grain-rice'),
              pluralize.plural(t('shiitake-mushroom')),
              t('spinach'),
              t('peas'),
              pluralize.plural(t('cranberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
            ].join(t('comma')) + t('dot')}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={className}
        image={`/recipes/${getRecipeSlug(Recipe.Beef)}.jpg`}
        alt={freshRecipe(t, Recipe.Beef)}
        reverse
        endAdornment={
          <EndAdornment
            recipe={Recipe.Beef}
            ingredients={[
              ingredients['beef-chuck'],
              ingredients['beef-liver'],
              ingredients['carrot'],
              ingredients['kale'],
              ingredients['peas'],
              ingredients['potato'],
              ingredients['blueberry'],
              ingredients['flaxseed'],
              ingredients['salmon-oil'],
              ingredients['ocelle-targeted-nutrient-blend'],
            ]}
            calorie={1540}
            analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
          />
        }
      >
        <div className="max-md:px-2">
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(t, Recipe.Beef)}</h2>
          <p className="body-1 mt-4">
            This hearty meal delivers high-quality beef for strength, a rainbow of veggies for
            antioxidant power, and superfoods to boost immunity. Hit the ground running with every
            bowl!
          </p>
          <p className="heading-4 mt-6 font-bold text-brown">{colon(t, 'ingredients')}</p>
          <p className="body-1">
            {[
              t('beef-chuck'),
              t('beef-liver'),
              pluralize.plural(t('potato')),
              pluralize.plural(t('carrot')),
              t('kale'),
              t('peas'),
              pluralize.plural(t('blueberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
            ].join(t('comma')) + t('dot')}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={{
          ...className,
          block: 'bg-gold bg-opacity-10',
        }}
        image={`/recipes/${getRecipeSlug(Recipe.Pork)}.jpg`}
        alt={freshRecipe(t, Recipe.Pork)}
        endAdornment={
          <EndAdornment
            recipe={Recipe.Pork}
            ingredients={[
              ingredients['pork-loin'],
              ingredients['pork-liver'],
              ingredients['celery'],
              ingredients['potato'],
              ingredients['peas'],
              ingredients['spinach'],
              ingredients['blueberry'],
              ingredients['flaxseed'],
              ingredients['salmon-oil'],
              ingredients['ocelle-targeted-nutrient-blend'],
            ]}
            calorie={1540}
            analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
          />
        }
      >
        <div className="max-md:px-2">
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(t, Recipe.Pork)}</h2>
          <p className="body-1 mt-4">
            Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with
            leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for
            dogs with sensitive stomachs or allergies!
          </p>
          <p className="heading-4 mt-6 font-bold text-brown">{colon(t, 'ingredients')}</p>
          <p className="body-1">
            {[
              t('pork-loin'),
              t('pork-liver'),
              t('celery'),
              pluralize.plural(t('potato')),
              t('spinach'),
              t('peas'),
              pluralize.plural(t('blueberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
            ].join(t('comma')) + t('dot')}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={className}
        image={`/recipes/${getRecipeSlug(Recipe.Lamb)}.jpg`}
        alt={freshRecipe(t, Recipe.Lamb)}
        reverse
        endAdornment={
          <EndAdornment
            recipe={Recipe.Lamb}
            ingredients={[
              ingredients['lamb-leg'],
              ingredients['beef-liver'],
              ingredients['whole-grain-rice'],
              ingredients['peas'],
              ingredients['spinach'],
              ingredients['blueberry'],
              ingredients['flaxseed'],
              ingredients['salmon-oil'],
              ingredients['ocelle-targeted-nutrient-blend'],
            ]}
            calorie={1540}
            analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
          />
        }
      >
        <div className="max-md:px-2">
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(t, Recipe.Lamb)}</h2>
          <p className="body-1 mt-4">
            A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters.
            Crafted for muscle strength, immune support, radiant health, and a shiny coat!
          </p>
          <p className="heading-4 mt-6 font-bold text-brown">{colon(t, 'ingredients')}</p>
          <p className="body-1">
            {[
              t('lamb-leg-boneless'),
              t('beef-liver'),
              t('whole-grain-rice'),
              t('peas'),
              t('spinach'),
              pluralize.plural(t('blueberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
            ].join(t('comma')) + t('dot')}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={{
          ...className,
          block: 'bg-primary bg-opacity-10',
        }}
        image={`/recipes/${getRecipeSlug(Recipe.Duck)}.jpg`}
        alt={freshRecipe(t, Recipe.Duck)}
        endAdornment={
          <EndAdornment
            recipe={Recipe.Duck}
            ingredients={[
              ingredients['duck-breast'],
              ingredients['chicken-liver'],
              ingredients['winter-melon'],
              ingredients['peas'],
              ingredients['goji-berry'],
              ingredients['flaxseed'],
              ingredients['whole-grain-pasta'],
              ingredients['salmon-oil'],
              ingredients['ocelle-targeted-nutrient-blend'],
            ]}
            calorie={1540}
            analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
          />
        }
      >
        <div className="max-md:px-2">
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(t, Recipe.Duck)}</h2>
          <p className="body-1 mt-4">
            A wholesome feast, tailored for digestive health, luxurious coats, and improved
            vitality! Perfect for dogs seeking a unique and hypoallergenic dining experience without
            compromising on taste and health.
          </p>
          <p className="heading-4 mt-6 font-bold text-brown">{colon(t, 'ingredients')}</p>
          <p className="body-1">
            {[
              t('duck-breast'),
              t('chicken-liver'),
              t('whole-grain-pasta'),
              t('winter-melon'),
              t('peas'),
              pluralize.plural(t('goji-berry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
            ].join(t('comma')) + t('dot')}
          </p>
        </div>
      </ImageContentBlock>
      <Block className="bg-gold bg-opacity-10">
        <Container className="lg:px-20">
          <RecipeBenefits />
        </Container>
      </Block>
      <Block>
        <Container className="text-center">
          <h2 className="heading-3 font-bold text-primary">
            Freshen Up With A Science First Approach To Pet Food
          </h2>
          <p className="body-1 mt-6">
            Get fresh food conveniently delivered with our customised meal plans.
          </p>
          <Button className="mt-6" href="/get-started">
            {t('create-your-plan')}
          </Button>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
