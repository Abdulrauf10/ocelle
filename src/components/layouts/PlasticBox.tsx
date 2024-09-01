import Image from 'next/image';

import { Recipe } from '@/enums';
import RecipeHelper from '@/helpers/recipe';

export default function PlasticBox({ name, recipe }: { name: string; recipe: Recipe }) {
  return (
    <div className="w-full pt-[128%]" style={{ containerType: 'size' }}>
      <Image
        src={`/plastic/${RecipeHelper.getSlug(recipe)}.png`}
        alt="ocelle food"
        fill
        className="object-contain"
      />
      <span className="absolute left-1/2 top-[46%] -translate-x-1/2 select-none text-[5cqw] font-bold leading-none">
        {`${name}’s`}
      </span>
    </div>
  );
}
