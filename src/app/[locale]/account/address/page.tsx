import { addDays } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { changeBillingAddressAction, changeShippingAddressAction } from './actions';

import { getLoginedMeFullSize } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import BillingAddressForm from '@/components/forms/BillingAddress';
import DeliveryAddressForm from '@/components/forms/DeliveryAddress';
import { EditAddressProvider } from '@/contexts/editAddress';
import { CountryCode } from '@/gql/graphql';
import getSentence from '@/servers/getSentence';

export default async function Addresses() {
  const t = await getTranslations();
  const { defaultShippingAddress, defaultBillingAddress, isDeliveryUsAsBillingAddress } =
    await getLoginedMeFullSize();
  const sentence = await getSentence();

  return (
    <AppThemeProvider>
      <EditAddressProvider initialIsDeliveryUsAsBillingAddress={isDeliveryUsAsBillingAddress}>
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
                    date: sentence.date(addDays(new Date(), 14), true),
                  }
                )}
              </p>
              <div className="py-4"></div>
              <DeliveryAddressForm
                firstName={defaultShippingAddress?.firstName}
                lastName={defaultShippingAddress?.lastName}
                streetAddress1={defaultShippingAddress?.streetAddress1}
                streetAddress2={defaultShippingAddress?.streetAddress2}
                district={defaultShippingAddress?.city}
                region={defaultShippingAddress?.countryArea}
                country={defaultShippingAddress?.country.code as CountryCode | undefined}
                isSameAsBillingAddress={isDeliveryUsAsBillingAddress}
                action={changeShippingAddressAction}
              />
              <div className="py-12"></div>
              <h2 className="heading-4 text-center font-bold text-primary">
                {t('billing-address')}
              </h2>
              <div className="py-4"></div>
              <BillingAddressForm
                firstName={defaultBillingAddress?.firstName}
                lastName={defaultBillingAddress?.lastName}
                streetAddress1={defaultBillingAddress?.streetAddress1}
                streetAddress2={defaultBillingAddress?.streetAddress2}
                district={
                  defaultBillingAddress?.country.code === CountryCode.Hk
                    ? defaultBillingAddress?.city
                    : defaultBillingAddress?.countryArea
                }
                region={
                  defaultBillingAddress?.country.code === CountryCode.Hk
                    ? defaultBillingAddress?.countryArea
                    : defaultBillingAddress?.city
                }
                country={defaultBillingAddress?.country.code as CountryCode | undefined}
                postalCode={defaultBillingAddress?.postalCode}
                action={changeBillingAddressAction}
              />
              <div className="mt-12 text-center">
                <UnderlineBackButton label={t('go-back')} />
              </div>
            </div>
          </Container>
        </main>
      </EditAddressProvider>
    </AppThemeProvider>
  );
}
