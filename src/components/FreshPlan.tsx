import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Price from './Price';
import CircleTick from './icons/CircleTick';

interface FreshPlanProps {
  title: string;
  picture: string;
  pricePerDay: number;
  discountedPricePerDay?: number;
  recommended?: boolean;
  firstDiscount?: boolean;
  error?: boolean;
  selected: boolean;
  onSelect(): void;
}

export default function FreshPlan({
  title,
  picture,
  pricePerDay,
  discountedPricePerDay,
  recommended,
  firstDiscount,
  error,
  selected,
  onSelect,
  children,
}: React.PropsWithChildren<FreshPlanProps>) {
  const t = useTranslations();
  const b = useTranslations('Button');

  return (
    <div
      className={clsx(
        'drop-shadow-style-1 mx-auto flex h-full max-w-[400px] cursor-pointer flex-col rounded-[30px] border bg-white p-6 text-left shadow-black/20',
        error
          ? 'border-error'
          : selected
            ? 'border-primary'
            : 'border-transparent !drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]'
      )}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div
        className={clsx(
          'mt-0.5 inline-block rounded-3xl bg-secondary px-3 py-0.5 text-center font-open-sans text-sm italic text-white max-xs:items-center xs:hidden',
          !recommended && 'opacity-0'
        )}
      >
        {t('recommended')}
      </div>
      <div className="flex items-start max-xs:mt-4 max-xs:flex-wrap max-xs:justify-center max-xs:text-center">
        <Image
          src={picture}
          alt={title}
          width={160}
          height={160}
          className="min-w-[160px] rounded-2xl"
        />
        <div className="ml-4 max-xs:ml-0 max-xs:mt-2">
          <h3
            className={clsx(
              'text-lg font-bold uppercase',
              selected ? 'text-primary' : 'text-brown'
            )}
          >
            {title}
          </h3>
          <div
            className={clsx(
              'mt-0.5 hidden rounded-3xl bg-secondary px-3 py-0.5 text-center font-open-sans text-sm italic text-white xs:inline-block',
              !recommended && 'opacity-0'
            )}
          >
            {t('recommended')}
          </div>
          <p className="mt-2">
            Starting at:
            <br />
            <Price value={pricePerDay} discount={!!discountedPricePerDay} />
            {discountedPricePerDay && (
              <Price className="ml-1 font-bold" value={discountedPricePerDay} />
            )}
            <span className="font-bold text-dark-green">/day</span>.
          </p>
          {firstDiscount && (
            <p className="mt-2 leading-[1.25em]">
              {t.rich('enjoy-50-off-for-your-starter-box', {
                h: (chunks) => <span className="font-bold text-dark-green">{chunks}</span>,
              })}
            </p>
          )}
        </div>
      </div>
      <p className="mt-5 h-full">{children}</p>
      <div className="mt-5 flex justify-end text-center font-open-sans text-white">
        <div
          className={clsx(
            'inline-flex min-w-[120px] items-center justify-center rounded-3xl px-2 py-1',
            selected ? 'bg-primary' : 'bg-brown'
          )}
        >
          {selected && <CircleTick className="mr-2 inline-block h-5 w-5" />}
          {selected ? b('selected') : b('select')}
        </div>
      </div>
    </div>
  );
}
