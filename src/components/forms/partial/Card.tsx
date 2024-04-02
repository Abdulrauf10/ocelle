import Stripe from '../../icons/Stripe';
import Lock from '../../icons/Lock';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  StripeTextFieldCVC,
  StripeTextFieldExpiry,
  StripeTextFieldNumber,
} from '@/components/controls/StripeTextField';

export interface IPartialCardForm {
  cardName: string;
  cardNo: string;
  cardExp: string;
  cardCvc: string;
}

export default function PartialCardForm() {
  const t = useTranslations();

  return (
    <>
      <div className="-mx-3 flex flex-wrap items-center">
        <Stripe className="mx-3 my-2 w-20" />
        <div className="mx-3 my-2 flex items-center">
          <Lock className="relative -top-0.5 w-4" />
          <span className="body-3 ml-4 text-lg text-[#7B8D97]">
            {t('all-transactions-are-secure-and-encrypted')}
          </span>
        </div>
      </div>
      <div className="mt-3">
        <div className="-m-1.5 flex flex-wrap items-center">
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/visa.svg" alt="Master Card" width={42} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary bg-white">
              <Image src="/payments/mc.svg" alt="Master Card" width={42} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-[#286CB4] bg-[#286CB4]">
              <Image src="/payments/amex.svg" alt="Master Card" width={45} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/union-pay.svg" alt="Master Card" width={45} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/google-pay.svg" alt="Master Card" width={45} height={27} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/apple-pay.svg" alt="Master Card" width={45} height={28} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="-m-2 flex flex-wrap">
          {/* <div className="w-full p-2">
            <TextField
              name={'cardName' as FieldPath<T>}
              control={control}
              rules={{ required: true }}
              label={t('name-on-card')}
              fullWidth
            />
          </div> */}
          <div className="w-full p-2">
            <StripeTextFieldNumber
              label={t('card-number')}
              InputProps={{
                inputProps: {
                  options: {
                    placeholder: '',
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-1/2 p-2">
            <StripeTextFieldExpiry
              label={t('card-expiration-date')}
              InputProps={{
                inputProps: {
                  options: {
                    placeholder: '',
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-1/2 p-2">
            <StripeTextFieldCVC
              label={t('cvc')}
              InputProps={{
                inputProps: {
                  options: {
                    placeholder: '',
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
