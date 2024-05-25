import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import pluralize from 'pluralize';

import CartSection from './CartSection';
import Product from './Product';
import { getCartOrCheckout, getProducts } from './actions';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import Block from '@/components/layouts/Block';
import { CartContextProvider } from '@/contexts/cart';
import { IndividualRecipePack } from '@/enums';

export default async function HowItWorksIndividual() {
  const t = await getTranslations();
  const i = await getTranslations('Ingredients');
  const products = await getProducts();
  const cart = await getCartOrCheckout(false);

  const targetedNutrientBlendIngredients = [
    t('selenium-yeast'),
    t('vitamin-a-supplement'),
    t('thiamine-hydrochloride-vitamin-b1'),
    t('riboflavin-vitamin-b2'),
    t('niacin-vitamin-b3'),
    t('pyridoxine-hydrochloride-vitamin-b6'),
    t('folic-acid-vitamin-b9'),
    t('cholecalciferol-vitamin-b12'),
    t('vitamin-d3-supplement'),
    t('sodium-chloride'),
    t('tricalcium-phosphate'),
    t('iron-amino-acid-chelate'),
    t('potassium-chloride'),
    t('potassium-iodide'),
    t('zinc-amino-acid-chelate'),
    t('magnesium-amino-acid-chelate'),
    t('manganese-amino-acid-chelate'),
    t('copper-amino-acid-chelate'),
    t('taurine'),
    t('choline-bitartrate'),
  ];

  return (
    <CartContextProvider lines={cart ? cart.lines : []} totalPrice={cart?.totalPrice.gross}>
      <main>
        <div className="relative flex items-center bg-[url('./individual-pack-bg.jpg')] bg-[length:auto_100%] bg-[calc(50%_+_40px)_center] bg-no-repeat max-lg:bg-[url('./individual-pack-bg-mb.jpg')] max-lg:bg-[length:100%_auto] max-lg:bg-bottom">
          <div className="w-full pt-[clamp(450px,31.5%,700px)] max-lg:hidden"></div>
          <div className="w-full py-[4vw] text-white max-lg:w-full max-lg:py-10 max-lg:pb-[95%] lg:absolute lg:pr-0">
            <Container className="max-lg:text-center">
              <h1 className="heading-headline heading-weight-1">
                Feeding Fresh Is <br />
                Easy With OCELLE
              </h1>
              <div className="mt-4"></div>
              <div className="max-w-[45%] max-lg:max-w-none">
                <p className="body-1">
                  If you’re not ready for a subscription, our individual packs come in set weights
                  and can be ordered anytime.
                </p>
              </div>
            </Container>
          </div>
        </div>
        <Product
          product={products[IndividualRecipePack.Bundle]}
          picture="/recipes/individual/bundle.jpg"
          pack={IndividualRecipePack.Bundle}
          className={{
            root: 'bg-[#E1D7CE]',
            title: 'text-[#907861]',
            content: 'text-[#907861]',
          }}
          ingredients={[]}
          targetedNutrientBlendIngredients={[]}
          calorie={0}
          analysis={{ protein: 0, fat: 0, fibre: 0, moisture: 0 }}
        />
        <Product
          product={products[IndividualRecipePack.Chicken]}
          picture="/recipes/individual/chicken.jpg"
          theme="dark-green"
          className={{
            root: 'bg-how-it-works-dark-green bg-opacity-[8%]',
            title: 'text-how-it-works-dark-green',
          }}
          reverse
          pack={IndividualRecipePack.Chicken}
          ingredients={[
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
          ]}
          targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
          calorie={1540}
          analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
        />
        <Product
          product={products[IndividualRecipePack.Beef]}
          picture="/recipes/individual/beef.jpg"
          theme="red"
          className={{
            root: 'bg-how-it-works-red bg-opacity-[8%]',
            title: 'text-how-it-works-red',
          }}
          pack={IndividualRecipePack.Beef}
          ingredients={[
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
          ]}
          targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
          calorie={1540}
          analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
        />
        <Product
          product={products[IndividualRecipePack.Pork]}
          picture="/recipes/individual/pork.jpg"
          theme="primary"
          className={{
            root: 'bg-primary bg-opacity-[8%]',
            title: 'text-primary',
          }}
          reverse
          pack={IndividualRecipePack.Pork}
          ingredients={[
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
          ]}
          targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
          calorie={1540}
          analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
        />
        <Product
          product={products[IndividualRecipePack.Lamb]}
          picture="/recipes/individual/lamb.jpg"
          theme="green"
          className={{
            root: 'bg-how-it-works-green bg-opacity-[8%]',
            title: 'text-how-it-works-green',
          }}
          pack={IndividualRecipePack.Lamb}
          ingredients={[
            i('lamb-leg-boneless'),
            i('beef-liver'),
            i('whole-grain-rice'),
            i('peas'),
            i('spinach'),
            pluralize.plural(i('blueberry')),
            i('flaxseed'),
            i('salmon-oil'),
            i('ocelle-targeted-nutrient-blend'),
          ]}
          targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
          calorie={1540}
          analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
        />
        <Product
          product={products[IndividualRecipePack.Duck]}
          picture="/recipes/individual/duck.jpg"
          className={{
            root: 'bg-secondary bg-opacity-[8%]',
            title: 'text-secondary',
          }}
          reverse
          pack={IndividualRecipePack.Duck}
          ingredients={[
            i('duck-breast'),
            i('chicken-liver'),
            i('whole-grain-pasta'),
            i('winter-melon'),
            i('peas'),
            pluralize.plural(i('goji-berry')),
            i('flaxseed'),
            i('salmon-oil'),
            i('ocelle-targeted-nutrient-blend'),
          ]}
          targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
          calorie={1540}
          analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
        />
        <Block className="bg-gray bg-opacity-20">
          <Container className="max-w-screen-lg text-center">
            <h2 className="heading-1 font-bold text-gray">Your Dog Deserves A Fresh Start</h2>
            <div className="mt-10">
              <div className="-mx-4 -my-4 flex flex-wrap">
                <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                  <div className="relative pt-[89.4%]">
                    <Image
                      src="/fresh-start-1.jpg"
                      alt="dog 1"
                      fill
                      className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                    />
                  </div>
                  <div className="mt-6"></div>
                  <h3 className="heading-4 font-bold text-gray">Developed By Vet Nutritionists</h3>
                  <div className="mt-3"></div>
                  <p className="body-1">
                    Many of the health issues dogs face are related to diet. That’s why our team is
                    devoted to determining exactly what dogs need to live happier, healthier lives.
                  </p>
                </div>
                <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                  <div className="relative pt-[89.4%]">
                    <Image
                      src="/fresh-start-2.jpg"
                      alt="dog 2"
                      fill
                      className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                    />
                  </div>
                  <div className="mt-6"></div>
                  <h3 className="heading-4 font-bold text-gray">
                    Crafted With Premium Ingredients
                  </h3>
                  <div className="mt-3"></div>
                  <p className="body-1">
                    No heat-blasted ingredients. No preservatives. No fillers. No nonsense. Just
                    real ingredients you can see, nutrition dogs need, and the flavours they crave.
                  </p>
                </div>
                <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                  <div className="relative pt-[89.4%]">
                    <Image
                      src="/fresh-start-3.jpg"
                      alt="dog 3"
                      fill
                      className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                    />
                  </div>
                  <div className="mt-6"></div>
                  <h3 className="heading-4 font-bold text-gray">
                    Freshly Made To Lock In Nutrients
                  </h3>
                  <div className="mt-3"></div>
                  <p className="body-1">
                    Our ingredients are gently cooked to maximize digestibility and preserve vital
                    nutrients, texture, and taste.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Button href="/why-fresh/benefits-of-fresh-dog-food">{t('learn-more')}</Button>
            </div>
          </Container>
        </Block>
        <Block styles="tight" className="bg-dark-green">
          <Container className="text-center text-white">
            <h2 className="heading-1 font-bold">Easier For You. Better For Them.</h2>
            <div className="mt-2"></div>
            <p className="body-1">
              Get fresh food conveniently delivered with our customised meal plans.
            </p>
            <div className="mt-8"></div>
            <Button href="/get-started">Try It Today</Button>
          </Container>
        </Block>
        <Newsletter />
      </main>
      <CartSection />
    </CartContextProvider>
  );
}
