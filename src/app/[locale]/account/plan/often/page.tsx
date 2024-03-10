import Container from '@/components/Container';
import React from 'react';
import { SaleorUser } from '@/entities';
import { getTranslations } from 'next-intl/server';
import { OrderSize } from '@/enums';
import { getStoreMe } from '@/storeUserProvider';
import { executeQuery } from '@/helpers/queryRunner';
import setOrderSizeAction from './action';
import OrderSizeForm from '@/components/forms/OrderSize';
import AccountBackButton from '../../AccountBackButton';

async function fetchData() {
  const me = await getStoreMe();

  return executeQuery(async (queryRunner) => {
    const user = await queryRunner.manager.findOne(SaleorUser, {
      where: {
        saleorId: me.id,
      },
    });
    if (!user) {
      throw new Error('failed to handle request');
    }
    return { user };
  });
}

export default async function PlanOften() {
  const t = await getTranslations();
  const { user } = await fetchData();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">
          {t('how-often-would-you-like-to-receive-deliveries')}
        </h1>
        <OrderSizeForm initialSize={user.orderSize} action={setOrderSizeAction} />
        <div className="mt-8 text-center">
          <AccountBackButton />
        </div>
      </Container>
    </main>
  );
}
