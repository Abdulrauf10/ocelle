import Button from '@/components/Button';
import MarqueeContent from '../MarqueeContent';
import Section from './Section';
import Newsletter from '@/components/Newsletter';
import Container from '@/components/Container';
import RecipeBenefits from './Benefits';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';
import Block from '@/components/Block';
import Marquee from 'react-fast-marquee';

export default function RecipesPage() {
  const t = useTranslations();

  return (
    <main>
      <div className="bg-[url('./recipes-bg.jpg')] bg-[length:auto_100%] bg-center bg-repeat-x py-10">
        <div className="py-[4vw] pl-[2vw] text-xl text-white max-lg:w-full">
          <h1 className="text-[5vw] font-bold leading-[6.2vw]">
            Real Food.
            <br />
            That’s Our Secret.{' '}
          </h1>
          <div className="w-1/3 max-lg:w-1/4">
            <p className="mt-5">
              Crafted to human-grade standards, our recipes are skilfully balanced for total
              nutrition. We use quality proteins and vegetables, combined with targeted vitamins and
              minerals to nourish your dog at every stage of life.
            </p>
            <p className="mt-3">
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
        style={{ backgroundColor: 'rgb(82 137 177)', paddingTop: '8px', paddingBottom: '8px' }}
      >
        <MarqueeContent icon="icon-1.svg" alt="Food" width={53} height={46}>
          {t('real-good-food')}
        </MarqueeContent>
        <MarqueeContent icon="icon-2.svg" alt="Approved" width={43} height={46}>
          {t('vet-approved')}
        </MarqueeContent>
        <MarqueeContent icon="icon-3.svg" alt="Human-Grade" width={38} height={46}>
          {t('human-grade')}
        </MarqueeContent>
        <MarqueeContent icon="icon-4.svg" alt="Fresh" width={38} height={48}>
          {t('made-fresh')}
        </MarqueeContent>
        <MarqueeContent icon="icon-5.svg" alt="High-Quality" width={36} height={48}>
          {t('high-quality-ingredients')}
        </MarqueeContent>
        <MarqueeContent icon="icon-6.svg" alt="No Fillers" width={40} height={46}>
          {t('no-fillers')}
        </MarqueeContent>
        <MarqueeContent icon="icon-7.svg" alt="No Preservatives" width={40} height={46}>
          {t('no-preservatives')}
        </MarqueeContent>
        <MarqueeContent icon="icon-8.svg" alt="No Artificial Flavours" width={40} height={46}>
          {t('no-artificial-flavours')}
        </MarqueeContent>
      </Marquee>
      <Section
        className="bg-primary bg-opacity-10"
        secionImage="/recipes/chicken.jpg"
        dialogImage="/recipes/dispersion/chicken.jpg"
        alt="Chicken Recipe"
        title="Fresh Chicken Recipe"
        description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of
        lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a
        shiny coat."
        ingredientDescription="Chicken Breast, Chicken Liver, Whole-Grain Rice, Shiitake Mushroom, Spinach, Peas,
        Cranberry, Flaxseed, Salmon Oil, OCELLE Targeted Nutrient Blend."
        ingredients={[
          {
            picture: '/recipes/ingredients/chicken-breast.png',
            title: 'Chicken Breast',
            description:
              'A lean source of high-quality protein, essential for muscle growth and repair. It also supplies glucosamine and chondroitin, the building blocks of joint cartilage, tendons, and ligaments.',
          },
          {
            picture: '/recipes/ingredients/chicken-liver.png',
            title: 'Chicken Liver',
            description:
              'A nutrient powerhouse, packed with iron for healthy blood, vitamin A for sharp vision, B vitamins for energy metabolism, and choline for healthy brain function.',
          },
          {
            picture: '/recipes/ingredients/whole-grain-rice.png',
            title: 'Whole-Grain Rice',
            description:
              "A wholesome source of complex carbohydrates, whole-grain rice provides dogs with sustained energy. It's also gentle on the digestive system, making it a good choice for dogs with sensitive stomachs.",
          },
          {
            picture: '/recipes/ingredients/mushroom.png',
            title: 'Shiitake Mushroom',
            description:
              'These mushrooms are known for their immune-boosting properties and are also a good source of B vitamins.',
          },
          {
            picture: '/recipes/ingredients/spinach.png',
            title: 'Spinach',
            description:
              'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/peas.png',
            title: 'Peas',
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/cranberry.png',
            title: 'Cranberry',
            description:
              'Rich in antioxidants, cranberries can help support urinary tract health and may prevent urinary infections. They are also beneficial for dental health.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            title: 'Flaxseed',
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            title: 'Salmon Oil',
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
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
        ingredientDescription="Beef Chuck, Beef Liver, Potato, Carrot, Kale, Peas, Flaxseed, Salmon Oil, Blueberry,
          OCELLE Targeted Nutrient Blend."
        ingredients={[
          {
            picture: '/recipes/ingredients/beef-chuck.png',
            title: 'Beef Chuck',
            description:
              "Lean beef chuck is an excellent source of high-quality protein, crucial for muscle maintenance and overall body functions. It's also rich in minerals and essential nutrients, like iron and zinc, which are important for healthier immune systems, stronger bones, and wound healing.",
          },
          {
            picture: '/recipes/ingredients/beef-liver.png',
            title: 'Beef Liver',
            description:
              'Beef liver is extremely nutrient-dense, offering a rich source of vitamin A for eye health, iron for healthy blood cells, and B vitamins for energy production.',
          },
          {
            picture: '/recipes/ingredients/carrot.png',
            title: 'Carrot',
            description:
              "Carrots are high in beta-carotene, which converts to vitamin A and supports vision health. They're also a good source of fibre, aiding in digestive health, and have antioxidants for immune support.",
          },
          {
            picture: '/recipes/ingredients/kale.png',
            title: 'Kale',
            description:
              'This leafy green is packed with vitamins A, C, and K, along with antioxidants and iron. It supports immune health, vision, and overall wellness.',
          },
          {
            picture: '/recipes/ingredients/peas.png',
            title: 'Peas',
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/potato.png',
            title: 'Potato',
            description:
              'Potatoes are a good source of carbohydrates, potassium, and vitamins C and B6. They provide energy and are easily digestible, making them suitable for sensitive stomachs.',
          },
          {
            picture: '/recipes/ingredients/blueberry.png',
            title: 'Blueberry',
            description:
              'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            title: 'Flaxseed',
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            title: 'Salmon Oil',
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
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
        ingredientDescription="Pork Loin, Pork Liver, Water Spinach, Potato, Spinach, Peas, Flaxseed, Salmon Oil,
        Blueberry, OCELLE Targeted Nutrient Blend."
        ingredients={[
          {
            picture: '/recipes/ingredients/pork-loin.png',
            title: 'Pork Loin',
            description:
              "Pork is lean and a novel protein for most dogs, providing high-quality nutrients for muscle development and overall body function. It's also a good source of B vitamins, particularly B1 (thiamine), which is crucial for carbohydrate metabolism.",
          },
          {
            picture: '/recipes/ingredients/pork-liver.png',
            title: 'Pork Liver',
            description:
              'Pork liver is nutrient rich, offering high levels of iron and vitamins A and B. These nutrients are key for maintaining healthy vision, blood health, and energy levels.',
          },
          {
            picture: '/recipes/ingredients/water-spinach.png',
            title: 'Water Spinach',
            description:
              'Water spinach is a beneficial leafy green, offering vitamins A and C, iron, and antioxidants. It supports immune health, digestive wellness, and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/potato.png',
            title: 'Potato',
            description:
              'Potatoes are a good source of carbohydrates, potassium, and vitamins C and B6. They provide energy and are easily digestible, making them suitable for sensitive stomachs.',
          },
          {
            picture: '/recipes/ingredients/peas.png',
            title: 'Peas',
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/spinach.png',
            title: 'Spinach',
            description:
              'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/blueberry.png',
            title: 'Blueberry',
            description:
              'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            title: 'Flaxseed',
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            title: 'Salmon Oil',
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
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
        ingredientDescription="Lamb Leg (Boneless), Beef Liver, Whole-Grain Rice, Peas, Spinach, Flaxseed, Salmon Oil,
          Blueberry, OCELLE Targeted Nutrient Blend."
        ingredients={[
          {
            picture: '/recipes/ingredients/lamb-leg.png',
            title: 'Lamb Leg',
            description:
              "Lamb is a highly palatable meat and an excellent source of quality protein and essential fats, which help with energy levels, proper growth, and overall health. It's also a good source of iron and zinc, which are crucial for immune function and skin health.",
          },
          {
            picture: '/recipes/ingredients/beef-liver.png',
            title: 'Beef Liver',
            description:
              'Beef liver is extremely nutrient-dense, offering a rich source of vitamin A for eye health, iron for healthy blood cells, and B vitamins for energy production.',
          },
          {
            picture: '/recipes/ingredients/whole-grain-rice.png',
            title: 'Whole-Grain Rice',
            description:
              "A wholesome source of complex carbohydrates, whole-grain rice provides dogs with sustained energy. It's also gentle on the digestive system, making it a good choice for dogs with sensitive stomachs.",
          },
          {
            picture: '/recipes/ingredients/peas.png',
            title: 'Peas',
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/spinach.png',
            title: 'Spinach',
            description:
              'Spinach is packed with vitamins A, C, and K, and are also a good source of iron and antioxidants. It supports immune health and provides anti-inflammatory benefits.',
          },
          {
            picture: '/recipes/ingredients/blueberry.png',
            title: 'Blueberry',
            description:
              'Blueberries are superfoods for dogs, rich in antioxidants, vitamins C and K, and fibre. They support urinary tract health and can contribute to overall cellular health and cognitive function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            title: 'Flaxseed',
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            title: 'Salmon Oil',
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
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
        ingredientDescription="Duck Breast, Chicken Liver, Goji Berry, Winter Melon, Peas, Whole-Grain Pasta, Flaxseed,
          Salmon Oil, OCELLE Targeted Nutrient Blend."
        ingredients={[
          {
            picture: '/recipes/ingredients/duck-breast.png',
            title: 'Duck Breast',
            description:
              'Duck is lean and packed with essential amino acids, vitamins, and antioxidants to promote good health. It’s also a novel protein for many dogs, making it suitable for those with sensitivities or allergies.',
          },
          {
            picture: '/recipes/ingredients/chicken-liver.png',
            title: 'Chicken Liver',
            description:
              'A nutrient powerhouse, packed with iron for healthy blood, vitamin A for sharp vision, B vitamins for energy metabolism, and choline for healthy brain function.',
          },
          {
            picture: '/recipes/ingredients/winter-melon.png',
            title: 'Winter Melon',
            description:
              "Winter melon is very low in calories and high in fibre, aiding in digestion. It's also hydrating and can be beneficial for dogs with kidney issues or those needing a low-fat diet.",
          },
          {
            picture: '/recipes/ingredients/peas.png',
            title: 'Peas',
            description:
              'Peas are low in calories and are a great source of plant-based protein and fibre, which can aid in digestion and nutrient absorption. They also contain essential vitamins and minerals like vitamin K, manganese, and folate.',
          },
          {
            picture: '/recipes/ingredients/goji-berry.png',
            title: 'Goji Berry',
            description:
              'Goji berries are known for their high antioxidant content, supporting immune health, vision, and overall cellular function.',
          },
          {
            picture: '/recipes/ingredients/flaxseed.png',
            title: 'Flaxseed',
            description:
              'Flaxseeds are an excellent source of essential fatty acids and fibre, promoting better skin, glossy coats, healthier brains, stronger hearts, pain-free joints, reduced inflammation, and improved digestion.',
          },
          {
            picture: '/recipes/ingredients/whole-grain-pasta.png',
            title: 'Whole-Grain Pasta',
            description:
              'A source of complex carbohydrates, whole grain pasta provides sustained energy. It is also a good source of fibre, which aids in digestion, and B vitamins for energy metabolism.',
          },
          {
            picture: '/recipes/ingredients/salmon-oil.png',
            title: 'Salmon Oil',
            description:
              'High in omega-3 fatty acids, salmon oil helps in reducing inflammation, supporting joint health, and maintaining a healthy, shiny coat.',
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
          <Headings tag="h2" styles="h2" className="text-primary">
            Freshen Up With A Science First Approach To Pet Food
          </Headings>
          <p className="mt-6 text-lg">
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
