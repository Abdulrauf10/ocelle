'use client';

import Button from '@/components/Button';
import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function RecipeBenefits() {
  const t = useTranslations();

  const benefits = React.useMemo(() => {
    return [
      {
        title: 'Feeding Fresh Is Shown to Increase Lifespan & Delay Onset of Chronic Disease',
        description:
          'Dogs fed a homemade diet (like our recipes) lived up to 3 years longer than those on traditional processed diets. Even a slight 25% reduction in processed food intake showed beneficial impact.',
      },
      {
        title: 'Meals Portioned to the Exact Calorie Reduces the Likelihood of Obesity',
        description:
          'Overweight dogs have reduced lifespans of up to 2.5 years and showed an increased probability of developing chronic diseases. While food bag guidelines offer a starting point to portion sizes, every dog is an individual with unique needs. That’s why we’ve worked closely with our Veterinarian to develop a formula that determines the optimal calorie needs for different combinations of breed, age, activity level, and ideal weight.',
      },
      {
        title: 'High Quality Ingredients With ReFreshing Transparency',
        description:
          'Traditional pet food is often produced under high heat (allowing for the use of low-quality ingredients), resulting in reduced nutritional quality, palatability, and the potential production of carcinogenic compounds.',
      },
      {
        title: 'Allergy Control',
        description:
          'Kibble or canned foods are routinely found to contain ingredients not listed on the label, so it can be hard to be sure what’s going into your dog’s bowl. Our not so secret recipes are 100% transparent and built with limited, but powerful ingredients – allowing for confident allergy control.',
      },
      {
        title:
          "Purely 'Raw Diets' Provide No Proven Additional Benefits While Increasing Health and Safety Concerns",
        description:
          'Most Veterinarians and governing bodies discourage the feeding of raw diets, due to safety concerns around nutritional imbalances and contamination.',
      },
      {
        title: 'Satisfy Picky Eaters',
        description:
          'Fresh food focuses on using whole, unprocessed ingredients like meat, vegetables, and fruits. These ingredients better retain their natural flavours and textures, enticing even the pickiest of eaters, making mealtimes more exciting for your dog.',
      },
      {
        title: 'Increased Vitality and Happiness',
        description:
          'More excitement at mealtimes; smaller stools (better poops!); soft and shiny coats; more energy; increased stamina… and much, much more!',
      },
    ];
  }, []);
  const [opened, setOpened] = React.useState(false);

  return (
    <div className="rounded-[30px] border border-gray bg-white p-10 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:p-6">
      <div className="flex max-md:items-end">
        <h2 className="heading-4 flex-1 text-center font-bold text-primary">
          The Main Benefits Of Feeding With OCELLE’s Fresh Recipes
        </h2>
        <button className="ml-3" onClick={() => setOpened(!opened)}>
          {opened ? <Sub className="w-4" /> : <Plus className="w-4" />}
        </button>
      </div>
      <hr className="my-4 border-gray" />
      {benefits.map((benefit, idx) => {
        return (
          <div key={idx} className="mt-3 text-lg">
            <div className="flex">
              <div className="mt-1.5 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-primary text-sm font-bold leading-none text-white">
                {idx + 1}
              </div>
              <h3 className="body-1 ml-2 text-primary">{benefit.title}</h3>
            </div>
            {opened && <p className="body-1 ml-8 mt-1">{benefit.description}</p>}
          </div>
        );
      })}
      <div className="mt-6 text-center">
        <Button href="/why-fresh">{t('learn-more')}</Button>
      </div>
    </div>
  );
}
