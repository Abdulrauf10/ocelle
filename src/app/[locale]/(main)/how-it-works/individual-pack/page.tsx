import Block from '@/components/layouts/Block';
import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import Image from 'next/image';
import Product from './Product';
import { IndividualRecipePack } from '@/enums';
import { getCartOrCheckout, getProducts } from './actions';
import { getTranslations } from 'next-intl/server';
import CartSection from './CartSection';
import { CartContextProvider } from '@/contexts/cart';
import pluralize from 'pluralize';

export default async function HowItWorksIndividual() {
  const t = await getTranslations();
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
        <Block className="bg-primary bg-opacity-10 text-center">
          <Container>
            <h1 className="heading-1 font-bold text-primary">Feeding Fresh Is Easy With OCELLE</h1>
            <p className="body-2 mt-4 text-secondary">
              If you’re not ready for a subscription, our individual packs come in set weights and
              can be ordered anytime.
            </p>
          </Container>
        </Block>
        <Product
          product={products[IndividualRecipePack.Bundle]}
          picture="/recipes/individual/bundle.jpg"
          pack={IndividualRecipePack.Bundle}
          className={{
            root: 'bg-[#A98D72]',
            title: 'text-white',
            content: 'text-white',
          }}
          ingredients={[]}
          targetedNutrientBlendIngredients={[]}
          calorie={0}
          analysis={{ protein: 0, fat: 0, fibre: 0, moisture: 0 }}
        />
        <Product
          product={products[IndividualRecipePack.Chicken]}
          picture="/recipes/individual/chicken.jpg"
          theme="yellow"
          className={{
            root: 'bg-how-it-works-yellow bg-opacity-[8%]',
            title: 'text-how-it-works-yellow',
          }}
          reverse
          pack={IndividualRecipePack.Chicken}
          ingredients={[
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
            t('lamb-leg-boneless'),
            t('beef-liver'),
            t('whole-grain-rice'),
            t('peas'),
            t('spinach'),
            pluralize.plural(t('blueberry')),
            t('flaxseed'),
            t('salmon-oil'),
            t('ocelle-targeted-nutrient-blend'),
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
            t('duck-breast'),
            t('chicken-liver'),
            t('whole-grain-pasta'),
            t('winter-melon'),
            t('peas'),
            pluralize.plural(t('goji-berry')),
            t('flaxseed'),
            t('salmon-oil'),
            t('ocelle-targeted-nutrient-blend'),
          ]}
          targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
          calorie={1540}
          analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
        />
        <Block className="bg-gray bg-opacity-20">
          <Container className="max-w-screen-xl text-center">
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
                  <h3 className="heading-4 mt-6 font-bold text-gray">
                    Developed By Vet Nutritionists
                  </h3>
                  <p className="body-1 mt-3">
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
                  <h3 className="heading-4 mt-6 font-bold text-gray">
                    Crafted With Premium Ingredients
                  </h3>
                  <p className="body-1 mt-3">
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
                  <h3 className="heading-4 mt-6 font-bold text-gray">
                    Freshly Made To Lock In Nutrients
                  </h3>
                  <p className="body-1 mt-3">
                    Our ingredients are gently cooked to maximize digestibility and preserve vital
                    nutrients, texture, and taste.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Button>{t('learn-more')}</Button>
            </div>
          </Container>
        </Block>
        <Block styles="tight" className="bg-dark-green">
          <Container className="text-center text-white">
            <h2 className="heading-1 font-bold">Easier For You. Better For Them.</h2>
            <p className="body-1 mt-2">
              Get fresh food conveniently delivered with our customised meal plans.
            </p>
            <div className="mt-8">
              <Button>Try It Today</Button>
            </div>
          </Container>
        </Block>
      </main>
      <CartSection />
    </CartContextProvider>
  );
}
