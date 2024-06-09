import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Recipe } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';

export default function PlasticBox({ name, recipe }: { name: string; recipe: Recipe }) {
  const t = useTranslations();

  return (
    <div className="w-full pt-[128%]" style={{ containerType: 'size' }}>
      <Image
        src={`/plastic/${getRecipeSlug(recipe)}.png`}
        alt="ocelle food"
        fill
        className="object-contain"
      />
      <span className="absolute left-1/2 top-[46%] -translate-x-1/2 text-[5cqw] font-bold leading-none">
        {t('{}-apostrophe', { value: name })}
      </span>
    </div>
  );
}
