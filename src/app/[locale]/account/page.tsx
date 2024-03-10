'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Container from '@/components/Container';
import Unbox from '@/components/icons/Unbox';
import User from '@/components/icons/User';
import HomeAddress from '@/components/icons/HomeAddress';
import Billing from '@/components/icons/Billing';
import Bell from '@/components/icons/Bell';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

interface BlockProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  onClick(): void;
}

function Block({
  className,
  icon,
  title,
  description,
  onClick,
  children,
}: React.PropsWithChildren<BlockProps>) {
  return (
    <div
      className={clsx(
        '-mx-2 flex cursor-pointer items-center rounded-2xl border border-gray bg-white px-4 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex-1 px-2">
        <div className="-mx-2 flex items-center">
          <div className="px-2">{icon}</div>
          <div className="px-2">
            <div className="text-xl text-brown">{title}</div>
            {description && <div>{description}</div>}
          </div>
        </div>
        {children}
      </div>
      <div className="px-2">
        <button>
          <svg viewBox="0 0 7 13" className="w-2">
            <polyline
              className="fill-none stroke-brown"
              strokeLinecap="round"
              strokeLinejoin="round"
              points=".5 .5 6.5 6.5 .5 12.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Account() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-3 text-center font-bold text-primary">{t('my-info')}</h1>
        <p className="mt-4 text-center">{t('manage-your-account-information')}</p>
        <div className="py-4"></div>
        <div className="mx-auto max-w-[480px]">
          <Block
            icon={<Unbox className="w-16" />}
            title={t('orders')}
            description={t('current-{}', { value: t('order-id-{}', { id: '[xxxxxx]' }) })}
            onClick={() => router.push('/account/order')}
          />
          <Block
            className="mt-8"
            icon={<User className="mx-2 w-12" />}
            title={t('account-info')}
            description="ksaunders@ocelle.dog"
            onClick={() => router.push('/account/basic')}
          />
          <Block
            className="mt-8"
            icon={<HomeAddress className="w-16" />}
            title={t('address')}
            onClick={() => router.push('/account/address')}
          >
            <div className="mt-4 flex max-xs:flex-wrap">
              <strong className="min-w-[82px] text-gold">
                {t('{}-colon', { value: t('delivery') })}
              </strong>
              <span className="w-full">
                [20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]
              </span>
            </div>
            <div className="mt-3 flex max-xs:flex-wrap">
              <strong className="min-w-[82px] text-gold">
                {t('{}-colon', { value: t('billing') })}
              </strong>
              <span className="w-full">
                [20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]
              </span>
            </div>
          </Block>
          <Block
            className="mt-8"
            icon={<Billing className="w-14 px-1" />}
            title={t('payment-info')}
            onClick={() => router.push('/account/payment')}
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
          </Block>
          <Block
            className="mt-8"
            icon={<Bell className="mx-3 w-10" />}
            title={t('subscriptions')}
            description={
              <div>
                <div className="mt-1 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#1EA939]"></div>
                  <div className="ml-3 min-w-[80px]">[Charlie]</div>
                  <div className="pl-1">{t('plan-{}', { status: t('active') })}</div>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-error"></div>
                  <div className="ml-3 min-w-[80px]">[Muffin]</div>
                  <div className="pl-1">{t('plan-{}', { status: t('inactive') })}</div>
                </div>
              </div>
            }
            onClick={() => router.push('/account/subscription')}
          />
        </div>
      </Container>
    </main>
  );
}
