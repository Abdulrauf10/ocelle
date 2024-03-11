import Button from '@/components/Button';
import Section from './Section';
import Newsletter from '@/components/Newsletter';
import Container from '@/components/Container';
import RecipeBenefits from './Benefits';
import { useTranslations } from 'next-intl';
import Block from '@/components/Block';
import Marquee from '@/components/Marquee';
import pluralize from 'pluralize';

export default function RecipesPage() {
  const t = useTranslations();

  return (
    <main>
      <div className="bg-[url('./recipes-bg-mb.jpg')] bg-[length:100%_auto] bg-bottom bg-repeat-x py-10 max-lg:pb-[70%] lg:bg-[url('./recipes-bg.jpg')] lg:bg-[length:auto_100%] lg:bg-center">
        <div className="px-[2vw] py-[4vw] text-xl text-white max-lg:w-full lg:pr-0">
          <h1 className="text-[48px] font-bold leading-[1.2em] lg:text-[5vw]">
            Real Food.
            <br />
            That’s Our Secret.{' '}
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
      <Section
        className="bg-primary bg-opacity-10"
        secionImage="/recipes/chicken.jpg"
        dialogImage="/recipes/dispersion/chicken.jpg"
        alt="Chicken Recipe"
        title="Fresh Chicken Recipe"
        description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of
        lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a
        shiny coat."
        ingredientDescription={
          [
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
          ].join(t('comma')) + t('dot')
        }
        ingredients={[
          {
            picture: '/recipes/ingredients/chicken-breast.png',
            spacing: 15,
            title: t('chicken-breast'),
            description:
              'A lean source of high-quality protein, essential for muscle growth and repair. It also supplies glucosamine and chondroitin, the building blocks of joint cartilage, tendons, and ligaments.',
          },
          {
            picture: '/recipes/ingredients/chicken-liver.png',
            spacing: -10,
            title: t('chicken-liver'),
            description:
              'A nutrient powerhouse, packed with iron for healthy blood, vitamin A for sharp vision, B vitamins for energy metabolism, and choline for healthy brain function.',
          },
          {
            picture: '/recipes/ingredients/whole-grain-rice.png',
            spacing: -20,
            title: t('whole-grain-rice'),
            description:
              "A wholesome source of complex carbohydrates, whole-grain rice provides dogs with sustained energy. It's also gentle on the digestive system, making it a good choice for dogs with sensitive stomachs.",
          },
          {
            picture: '/recipes/ingredients/mushroom.png',
            spacing: -20,
            title: pluralize.plural(t('shiitake-mushroom')),
            description:
              'Shiitake mushrooms are known for their immune-boosting properties and are also a good source of B vitamins.',
          },
          {
            picture: '/recipes/ingredients/spinach.png',
            spacing: -15,
            title: t('spinach'),
            description:
              'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/peas.png',
            spacing: -10,
            title: t('peas'),
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/cranberry.png',
            spacing: -30,
            title: pluralize.plural(t('cranberry')),
            description:
              'Rich in antioxidants, cranberries can help support urinary tract health and may prevent urinary infections. They are also beneficial for dental health.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            spacing: -20,
            title: t('flaxseed'),
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            spacing: 16,
            title: t('salmon-oil'),
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
          },
          {
            picture: '/recipes/ingredients/targeted-nutrient-blend.png',
            spacing: 70,
            title: t('ocelle-targeted-nutrient-blend'),
            description:
              'Each recipe contains a specific formulation of vitamins and minerals, designed to synergize with our carefully chosen ingredients, ensuring that meals are packed with the life-stage-specific nutrients needed to thrive.',
          },
        ]}
        calorie={1540}
        protein={19}
        fat={5}
        fibre={2}
        moisture={60}
      />
      <Section
        secionImage="/recipes/beef.jpg"
        dialogImage="/recipes/dispersion/beef.jpg"
        alt="Beef Recipe"
        reverse
        title="Fresh Beef Recipe"
        description="This hearty meal delivers high-quality beef for strength, a rainbow of veggies for
          antioxidant power, and superfoods to boost immunity. Hit the ground running with every
          bowl!"
        ingredientDescription={
          [
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
          ].join(t('comma')) + t('dot')
        }
        ingredients={[
          {
            picture: '/recipes/ingredients/beef-chuck.png',
            spacing: 15,
            title: t('beef-chuck'),
            description:
              "Lean beef chuck is an excellent source of high-quality protein, crucial for muscle maintenance and overall body functions. It's also rich in minerals and essential nutrients, like iron and zinc, which are important for healthier immune systems, stronger bones, and wound healing.",
          },
          {
            picture: '/recipes/ingredients/beef-liver.png',
            title: t('beef-liver'),
            description:
              'Beef liver is extremely nutrient-dense, offering a rich source of vitamin A for eye health, iron for healthy blood cells, and B vitamins for energy production.',
          },
          {
            picture: '/recipes/ingredients/carrot.png',
            spacing: 20,
            title: pluralize.plural(t('carrot')),
            description:
              "Carrots are high in beta-carotene, which converts to vitamin A and supports vision health. They're also a good source of fibre, aiding in digestive health, and have antioxidants for immune support.",
          },
          {
            picture: '/recipes/ingredients/kale.png',
            spacing: 15,
            title: t('kale'),
            description:
              'This leafy green is packed with vitamins A, C, and K, along with antioxidants and iron. It supports immune health, vision, and overall wellness.',
          },
          {
            picture: '/recipes/ingredients/peas.png',
            spacing: -10,
            title: t('peas'),
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/potato.png',
            spacing: -20,
            title: pluralize.plural(t('potato')),
            description:
              'Potatoes are a good source of carbohydrates, potassium, and vitamins C and B6. They provide energy and are easily digestible, making them suitable for sensitive stomachs.',
          },
          {
            picture: '/recipes/ingredients/blueberry.png',
            spacing: 30,
            title: pluralize.plural(t('blueberry')),
            description:
              'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            spacing: -20,
            title: t('flaxseed'),
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            spacing: 16,
            title: t('salmon-oil'),
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
          },
          {
            picture: '/recipes/ingredients/targeted-nutrient-blend.png',
            spacing: 70,
            title: t('ocelle-targeted-nutrient-blend'),
            description:
              'Each recipe contains a specific formulation of vitamins and minerals, designed to synergize with our carefully chosen ingredients, ensuring that meals are packed with the life-stage-specific nutrients needed to thrive.',
          },
        ]}
        calorie={1540}
        protein={19}
        fat={5}
        fibre={2}
        moisture={60}
      />
      <Section
        className="bg-gold bg-opacity-10"
        secionImage="/recipes/pork.jpg"
        dialogImage="/recipes/dispersion/pork.jpg"
        alt="Pork Recipe"
        title="Fresh Pork Recipe"
        description="Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with
        leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for dogs
        with sensitive stomachs or allergies!"
        ingredientDescription={
          [
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
          ].join(t('comma')) + t('dot')
        }
        ingredients={[
          {
            picture: '/recipes/ingredients/pork-loin.png',
            spacing: 20,
            title: t('pork-loin'),
            description:
              "Pork is lean and a novel protein for most dogs, providing high-quality nutrients for muscle development and overall body function. It's also a good source of B vitamins, particularly B1 (thiamine), which is crucial for carbohydrate metabolism.",
          },
          {
            picture: '/recipes/ingredients/pork-liver.png',
            spacing: 10,
            title: t('pork-liver'),
            description:
              'Pork liver is nutrient rich, offering high levels of iron and vitamins A and B. These nutrients are key for maintaining healthy vision, blood health, and energy levels.',
          },
          {
            picture: '/recipes/ingredients/celery.png',
            spacing: 20,
            title: t('celery'),
            description:
              'Water spinach is a beneficial leafy green, offering vitamins A and C, iron, and antioxidants. It supports immune health, digestive wellness, and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/potato.png',
            spacing: -20,
            title: pluralize.plural(t('potato')),
            description:
              'Potatoes are a good source of carbohydrates, potassium, and vitamins C and B6. They provide energy and are easily digestible, making them suitable for sensitive stomachs.',
          },
          {
            picture: '/recipes/ingredients/peas.png',
            spacing: -10,
            title: t('peas'),
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/spinach.png',
            spacing: -15,
            title: t('spinach'),
            description:
              'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/blueberry.png',
            spacing: 30,
            title: pluralize.plural(t('blueberry')),
            description:
              'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            spacing: -20,
            title: t('flaxseed'),
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            spacing: 16,
            title: t('salmon-oil'),
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
          },
          {
            picture: '/recipes/ingredients/targeted-nutrient-blend.png',
            spacing: 70,
            title: t('ocelle-targeted-nutrient-blend'),
            description:
              'Each recipe contains a specific formulation of vitamins and minerals, designed to synergize with our carefully chosen ingredients, ensuring that meals are packed with the life-stage-specific nutrients needed to thrive.',
          },
        ]}
        calorie={1540}
        protein={19}
        fat={5}
        fibre={2}
        moisture={60}
      />
      <Section
        secionImage="/recipes/lamb.jpg"
        dialogImage="/recipes/dispersion/lamb.jpg"
        alt="Lamb Recipe"
        reverse
        title="Fresh Lamb Recipe"
        description="A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters.
          Crafted for muscle strength, immune support, radiant health, and a shiny coat!"
        ingredientDescription={
          [
            t('lamb-leg-boneless'),
            t('beef-liver'),
            t('whole-grain-rice'),
            t('peas'),
            t('spinach'),
            pluralize.plural(t('blueberry')),
            t('flaxseed'),
            t('salmon-oil'),
            t('ocelle-targeted-nutrient-blend'),
          ].join(t('comma')) + t('dot')
        }
        ingredients={[
          {
            picture: '/recipes/ingredients/lamb-leg.png',
            spacing: 16,
            title: t('lamb-leg'),
            description:
              "Lamb is a highly palatable meat and an excellent source of quality protein and essential fats, which help with energy levels, proper growth, and overall health. It's also a good source of iron and zinc, which are crucial for immune function and skin health.",
          },
          {
            picture: '/recipes/ingredients/beef-liver.png',
            spacing: 10,
            title: t('beef-liver'),
            description:
              'Beef liver is extremely nutrient-dense, offering a rich source of vitamin A for eye health, iron for healthy blood cells, and B vitamins for energy production.',
          },
          {
            picture: '/recipes/ingredients/whole-grain-rice.png',
            spacing: -20,
            title: t('whole-grain-rice'),
            description:
              "A wholesome source of complex carbohydrates, whole-grain rice provides dogs with sustained energy. It's also gentle on the digestive system, making it a good choice for dogs with sensitive stomachs.",
          },
          {
            picture: '/recipes/ingredients/peas.png',
            spacing: -10,
            title: t('peas'),
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/spinach.png',
            spacing: -15,
            title: t('spinach'),
            description:
              'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/blueberry.png',
            spacing: 30,
            title: pluralize.plural(t('blueberry')),
            description:
              'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            spacing: -20,
            title: t('flaxseed'),
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            spacing: 16,
            title: t('salmon-oil'),
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
          },
          {
            picture: '/recipes/ingredients/targeted-nutrient-blend.png',
            spacing: 70,
            title: t('ocelle-targeted-nutrient-blend'),
            description:
              'Each recipe contains a specific formulation of vitamins and minerals, designed to synergize with our carefully chosen ingredients, ensuring that meals are packed with the life-stage-specific nutrients needed to thrive.',
          },
        ]}
        calorie={1540}
        protein={19}
        fat={5}
        fibre={2}
        moisture={60}
      />
      <Section
        className="bg-primary bg-opacity-10"
        secionImage="/recipes/duck.jpg"
        dialogImage="/recipes/dispersion/duck.jpg"
        alt="Duck Recipe"
        title="Fresh Duck Recipe"
        description="A wholesome feast, tailored for digestive health, luxurious coats, and improved vitality!
          Perfect for dogs seeking a unique and hypoallergenic dining experience without
          compromising on taste and health."
        ingredientDescription={
          [
            t('duck-breast'),
            t('chicken-liver'),
            t('whole-grain-pasta'),
            t('winter-melon'),
            t('peas'),
            pluralize.plural(t('goji-berry')),
            t('flaxseed'),
            t('salmon-oil'),
            t('ocelle-targeted-nutrient-blend'),
          ].join(t('comma')) + t('dot')
        }
        ingredients={[
          {
            picture: '/recipes/ingredients/duck-breast.png',
            title: t('duck-breast'),
            description:
              'Duck is lean and packed with essential amino acids, vitamins, and antioxidants to promote good health. It’s also a novel protein for many dogs, making it suitable for those with sensitivities or allergies.',
          },
          {
            picture: '/recipes/ingredients/chicken-liver.png',
            title: t('chicken-liver'),
            description:
              'A nutrient powerhouse, packed with iron for healthy blood, vitamin A for sharp vision, B vitamins for energy metabolism, and choline for healthy brain function.',
          },
          {
            picture: '/recipes/ingredients/winter-melon.png',
            spacing: 14,
            title: t('winter-melon'),
            description:
              "Winter melon is very low in calories and high in fibre, aiding in digestion. It's also hydrating and can be beneficial for dogs with kidney issues or those needing a low-fat diet.",
          },
          {
            picture: '/recipes/ingredients/peas.png',
            spacing: -10,
            title: t('peas'),
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/goji-berry.png',
            spacing: -15,
            title: pluralize.plural(t('goji-berry')),
            description:
              'Goji berries are known for their high antioxidant content, supporting immune health, vision, and overall cellular function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            spacing: -20,
            title: t('flaxseed'),
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/whole-grain-pasta.png',
            spacing: 20,
            title: t('whole-grain-pasta'),
            description:
              'A source of complex carbohydrates, whole grain pasta provides sustained energy. It is also a good source of fibre, which aids in digestion, and B vitamins for energy metabolism.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            spacing: 16,
            title: t('salmon-oil'),
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
          },
          {
            picture: '/recipes/ingredients/targeted-nutrient-blend.png',
            spacing: 70,
            title: t('ocelle-targeted-nutrient-blend'),
            description:
              'Each recipe contains a specific formulation of vitamins and minerals, designed to synergize with our carefully chosen ingredients, ensuring that meals are packed with the life-stage-specific nutrients needed to thrive.',
          },
        ]}
        calorie={1540}
        protein={19}
        fat={5}
        fibre={2}
        moisture={60}
      />
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
