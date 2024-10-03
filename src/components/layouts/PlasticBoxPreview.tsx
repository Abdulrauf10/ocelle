import clsx from 'clsx';

import PlasticBox from './PlasticBox';

import { Recipe } from '@/enums';

export default function PlasticBoxPreview({
  recipe1,
  recipe2,
  name,
}: {
  recipe1: Recipe;
  recipe2?: Recipe;
  name: string;
}) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative w-[60%]">
          <div className="pt-[128%]"></div>
        </div>
        <div
          className={clsx(
            'absolute z-10',
            recipe2
              ? 'left-[2.5%] top-1/2 w-[55%] -translate-y-1/2'
              : 'left-1/2 top-1/2 w-[60%] -translate-x-1/2 -translate-y-1/2'
          )}
        >
          <PlasticBox name={name} recipe={recipe1} />
        </div>
        {recipe2 && (
          <div className="absolute right-[2.5%] top-1/2 z-10 w-[60%] -translate-y-1/2">
            <PlasticBox name={name} recipe={recipe2} />
          </div>
        )}
      </div>
    </div>
  );
}
