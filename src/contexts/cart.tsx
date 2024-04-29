'use client';

import React from 'react';

import { CheckoutLineFragment, MoneyFragment } from '@/gql/graphql';

interface CartContextProps {
  lines: CheckoutLineFragment[];
  shippingPrice?: MoneyFragment;
  totalPrice?: MoneyFragment;
  setLines(lines: CheckoutLineFragment[]): void;
  setShippingPrice(shippingPrice: MoneyFragment): void;
  setTotalPrice(totalPrice: MoneyFragment): void;
}

const CartContext = React.createContext<CartContextProps | undefined>(undefined);

export function CartContextProvider(
  props: React.PropsWithChildren<{
    lines: CheckoutLineFragment[];
    shippingPrice?: MoneyFragment;
    totalPrice?: MoneyFragment;
  }>
) {
  const [lines, setLines] = React.useState<CheckoutLineFragment[]>(props.lines);
  const [shippingPrice, setShippingPrice] = React.useState<MoneyFragment | undefined>(
    props.shippingPrice
  );
  const [totalPrice, setTotalPrice] = React.useState<MoneyFragment | undefined>(props.totalPrice);

  const values = React.useMemo(() => {
    return {
      lines,
      setLines,
      shippingPrice,
      setShippingPrice,
      totalPrice,
      setTotalPrice,
    };
  }, [lines, shippingPrice, totalPrice, setLines, setShippingPrice, setTotalPrice]);

  return <CartContext.Provider value={values}>{props.children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart: context cannot be null');
  }

  return context;
}
