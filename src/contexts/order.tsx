'use client';

import React from 'react';

import { OrderFragment } from '@/gql/graphql';

interface OrderContextProps {
  order: OrderFragment;
  setOrder(order: OrderFragment): void;
}

const OrderContext = React.createContext<OrderContextProps | undefined>(undefined);

export function OrderProvider({
  initOrder,
  children,
}: React.PropsWithChildren<{
  initOrder: OrderFragment;
}>) {
  const [order, setOrder] = React.useState<OrderFragment>(initOrder);
  const values = React.useMemo(() => ({ order, setOrder }), [order, setOrder]);

  return <OrderContext.Provider value={values}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = React.useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within a OrderProvider');
  }
  return context;
}
