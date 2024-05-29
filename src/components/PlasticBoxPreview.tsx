import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Recipe } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';

export default function PlasticBoxPreview({
  recipe1,
  recipe2,
  name,
}: {
  recipe1: Recipe;
  recipe2?: Recipe;
  name: string;
}) {
  const t = useTranslations();

  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative w-[60%]">
          <div className="pt-[128%]"></div>
        </div>
        <div
          className={clsx(
            'absolute z-10 w-[60%]',
            recipe2
              ? 'left-[2.5%] top-1/2 -translate-y-1/2'
              : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          )}
        >
          <div className="w-full pt-[128%]" style={{ containerType: 'size' }}>
            <Image
              src={`/plastic/${getRecipeSlug(recipe1)}.png`}
              alt="ocelle food"
              fill
              className="object-contain"
            />
            <span className="absolute left-1/2 top-[46%] -translate-x-1/2 text-[5cqw] font-bold leading-none">
              {t('{}-apostrophe', { value: name })}
            </span>
          </div>
        </div>
        {recipe2 && (
          <div className="absolute right-[2.5%] top-1/2 w-[55%] -translate-y-1/2">
            <div className="w-full pt-[128%]" style={{ containerType: 'size' }}>
              <Image
                src={`/plastic/${getRecipeSlug(recipe2)}.png`}
                alt="ocelle food"
                fill
                className="object-contain"
              />
              <span className="absolute left-1/2 top-[46%] -translate-x-1/2 text-[5cqw] font-bold leading-none">
                {t('{}-apostrophe', { value: name })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
