'use client';

import { colon } from '@/helpers/translation';
import Button from '../buttons/Button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../Dialog';
import Close from '../icons/Close';
import { useTranslations } from 'next-intl';

export default function CartDialog({
  lines,
  subtotal,
  disabled,
  onCheckoutClick,
  children,
}: React.PropsWithChildren<{
  lines: React.ReactNode;
  subtotal: number;
  disabled?: boolean;
  onCheckoutClick(): void;
}>) {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex h-screen w-full items-start justify-end p-3">
          <div className="relative w-full max-w-[380px] rounded-[26px] border-2 border-primary bg-white text-left shadow-[7px_7px_15px_rgba(0,0,0,0.05)]">
            <div className="px-8 py-6">
              <div className="heading-4 text-center font-bold text-primary">{t('your-cart')}</div>
              <hr className="my-4 border-primary" />
              {lines}
            </div>
            <div className="bg-gold bg-opacity-10 px-8 py-6">
              <div className="body-2 mb-4 flex justify-between font-bold">
                <div>{colon(t, 'subtotal')}</div>
                <div>HK${subtotal}</div>
              </div>
              <Button fullWidth className="my-2" onClick={onCheckoutClick} disabled={disabled}>
                {t('continue-to-checkout')}
              </Button>
            </div>
            <DialogClose className="absolute right-5 top-4 cursor-pointer">
              <Close className="h-4 w-4 text-brown" />
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
