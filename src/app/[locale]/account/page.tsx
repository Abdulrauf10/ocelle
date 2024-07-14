import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

import ClickableBlock from './ClickableBlock';

import { getLoginedMeFullSize } from '@/actions';
import stripeClient from '@/clients/stripe';
import Container from '@/components/Container';
import Bell from '@/components/icons/Bell';
import Billing from '@/components/icons/Billing';
import HomeAddress from '@/components/icons/HomeAddress';
import Unbox from '@/components/icons/Unbox';
import User from '@/components/icons/User';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { GetOrderDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import getSentence from '@/servers/getSentence';

export default async function Account() {
  const t = await getTranslations();
  const sentence = await getSentence();
  const {
    id,
    dogs,
    defaultShippingAddress,
    defaultBillingAddress,
    orders,
    email,
    stripe,
    stripePaymentMethod,
  } = await getLoginedMeFullSize();

  if (!stripe || !stripePaymentMethod) {
    throw new StripeNotReadyError(id);
  }

  const { card } = await stripeClient.retrieveCustomerPaymentMethod(stripePaymentMethod, stripe);

  if (!card) {
    throw new Error('unknown error in stripe');
  }

  const { order } = await executeGraphQL(GetOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      id: orders[0].id,
    },
  });

  if (!order) {
    throw new Error('order is not sync with api');
  }

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">{t('my-info')}</h1>
        <div className="mt-4"></div>
        <p className="text-center">{t('manage-your-account-information')}</p>
        <div className="my-4"></div>
        <div className="mx-auto max-w-[480px]">
          <ClickableBlock
            icon={<Unbox className="w-16" />}
            title={t('orders')}
            description={t('current-{}', {
              value: t('order-id-{}', { id: order.number }),
            })}
            href="/account/order"
          />
          <ClickableBlock
            className="mt-8"
            icon={<User className="mx-2 w-12" />}
            title={t('account-info')}
            description={email}
            href="/account/basic"
          />
          <ClickableBlock
            className="mt-8"
            icon={<HomeAddress className="w-16" />}
            title={t('address')}
            href="/account/address"
          >
            {defaultShippingAddress && (
              <div className="mt-4 flex max-xs:flex-wrap">
                <strong className="min-w-[82px] text-gold">
                  {t('{}-colon', { value: t('delivery') })}
                </strong>
                <span className="w-full">{sentence.address(defaultShippingAddress)}</span>
              </div>
            )}
            {defaultBillingAddress && (
              <div className="mt-3 flex max-xs:flex-wrap">
                <strong className="min-w-[82px] text-gold">
                  {t('{}-colon', { value: t('billing') })}
                </strong>
                <span className="w-full">{sentence.address(defaultBillingAddress)}</span>
              </div>
            )}
          </ClickableBlock>
          <ClickableBlock
            className="mt-8"
            icon={<Billing className="w-14 px-1" />}
            title={t('payment-info')}
            href="/account/payment"
          >
            <div className="mt-4 flex items-center">
              {card.brand === 'visa' ? (
                <Image
                  src="/payments/visa.svg"
                  alt="Master Card Icon"
                  className="inline-block"
                  width={28}
                  height={18}
                />
              ) : (
                <Image
                  src="/payments/mc.svg"
                  alt="Master Card Icon"
                  className="inline-block"
                  width={28}
                  height={18}
                />
              )}
              &nbsp;
              <span className="relative top-0.5">**** **** ****</span>&nbsp;{card.last4}
            </div>
          </ClickableBlock>
          <ClickableBlock
            className="mt-8"
            icon={<Bell className="mx-3 w-10" />}
            title={t('subscriptions')}
            description={
              <div>
                {dogs.map((dog) => {
                  return (
                    <div key={dog.id} className="mt-1 flex items-center">
                      <div
                        className={clsx(
                          'h-3 w-3 rounded-full',
                          dog.plan.isEnabled ? 'bg-[#1EA939]' : 'bg-error'
                        )}
                      ></div>
                      <div className="ml-3 min-w-[80px]">{dog.name}</div>
                      <div className="pl-1">
                        {t('plan-{}', { status: dog.plan.isEnabled ? t('active') : t('inactive') })}
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            href="/account/subscription"
          />
        </div>
      </Container>
    </main>
  );
}
