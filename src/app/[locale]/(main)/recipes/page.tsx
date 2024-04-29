import Button from '@/components/buttons/Button';
import Newsletter from '@/components/Newsletter';
import Container from '@/components/Container';
import RecipeBenefits from './Benefits';
import { useTranslations } from 'next-intl';
import Block from '@/components/layouts/Block';
import Marquee from '@/components/Marquee';
import pluralize from 'pluralize';
import ImageContentBlock from '@/components/layouts/ImageContentBlock';
import RecipeLargeDialog from '@/components/dialogs/RecipeLarge';
import { Recipe } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';
import { arrayToSentence, colon, freshRecipe } from '@/helpers/translation';

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
  const r = useTranslations('Recipes');
  const b = useTranslations('Button');

  return (
    <div className="mx-auto mt-10 max-w-[480px]">
      <div className="-m-2 flex flex-wrap">
        <div className="w-1/2 p-2 text-center max-xs:w-full">
          <RecipeLargeDialog
            recipe={freshRecipe(r, recipe)}
            recipePicture={`/recipes/dispersion/${getRecipeSlug(recipe)}.jpg`}
            ingredients={ingredients}
            calorie={calorie}
            analysis={analysis}
          >
            <Button className="w-[232px]" reverse>
              {b('learn-more')}
            </Button>
          </RecipeLargeDialog>
        </div>
        <div className="w-1/2 p-2 text-center max-xs:w-full">
          <Button className="w-[232px]" href="/get-started">
            {b('build-my-plan')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const t = useTranslations();
  const r = useTranslations('Recipes');
  const m = useTranslations('Marquee');
  const b = useTranslations('Button');
  const i = useTranslations('Ingredients');
  const className = {
    container: 'lg:px-20',
    image: 'pt-[80.6%] shadow-[7px_7px_15px_rgba(0,0,0,0.05)]',
  };

  const ingredients = {
    'chicken-breast': {
      picture: '/recipes/ingredients/chicken-breast.png',
      spacing: 15,
      title: i('chicken-breast'),
      description: i('chicken-brest-description'),
    },
    'chicken-liver': {
      picture: '/recipes/ingredients/chicken-liver.png',
      spacing: -10,
      title: i('chicken-liver'),
      description: i('chicken-liver-description'),
    },
    'whole-grain-rice': {
      picture: '/recipes/ingredients/whole-grain-rice.png',
      spacing: -20,
      title: i('whole-grain-rice'),
      description: i('whole-grain-rice-description'),
    },
    'shiitake-mushroom': {
      picture: '/recipes/ingredients/mushroom.png',
      spacing: -20,
      title: pluralize.plural(i('shiitake-mushroom')),
      description: i('shiitake-mushroom-description'),
    },
    spinach: {
      picture: '/recipes/ingredients/spinach.png',
      spacing: -15,
      title: i('spinach'),
      description: i('spinach-description'),
    },
    peas: {
      picture: '/recipes/ingredients/peas.png',
      spacing: -10,
      title: i('peas'),
      description: i('peas-description'),
    },
    cranberry: {
      picture: '/recipes/ingredients/cranberry.png',
      spacing: -30,
      title: pluralize.plural(i('cranberry')),
      description: i('cranberry-description'),
    },
    flaxseed: {
      className: 'translate-x-0.5',
      picture: '/recipes/ingredients/flaxseed.png',
      spacing: -20,
      title: i('flaxseed'),
      description: i('flaxseed-description'),
    },
    'salmon-oil': {
      picture: '/recipes/ingredients/salmon-oil.png',
      spacing: 16,
      title: i('salmon-oil'),
      description: i('salmon-oil-description'),
    },
    'ocelle-targeted-nutrient-blend': {
      picture: '/recipes/ingredients/targeted-nutrient-blend.png',
      spacing: 70,
      title: i('ocelle-targeted-nutrient-blend'),
      description: i('ocelle-targeted-nutrient-blend-description'),
    },
    'beef-chuck': {
      picture: '/recipes/ingredients/beef-chuck.png',
      spacing: 15,
      title: i('beef-chuck'),
      description: i('beef-chuck-description'),
    },
    'beef-liver': {
      picture: '/recipes/ingredients/beef-liver.png',
      title: i('beef-liver'),
      description: i('beef-liver-description'),
    },
    carrot: {
      picture: '/recipes/ingredients/carrot.png',
      spacing: 20,
      title: pluralize.plural(i('carrot')),
      description: i('carrot-description'),
    },
    kale: {
      picture: '/recipes/ingredients/kale.png',
      spacing: 15,
      title: i('kale'),
      description: i('kale-description'),
    },
    potato: {
      picture: '/recipes/ingredients/potato.png',
      spacing: -20,
      title: pluralize.plural(i('potato')),
      description: i('potato-description'),
    },
    blueberry: {
      picture: '/recipes/ingredients/blueberry.png',
      spacing: 30,
      title: pluralize.plural(i('blueberry')),
      description: i('blueberry-description'),
    },
    'pork-loin': {
      picture: '/recipes/ingredients/pork-loin.png',
      spacing: 20,
      title: i('pork-loin'),
      description: i('peas-description'),
    },
    'pork-liver': {
      picture: '/recipes/ingredients/pork-liver.png',
      spacing: 10,
      title: i('pork-liver'),
      description: i('pork-liver-description'),
    },
    celery: {
      picture: '/recipes/ingredients/celery.png',
      spacing: 20,
      title: i('celery'),
      description: i('celery-description'),
    },
    'lamb-leg': {
      picture: '/recipes/ingredients/lamb-leg.png',
      spacing: 16,
      title: i('lamb-leg'),
      description: i('lamb-leg-description'),
    },
    'duck-breast': {
      picture: '/recipes/ingredients/duck-breast.png',
      title: i('duck-breast'),
      description: i('duck-breast-description'),
    },
    'winter-melon': {
      picture: '/recipes/ingredients/winter-melon.png',
      spacing: 14,
      title: i('winter-melon'),
      description: i('winter-melon-description'),
    },
    'goji-berry': {
      picture: '/recipes/ingredients/goji-berry.png',
      spacing: -15,
      title: pluralize.plural(i('goji-berry')),
      description: i('goji-berry-description'),
    },
    'whole-grain-pasta': {
      picture: '/recipes/ingredients/whole-grain-pasta.png',
      spacing: 20,
      title: i('whole-grain-pasta'),
      description: i('whole-grain-pasta-description'),
    },
  };

  return (
    <main className="overflow-x-hidden">
      <div className="bg-[url('./recipes-bg-mb.jpg')] bg-[length:100%_auto] bg-bottom bg-repeat-x py-10 max-lg:pb-[70%] lg:bg-[url('./recipes-bg.jpg')] lg:bg-[length:auto_100%] lg:bg-center">
        <div className="px-[2vw] py-[4vw] text-xl text-white max-lg:w-full lg:pr-0">
          <h1 className="heading-headline grid font-bold">
            <span>{r('block-1-title-1')}</span>
            <span>{r('block-1-title-2')}</span>
          </h1>
          <div className="w-full lg:w-1/3">
            <p className="body-1 mt-5">{r('block-1-content-1')}</p>
            <p className="body-1 mt-3">{r('block-1-content-2')}</p>
          </div>
          <div className="mt-5">
            <Button href="/get-started">{b('get-started')}</Button>
          </div>
        </div>
      </div>
      <Marquee
        items={[
          {
            icon: '/feature/icon-1.svg',
            alt: m('real-good-food'),
            width: 50,
            height: 50,
            title: m('real-good-food'),
          },
          {
            icon: '/feature/icon-2.svg',
            alt: m('vet-approved'),
            width: 50,
            height: 50,
            title: m('vet-approved'),
          },
          {
            icon: '/feature/icon-3.svg',
            alt: m('human-grade'),
            width: 50,
            height: 50,
            title: m('human-grade'),
          },
          {
            icon: '/feature/icon-4.svg',
            alt: m('made-fresh'),
            width: 50,
            height: 50,
            title: m('made-fresh'),
          },
          {
            icon: '/feature/icon-5.svg',
            alt: m('high-quality-ingredients'),
            width: 50,
            height: 50,
            title: m('high-quality-ingredients'),
          },
          {
            icon: '/feature/icon-6.svg',
            alt: m('no-fillers'),
            width: 50,
            height: 50,
            title: m('no-fillers'),
          },
          {
            icon: '/feature/icon-7.svg',
            alt: m('no-preservatives'),
            width: 50,
            height: 50,
            title: m('no-preservatives'),
          },
          {
            icon: '/feature/icon-8.svg',
            alt: m('no-artificial-flavours'),
            width: 50,
            height: 50,
            title: m('no-artificial-flavours'),
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
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(r, Recipe.Chicken)}</h2>
          <p className="body-1 mt-4">{r('block-2-content')}</p>
          <p className="heading-4 mt-6 font-bold text-gold">{colon(r, 'ingredients')}</p>
          <p className="body-1">
            {arrayToSentence(i, [
              i('chicken-breast'),
              i('chicken-liver'),
              i('whole-grain-rice'),
              pluralize.plural(i('shiitake-mushroom')),
              i('spinach'),
              i('peas'),
              pluralize.plural(i('cranberry')),
              i('flaxseed'),
              i('salmon-oil'),
              i('ocelle-targeted-nutrient-blend'),
            ])}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={className}
        image={`/recipes/${getRecipeSlug(Recipe.Beef)}.jpg`}
        alt={freshRecipe(r, Recipe.Beef)}
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
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(r, Recipe.Beef)}</h2>
          <p className="body-1 mt-4">{r('block-3-content')}</p>
          <p className="heading-4 mt-6 font-bold text-gold">{colon(r, 'ingredients')}</p>
          <p className="body-1">
            {arrayToSentence(i, [
              i('beef-chuck'),
              i('beef-liver'),
              pluralize.plural(i('potato')),
              pluralize.plural(i('carrot')),
              i('kale'),
              i('peas'),
              pluralize.plural(i('blueberry')),
              i('flaxseed'),
              i('salmon-oil'),
              i('ocelle-targeted-nutrient-blend'),
            ])}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={{
          ...className,
          block: 'bg-gold bg-opacity-10',
        }}
        image={`/recipes/${getRecipeSlug(Recipe.Pork)}.jpg`}
        alt={freshRecipe(r, Recipe.Pork)}
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
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(r, Recipe.Pork)}</h2>
          <p className="body-1 mt-4">{r('block-3-content')}</p>
          <p className="heading-4 mt-6 font-bold text-gold">{colon(r, 'ingredients')}</p>
          <p className="body-1">
            {arrayToSentence(i, [
              i('pork-loin'),
              i('pork-liver'),
              i('celery'),
              pluralize.plural(i('potato')),
              i('spinach'),
              i('peas'),
              pluralize.plural(i('blueberry')),
              i('flaxseed'),
              i('salmon-oil'),
              i('ocelle-targeted-nutrient-blend'),
            ])}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={className}
        image={`/recipes/${getRecipeSlug(Recipe.Lamb)}.jpg`}
        alt={freshRecipe(r, Recipe.Lamb)}
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
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(r, Recipe.Lamb)}</h2>
          <p className="body-1 mt-4">{r('block-4-content')}</p>
          <p className="heading-4 mt-6 font-bold text-gold">{colon(r, 'ingredients')}</p>
          <p className="body-1">
            {arrayToSentence(i, [
              i('lamb-leg-boneless'),
              i('beef-liver'),
              i('whole-grain-rice'),
              i('peas'),
              i('spinach'),
              pluralize.plural(i('blueberry')),
              i('flaxseed'),
              i('salmon-oil'),
              i('ocelle-targeted-nutrient-blend'),
            ])}
          </p>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        className={{
          ...className,
          block: 'bg-primary bg-opacity-10',
        }}
        image={`/recipes/${getRecipeSlug(Recipe.Duck)}.jpg`}
        alt={freshRecipe(r, Recipe.Duck)}
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
          <h2 className="heading-3 font-bold text-primary">{freshRecipe(r, Recipe.Duck)}</h2>
          <p className="body-1 mt-4">{r('block-5-content')}</p>
          <p className="heading-4 mt-6 font-bold text-gold">{colon(r, 'ingredients')}</p>
          <p className="body-1">
            {arrayToSentence(i, [
              i('duck-breast'),
              i('chicken-liver'),
              i('whole-grain-pasta'),
              i('winter-melon'),
              i('peas'),
              pluralize.plural(i('goji-berry')),
              i('flaxseed'),
              i('salmon-oil'),
              i('ocelle-targeted-nutrient-blend'),
            ])}
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
          <h2 className="heading-3 font-bold text-primary">{r('block-8-title')}</h2>
          <p className="body-1 mt-6">{r('block-8-content')}</p>
          <Button className="mt-6" href="/get-started">
            {b('create-your-plan')}
          </Button>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
