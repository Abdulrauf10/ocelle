'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from '../mui-theme';
import { Route } from './types';
import FragmentRouter, { useFragmentRouterController } from '@/components/FragmentRouter';
import InfoFragment from './fragments/info';
import OrdersFragment from './fragments/orders';
import AddressFragment from './fragments/address';
import AccountFragment from './fragments/account';
import PasswordFragment from './fragments/password';
import PaymentsFragment from './fragments/payments';
import SubscriptionsFragment from './fragments/subscriptions';
import PauseFragment from './fragments/pause';
import PauseDoneFragment from './fragments/pauseDone';

export default function Account() {
  const controller = useFragmentRouterController<Route>({
    defaultRoute: 'pause-done',
    routes: [
      {
        name: 'info',
        component: InfoFragment,
      },
      {
        name: 'account',
        component: AccountFragment,
      },
      {
        name: 'password',
        component: PasswordFragment,
      },
      {
        name: 'orders',
        component: OrdersFragment,
      },
      {
        name: 'address',
        component: AddressFragment,
      },
      {
        name: 'payments',
        component: PaymentsFragment,
      },
      {
        name: 'subscriptions',
        component: SubscriptionsFragment,
      },
      {
        name: 'pause',
        component: PauseFragment,
      },
      {
        name: 'pause-done',
        component: PauseDoneFragment,
      },
    ],
  });

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10">
        <FragmentRouter controller={controller} />
      </main>
    </ThemeProvider>
  );
}
