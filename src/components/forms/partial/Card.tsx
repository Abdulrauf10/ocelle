import type { Control, FieldValues, FieldPath } from 'react-hook-form';
import Stripe from '../../icons/Stripe';
import Lock from '../../icons/Lock';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PasswordField from '../../controls/PasswordField';
import TextField from '../../controls/TextField';

export interface IPartialCardForm {
  cardName: string;
  cardNo: string;
  cardExp: string;
  cardCvc: string;
}

interface PartialCardFormProps<T extends FieldValues> {
  control: Control<T, any>;
}

export default function PartialCardForm<T extends FieldValues>({
  control,
}: PartialCardFormProps<T>) {
  const t = useTranslations();

  return (
    <>
      <div className="-mx-3 flex flex-wrap items-center">
        <Stripe className="mx-3 my-2 w-24" />
        <div className="mx-3 my-2 flex items-center">
          <Lock className="relative -top-0.5 w-6" />
          <span className="ml-4 text-lg text-[#7B8D97]">
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
          <div className="w-full p-2">
            <TextField
              name={'cardName' as FieldPath<T>}
              control={control}
              rules={{ required: true }}
              label={t('name-on-card')}
              fullWidth
            />
          </div>
          <div className="w-full p-2">
            <TextField
              name={'cardNo' as FieldPath<T>}
              control={control}
              rules={{ required: true }}
              label={t('card-number')}
              mask={{
                pattern: [
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ],
              }}
              fullWidth
            />
          </div>
          <div className="w-1/2 p-2">
            <TextField
              name={'cardExp' as FieldPath<T>}
              control={control}
              rules={{ required: true }}
              label={t('card-expiration-date')}
              mask={{
                pattern: (value) => {
                  if (value[0] === '1') {
                    return [/1/, /[0-2]/, '/', /\d/, /\d/];
                  }
                  return [/0|1/, /[0-9]/, '/', /\d/, /\d/];
                },
              }}
              fullWidth
            />
          </div>
          <div className="w-1/2 p-2">
            <PasswordField
              name={'cardCvc' as FieldPath<T>}
              control={control}
              rules={{ required: true }}
              label={t('cvc')}
              fullWidth
            />
          </div>
        </div>
      </div>
    </>
  );
}
