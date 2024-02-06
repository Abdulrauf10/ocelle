import clsx from 'clsx';
import Image from 'next/image';
import Price from './Price';
import CircleTick from './icons/CircleTick';
import { useTranslations } from 'next-intl';

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

  return (
    <div
      className={clsx(
        'mx-auto flex h-full max-w-[400px] cursor-pointer flex-col rounded-[30px] border bg-white p-6 text-left shadow-[0_0_15px_rgba(0,0,0,0.2)]',
        error ? 'border-error' : selected ? 'border-primary' : 'border-transparent'
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
      <div className="flex items-start max-xs:flex-wrap">
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
              'mt-0.5 inline-block rounded-3xl bg-secondary px-3 py-0.5 text-center font-open-sans text-sm italic text-white',
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
            <p className="mt-2">
              Enjoy <span className="font-bold text-dark-green">50%</span> off for{' '}
              <br className="max-lg:hidden" />
              your starter box.
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
          {selected ? 'Selected' : 'Select'}
        </div>
      </div>
    </div>
  );
}
