import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import pluralize from 'pluralize';

import RecipeBenefits from './Benefits';

import Container from '@/components/Container';
import Marquee from '@/components/Marquee';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import RecipeLargeDialog from '@/components/dialogs/RecipeLarge';
import Block from '@/components/layouts/Block';
import ImageContentBlock from '@/components/layouts/ImageContentBlock';
import { Recipe } from '@/enums';
import RecipeHelper from '@/helpers/recipe';
import useSentence from '@/hooks/useSentence';

function EndAdornment({
  className,
  recipe,
  ingredients,
  calorie,
  analysis,
}: {
  className?: {
    picture?: string;
  };
  recipe: Recipe;
  ingredients: Array<{
    spacing?: number;
    picture: string;
    title: string;
    description: React.ReactNode;
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
  const sentence = useSentence();

  return (
    <div className="mx-auto mt-10 max-w-[480px]">
      <div className="-m-2 flex flex-wrap">
        <div className="flex-1 p-2 text-center">
          <RecipeLargeDialog
            recipe={sentence.recipe(recipe)}
            picture={
              <div
                className={clsx(
                  'relative overflow-hidden rounded-[30px] bg-gradient-to-b from-30% to-white pt-[100%]',
                  className?.picture
                )}
              >
                <Image
                  src={`/dispersion/${RecipeHelper.getSlug(recipe)}.gif`}
                  alt=""
                  role="presentation"
                  fill
                  unoptimized
                  className="object-contain object-bottom"
                />
              </div>
            }
            ingredients={ingredients}
            calorie={calorie}
            analysis={analysis}
          >
            <Button className="w-[232px]" reverse>
              {b('learn-more')}
            </Button>
          </RecipeLargeDialog>
        </div>
        <div className="flex-1 p-2 text-center">
          <Button className="w-[232px] lang-zh:px-[8px]" href="/get-started">
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
  const sentence = useSentence();
  const className = {
    container: 'lg:px-20',
    image: 'pt-[80.6%] drop-shadow-style-6 shadow-[rgba(65,62,56,0.3)]',
  };

  const ingredients = {
    'chicken-breast': {
      picture: '/ingredients/chicken-breast.png',
      spacing: 15,
      title: i('chicken-breast'),
      description: i('chicken-brest-description'),
    },
    'chicken-liver': {
      picture: '/ingredients/chicken-liver.png',
      spacing: -10,
      title: i('chicken-liver'),
      description: i('chicken-liver-description'),
    },
    'whole-grain-rice': {
      picture: '/ingredients/whole-grain-rice.png',
      spacing: -20,
      title: i('whole-grain-rice'),
      description: i.rich('whole-grain-rice-description'),
    },
    'shiitake-mushroom': {
      picture: '/ingredients/mushroom.png',
      spacing: -20,
      title: pluralize.plural(i('shiitake-mushroom')),
      description: i('shiitake-mushroom-description'),
    },
    spinach: {
      picture: '/ingredients/spinach.png',
      spacing: -15,
      title: i('spinach'),
      description: i('spinach-description'),
    },
    peas: {
      picture: '/ingredients/peas.png',
      spacing: -10,
      title: i('peas'),
      description: i('peas-description'),
    },
    cranberry: {
      picture: '/ingredients/cranberry.png',
      spacing: -30,
      title: pluralize.plural(i('cranberry')),
      description: i('cranberry-description'),
    },
    flaxseed: {
      className: 'translate-x-0.5',
      picture: '/ingredients/flaxseed.png',
      spacing: -20,
      title: i('flaxseed'),
      description: i('flaxseed-description'),
    },
    'salmon-oil': {
      picture: '/ingredients/salmon-oil.png',
      spacing: 16,
      title: i('salmon-oil'),
      description: i('salmon-oil-description'),
    },
    'ocelle-targeted-nutrient-blend': {
      picture: '/ingredients/targeted-nutrient-blend.png',
      spacing: 70,
      title: i('ocelle-targeted-nutrient-blend'),
      description: i('ocelle-targeted-nutrient-blend-description'),
    },
    'beef-chuck': {
      picture: '/ingredients/beef-chuck.png',
      spacing: 15,
      title: i('beef-chuck'),
      description: i.rich('beef-chuck-description'),
    },
    'beef-liver': {
      picture: '/ingredients/beef-liver.png',
      title: i('beef-liver'),
      description: i('beef-liver-description'),
    },
    carrot: {
      picture: '/ingredients/carrot.png',
      spacing: 20,
      title: pluralize.plural(i('carrot')),
      description: i.rich('carrot-description'),
    },
    kale: {
      picture: '/ingredients/kale.png',
      spacing: 15,
      title: i('kale'),
      description: i('kale-description'),
    },
    potato: {
      picture: '/ingredients/potato.png',
      spacing: -20,
      title: pluralize.plural(i('potato')),
      description: i('potato-description'),
    },
    blueberry: {
      picture: '/ingredients/blueberry.png',
      spacing: 30,
      title: pluralize.plural(i('blueberry')),
      description: i('blueberry-description'),
    },
    'pork-loin': {
      picture: '/ingredients/pork-loin.png',
      spacing: 20,
      title: i('pork-loin'),
      description: i.rich('pork-loin-description'),
    },
    'pork-liver': {
      picture: '/ingredients/pork-liver.png',
      spacing: 10,
      title: i('pork-liver'),
      description: i('pork-liver-description'),
    },
    celery: {
      picture: '/ingredients/celery.png',
      spacing: 20,
      title: i('celery'),
      description: i('celery-description'),
    },
    'lamb-leg': {
      picture: '/ingredients/lamb-leg.png',
      spacing: 16,
      title: i('lamb-leg'),
      description: i.rich('lamb-leg-description'),
    },
    'duck-breast': {
      picture: '/ingredients/duck-breast.png',
      title: i('duck-breast'),
      description: i.rich('duck-breast-description'),
    },
    'winter-melon': {
      picture: '/ingredients/winter-melon.png',
      spacing: 14,
      title: i('winter-melon'),
      description: i.rich('winter-melon-description'),
    },
    'goji-berry': {
      picture: '/ingredients/goji-berry.png',
      spacing: -15,
      title: pluralize.plural(i('goji-berry')),
      description: i('goji-berry-description'),
    },
    'whole-grain-pasta': {
      picture: '/ingredients/whole-grain-pasta.png',
      spacing: 20,
      title: i('whole-grain-pasta'),
      description: i('whole-grain-pasta-description'),
    },
  };

  return (
    <main className="overflow-x-hidden">
      <div
        className="bg-[#3c2215] bg-[url('/recipes/recipes-bg-mb.jpg')] bg-[length:100%_auto] bg-bottom bg-no-repeat py-[55px]
       max-xl:lang-zh:pb-[57%] max-lg:lang-en:pb-[57%] lg:lang-en:bg-[#4f3d33] lg:lang-en:bg-[url('/recipes/recipes-bg.jpg')] lg:lang-en:bg-[length:auto_100%]
        lg:lang-en:bg-[calc(50%+60px)_center] xl:lang-zh:bg-[#4f3d33] xl:lang-zh:bg-[url('/recipes/recipes-bg.jpg')] xl:lang-zh:bg-[length:auto_100%] xl:lang-zh:bg-[calc(50%+60px)_center]"
      >
        <Container>
          {/* <div className="py-[4vw] text-xl text-white max-lg:w-full lg:pr-0"> */}
          <div className="text-xl text-white max-xl:lang-zh:w-full max-lg:lang-en:w-full lg:lang-en:pr-0 xl:lang-zh:pr-0">
            <h1 className="heading-headline heading-weight-1 grid">
              <span>{r.rich('block-1-title')}</span>
            </h1>
            <div className="w-full lg:lang-en:w-1/3 xl:lang-zh:w-2/5">
              <div className="mt-5"></div>
              <p className="body-1">{r('block-1-content-1')}</p>
              <div className="mt-4"></div>
              <p className="body-1">{r('block-1-content-2')}</p>
            </div>
            <div className="mt-8">
              <Button href="/get-started">{b('get-started')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <Marquee
        items={[
          {
            icon: '/marquee/icon-1.svg',
            alt: m('real-good-food'),
            width: 40,
            height: 35,
            title: m('real-good-food'),
          },
          {
            icon: '/marquee/icon-2.svg',
            alt: m('vet-approved'),
            width: 36,
            height: 35,
            title: m('vet-approved'),
          },
          {
            icon: '/marquee/icon-3.svg',
            alt: m('human-grade'),
            width: 34,
            height: 34,
            title: m('human-grade'),
          },
          {
            icon: '/marquee/icon-4.svg',
            alt: m('made-fresh'),
            width: 35,
            height: 34,
            title: m('made-fresh'),
          },
          {
            icon: '/marquee/icon-5.svg',
            alt: m('high-quality-ingredients'),
            width: 32,
            height: 35,
            title: m('high-quality-ingredients'),
          },
          {
            icon: '/marquee/icon-6.svg',
            alt: m('no-fillers'),
            width: 35,
            height: 35,
            title: m('no-fillers'),
          },
          {
            icon: '/marquee/icon-7.svg',
            alt: m('no-preservatives'),
            width: 35,
            height: 35,
            title: m('no-preservatives'),
          },
          {
            icon: '/marquee/icon-8.svg',
            alt: m('no-artificial-flavours'),
            width: 35,
            height: 35,
            title: m('no-artificial-flavours'),
          },
        ]}
      />
      <ImageContentBlock
        className={{
          ...className,
          block: 'bg-primary bg-opacity-10',
        }}
        image={`/recipes/${RecipeHelper.getSlug(Recipe.Chicken)}.jpg`}
        alt={sentence.recipe(Recipe.Chicken)}
        endAdornment={
          <EndAdornment
            className={{
              picture: 'from-[#95cfd0]',
            }}
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
          <h2 className="heading-3 font-bold text-primary lang-zh:font-normal">
            {sentence.recipe(Recipe.Chicken)}
          </h2>
          <div className="mt-4"></div>
          <p className="body-1">{r('chicken:description')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 font-bold text-[rgb(190,135,59)] lang-zh:font-normal">
            {t('{}-colon', { value: t('Recipes.ingredients') })}
          </p>
          <div className="mt-1"></div>
          <p className="body-1">
            {sentence.array([
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
        image={`/recipes/${RecipeHelper.getSlug(Recipe.Beef)}.jpg`}
        alt={sentence.recipe(Recipe.Beef)}
        reverse
        endAdornment={
          <EndAdornment
            className={{
              picture: 'from-[#f7c1b5]',
            }}
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
          <h2 className="heading-3 font-bold text-primary lang-zh:font-normal">
            {sentence.recipe(Recipe.Beef)}
          </h2>
          <div className="mt-4"></div>
          <p className="body-1">{r('beef:description')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 font-bold text-gold lang-zh:font-normal">
            {t('{}-colon', { value: t('Recipes.ingredients') })}
          </p>
          <div className="mt-1"></div>
          <p className="body-1">
            {sentence.array([
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
        image={`/recipes/${RecipeHelper.getSlug(Recipe.Pork)}.jpg`}
        alt={sentence.recipe(Recipe.Pork)}
        endAdornment={
          <EndAdornment
            className={{
              picture: 'from-[#97cfea]',
            }}
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
          <h2 className="heading-3 font-bold text-primary lang-zh:font-normal">
            {sentence.recipe(Recipe.Pork)}
          </h2>
          <div className="mt-4"></div>
          <p className="body-1">{r('pork:description')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 font-bold text-gold  lang-zh:font-normal">
            {t('{}-colon', { value: t('Recipes.ingredients') })}
          </p>
          <div className="mt-1"></div>
          <p className="body-1">
            {sentence.array([
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
        image={`/recipes/${RecipeHelper.getSlug(Recipe.Lamb)}.jpg`}
        alt={sentence.recipe(Recipe.Lamb)}
        reverse
        endAdornment={
          <EndAdornment
            className={{
              picture: 'from-[#cae8b8]',
            }}
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
          <h2 className="heading-3 font-bold text-primary  lang-zh:font-normal">
            {sentence.recipe(Recipe.Lamb)}
          </h2>
          <div className="mt-4"></div>
          <p className="body-1">{r('lamb:description')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 font-bold text-gold  lang-zh:font-normal">
            {t('{}-colon', { value: t('Recipes.ingredients') })}
          </p>
          <div className="mt-1"></div>
          <p className="body-1">
            {sentence.array([
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
        image={`/recipes/${RecipeHelper.getSlug(Recipe.Duck)}.jpg`}
        alt={sentence.recipe(Recipe.Duck)}
        endAdornment={
          <EndAdornment
            className={{
              picture: 'from-[#f9cc81]',
            }}
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
          <h2 className="heading-3 font-bold text-primary lang-zh:font-normal">
            {sentence.recipe(Recipe.Duck)}
          </h2>
          <div className="mt-4"></div>
          <p className="body-1">{r('duck:description')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 font-bold text-gold lang-zh:font-normal">
            {t('{}-colon', { value: t('Recipes.ingredients') })}
          </p>
          <div className="mt-1"></div>
          <p className="body-1">
            {sentence.array([
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
          <h2 className="heading-1 font-bold text-primary lang-zh:font-normal">
            {r.rich('block-8-title')}
          </h2>
          <div className="mt-6"></div>
          <p className="body-1">{r.rich('block-8-content')}</p>
          <Button className="mt-6" href="/get-started">
            {b('create-your-plan')}
          </Button>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
