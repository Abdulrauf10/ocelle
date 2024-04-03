'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Button from '@/components/buttons/Button';
import PartialAddressForm from '@/components/forms/partial/Address';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import { useTranslations } from 'next-intl';
import AppThemeProvider from '@/components/AppThemeProvider';

interface AddressBlockProps {
  isDeliveryAddress?: boolean;
  onSubmit(values: unknown): void;
}

function AddressBlock({ isDeliveryAddress, onSubmit }: AddressBlockProps) {
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PartialAddressForm control={control} watch={watch} />
      {isDeliveryAddress && (
        <div className="mt-4">
          <RoundedCheckbox
            name="isSameBillingAddress"
            value={1}
            control={control}
            label={t('use-as-{}', { name: t('billing-address') })}
          />
        </div>
      )}
      <div className="-mx-2 mt-10 flex">
        <div className="w-1/2 px-2">
          <Button fullWidth onClick={reset} reverse>
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth>{t('save-changes')}</Button>
        </div>
      </div>
    </form>
  );
}

export default function Addresses() {
  const t = useTranslations();
  const router = useRouter();

  const onDeliverySubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  const onBillingSubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <h2 className="heading-4 text-center font-bold text-primary">
              {t('delivery-address')}
            </h2>
            <p className="mt-4 text-center">
              {t.rich(
                'delivery-address-changes-will-be-in-effect-starting-with-your-{}-order-scheduled-for-the-{}',
                {
                  stage: 'next',
                  date: '29th of December 2023',
                  strong: (chunks) => <strong>{chunks}</strong>,
                }
              )}
            </p>
            <div className="py-4"></div>
            <AddressBlock isDeliveryAddress onSubmit={onDeliverySubmit} />
            <div className="py-12"></div>
            <h2 className="heading-4 text-center font-bold text-primary">{t('billing-address')}</h2>
            <div className="py-4"></div>
            <AddressBlock onSubmit={onBillingSubmit} />
            <div className="mt-12 text-center">
              <UnderlineButton onClick={() => router.back()} label={t('go-back')} />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
