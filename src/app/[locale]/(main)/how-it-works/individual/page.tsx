import Block from '@/components/layouts/Block';
import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import Image from 'next/image';
import Product from './Product';
import { IndividualRecipePack, Recipe } from '@/enums';
import { getCartOrCheckout, getProducts } from './actions';
import { getTranslations } from 'next-intl/server';
import CartSection from './CartSection';
import { CartContextProvider } from '@/contexts/cart';
import { freshRecipe } from '@/helpers/translation';
import { weightToGrams } from '@/helpers/saleor';
import { ProductFragment } from '@/gql/graphql';
import RecipeMediumDialog from '@/components/dialogs/RecipeMedium';
import pluralize from 'pluralize';

export default async function HowItWorksIndividual() {
  const t = await getTranslations();
  const products = await getProducts();
  const cart = await getCartOrCheckout(false);

  const getPrice = (product: ProductFragment) => {
    return product.variants![0].pricing!.price!.gross.amount;
  };

  const getWeight = (product: ProductFragment) => {
    return weightToGrams(product.variants![0].weight!);
  };

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
          picture="/recipes/individual/bundle.jpg"
          title={t('test-bundle')}
          description={
            <>
              A complete assortment of nutrient-packed, freshly made food for your dog to sample.
              <br />
              <br />5 Fresh Recipes: Chicken (100g), Beef (100g), Pork (100g), Lamb (100g), Duck
              (100g).
            </>
          }
          price={getPrice(products[IndividualRecipePack.Bundle])}
          grams={getWeight(products[IndividualRecipePack.Bundle])}
          className={{
            root: 'bg-[#A98D72]',
            title: 'text-white',
            content: 'text-white',
          }}
          pack={IndividualRecipePack.Bundle}
        />
        <Product
          picture="/recipes/individual/chicken.jpg"
          title={freshRecipe(t, Recipe.Chicken)}
          description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
          price={getPrice(products[IndividualRecipePack.Chicken])}
          grams={getWeight(products[IndividualRecipePack.Chicken])}
          theme="yellow"
          className={{
            root: 'bg-how-it-works-yellow bg-opacity-[8%]',
            title: 'text-how-it-works-yellow',
          }}
          reverse
          pack={IndividualRecipePack.Chicken}
          detailsButton={
            <RecipeMediumDialog
              name={freshRecipe(t, Recipe.Chicken)}
              description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
              picture="/meal-plan/chicken-recipe.jpg"
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
            >
              <Button theme="yellow" reverse>
                {t('see-details')}
              </Button>
            </RecipeMediumDialog>
          }
        />
        <Product
          picture="/recipes/individual/beef.jpg"
          title={freshRecipe(t, Recipe.Beef)}
          description="This hearty meal delivers high-quality beef for strength, a rainbow of veggies for antioxidant power, and superfoods to boost immunity. Hit the ground running with every bowl!"
          price={getPrice(products[IndividualRecipePack.Beef])}
          grams={getWeight(products[IndividualRecipePack.Beef])}
          theme="red"
          className={{
            root: 'bg-how-it-works-red bg-opacity-[8%]',
            title: 'text-how-it-works-red',
          }}
          pack={IndividualRecipePack.Beef}
          detailsButton={
            <RecipeMediumDialog
              name={freshRecipe(t, Recipe.Beef)}
              description="This hearty meal delivers high-quality beef for strength, a rainbow of veggies for antioxidant power, and superfoods to boost immunity. Hit the ground running with every bowl!"
              picture="/meal-plan/chicken-recipe.jpg"
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
            >
              <Button theme="red" reverse>
                {t('see-details')}
              </Button>
            </RecipeMediumDialog>
          }
        />
        <Product
          picture="/recipes/individual/pork.jpg"
          title={freshRecipe(t, Recipe.Pork)}
          description="Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for dogs with sensitive stomachs or allergies!"
          price={getPrice(products[IndividualRecipePack.Pork])}
          grams={getWeight(products[IndividualRecipePack.Pork])}
          theme="primary"
          className={{
            root: 'bg-primary bg-opacity-[8%]',
            title: 'text-primary',
          }}
          reverse
          pack={IndividualRecipePack.Pork}
          detailsButton={
            <RecipeMediumDialog
              name={freshRecipe(t, Recipe.Pork)}
              description="Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for dogs with sensitive stomachs or allergies!"
              picture="/meal-plan/chicken-recipe.jpg"
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
            >
              <Button theme="primary" reverse>
                {t('see-details')}
              </Button>
            </RecipeMediumDialog>
          }
        />
        <Product
          picture="/recipes/individual/lamb.jpg"
          title={freshRecipe(t, Recipe.Lamb)}
          description="A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters. Crafted for muscle strength, immune support, radiant health, and a shiny coat!"
          price={getPrice(products[IndividualRecipePack.Lamb])}
          grams={getWeight(products[IndividualRecipePack.Lamb])}
          theme="green"
          className={{
            root: 'bg-how-it-works-green bg-opacity-[8%]',
            title: 'text-how-it-works-green',
          }}
          pack={IndividualRecipePack.Lamb}
          detailsButton={
            <RecipeMediumDialog
              name={freshRecipe(t, Recipe.Lamb)}
              description="A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters. Crafted for muscle strength, immune support, radiant health, and a shiny coat!"
              picture="/meal-plan/chicken-recipe.jpg"
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
            >
              <Button theme="green" reverse>
                {t('see-details')}
              </Button>
            </RecipeMediumDialog>
          }
        />
        <Product
          picture="/recipes/individual/duck.jpg"
          title={freshRecipe(t, Recipe.Duck)}
          description="A wholesome feast, tailored for digestive health, luxurious coats, and improved vitality! Perfect for dogs seeking a unique and hypoallergenic dining experience without compromising on taste and health."
          price={getPrice(products[IndividualRecipePack.Duck])}
          grams={getWeight(products[IndividualRecipePack.Duck])}
          className={{
            root: 'bg-secondary bg-opacity-[8%]',
            title: 'text-secondary',
          }}
          reverse
          pack={IndividualRecipePack.Duck}
          detailsButton={
            <RecipeMediumDialog
              name={freshRecipe(t, Recipe.Duck)}
              description="A wholesome feast, tailored for digestive health, luxurious coats, and improved vitality! Perfect for dogs seeking a unique and hypoallergenic dining experience without compromising on taste and health."
              picture="/meal-plan/chicken-recipe.jpg"
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
            >
              <Button theme="secondary" reverse>
                {t('see-details')}
              </Button>
            </RecipeMediumDialog>
          }
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
