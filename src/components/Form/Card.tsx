import { Controller, type Control, type FieldValues } from 'react-hook-form';
import Stripe from '../Icon/Stripe';
import Lock from '../Icon/Lock';
import { TextField } from '@mui/material';
import Image from 'next/image';

interface CardFormProps {
  control: Control<FieldValues>;
}

export default function CardForm({ control }: CardFormProps) {
  return (
    <>
      <div className="-mx-3 flex flex-wrap items-center">
        <Stripe className="mx-3 my-2 w-24" />
        <div className="mx-3 my-2 flex items-center">
          <Lock className="relative -top-0.5 w-6" />
          <span className="ml-4 text-lg text-[#7B8D97]">
            All transactions are secure and encrypted.
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
            <Controller
              name="cardName"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField {...field} label="Name On Card" fullWidth error={!!error} />
              )}
            />
          </div>
          <div className="w-full p-2">
            <Controller
              name="cardNo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField {...field} label="Card Number" fullWidth error={!!error} />
              )}
            />
          </div>
          <div className="w-1/2 p-2">
            <Controller
              name="cardExp"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField {...field} label="Card Expiration Date" fullWidth error={!!error} />
              )}
            />
          </div>
          <div className="w-1/2 p-2">
            <Controller
              name="cardCvc"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField {...field} label="CVC" fullWidth error={!!error} />
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}
