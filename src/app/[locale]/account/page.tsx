import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import Unbox from '@/components/icons/Unbox';
import User from '@/components/icons/User';
import HomeAddress from '@/components/icons/HomeAddress';
import Billing from '@/components/icons/Billing';
import Bell from '@/components/icons/Bell';
import ClickableBlock from './ClickableBlock';
import { getTranslations } from 'next-intl/server';
import { getLoginedMeFullSize } from '@/actions';
import { executeQuery } from '@/helpers/queryRunner';
import { Dog } from '@/entities';
import clsx from 'clsx';
import { AddressToSentence } from '@/helpers/translation';

export default async function Account() {
  const t = await getTranslations();
  const me = await getLoginedMeFullSize();
  const { dogs } = await executeQuery(async (queryRunner) => {
    return {
      dogs: await queryRunner.manager.find(Dog, {
        where: {
          user: { id: me.id },
        },
        relations: {
          plan: true,
        },
      }),
    };
  });

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">{t('my-info')}</h1>
        <p className="mt-4 text-center">{t('manage-your-account-information')}</p>
        <div className="py-4"></div>
        <div className="mx-auto max-w-[480px]">
          <ClickableBlock
            icon={<Unbox className="w-16" />}
            title={t('orders')}
            description={t('current-{}', {
              value: t('order-id-{}', { id: me.orders!.edges[0].node.number }),
            })}
            href="/account/order"
          />
          <ClickableBlock
            className="mt-8"
            icon={<User className="mx-2 w-12" />}
            title={t('account-info')}
            description={me.email}
            href="/account/basic"
          />
          <ClickableBlock
            className="mt-8"
            icon={<HomeAddress className="w-16" />}
            title={t('address')}
            href="/account/address"
          >
            <div className="mt-4 flex max-xs:flex-wrap">
              <strong className="min-w-[82px] text-gold">
                {t('{}-colon', { value: t('delivery') })}
              </strong>
              <span className="w-full">{AddressToSentence(t, me.defaultShippingAddress!)}</span>
            </div>
            <div className="mt-3 flex max-xs:flex-wrap">
              <strong className="min-w-[82px] text-gold">
                {t('{}-colon', { value: t('billing') })}
              </strong>
              <span className="w-full">{AddressToSentence(t, me.defaultBillingAddress!)}</span>
            </div>
          </ClickableBlock>
          <ClickableBlock
            className="mt-8"
            icon={<Billing className="w-14 px-1" />}
            title={t('payment-info')}
            href="/account/payment"
          >
            <div className="mt-4 flex items-center">
              [
              <Image
                src="/payments/mc.svg"
                alt="Master Card Icon"
                className="inline-block"
                width={28}
                height={18}
              />
              &nbsp;
              <span className="relative top-0.5">**** **** ****</span>&nbsp;1234]
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
