'use client';

import Button from '@/components/Button';
import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';
import React from 'react';

export default function RecipeBenefits() {
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
          'Overweight dogs have reduced lifespans of up to 2.5 years and showed an increased probability of developing chronic diseases.',
      },
      {
        title: 'High Quality Ingredients With ReFreshing Transparency',
        description:
          'Traditional pet food is often produced under high heat (allowing for the use of low-quality ingredients), resulting in reduced nutritional quality, palatability, and the potential production of carcinogenic compounds.',
      },
      {
        title:
          'Raw Diets Pose Increased Safety Concerns, Without Providing Any Proven Additional Benefits',
        description:
          'Most Veterinarians and governing bodies discourage the feeding of raw diets, due to safety concerns around nutritional imbalances and contamination.',
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
        <strong className="flex-1 text-center text-3xl text-primary">
          What Are The Main Benefits Of Feeding With OCELLE’s Fresh Recipes
        </strong>
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
              <div className="ml-2 text-primary">{benefit.title}</div>
            </div>
            {opened && <p className="ml-6">{benefit.description}</p>}
          </div>
        );
      })}
      <div className="mt-6 text-center">
        <Button>Learn More</Button>
      </div>
    </div>
  );
}
