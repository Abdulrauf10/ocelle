'use client';

import { CheckoutLineFragment, MoneyFragment } from '@/gql/graphql';
import React from 'react';

interface CartContextProps {
  lines: CheckoutLineFragment[];
  totalPrice?: MoneyFragment;
  setLines(lines: CheckoutLineFragment[]): void;
  setTotalPrice(totalPrice: MoneyFragment): void;
}

const CartContext = React.createContext<CartContextProps | undefined>(undefined);

export function CartContextProvider(
  props: React.PropsWithChildren<{
    lines: CheckoutLineFragment[];
    totalPrice?: MoneyFragment;
  }>
) {
  const [lines, setLines] = React.useState<CheckoutLineFragment[]>(props.lines);
  const [totalPrice, setTotalPrice] = React.useState<MoneyFragment | undefined>(props.totalPrice);

  const values = React.useMemo(() => {
    return {
      lines,
      setLines,
      totalPrice,
      setTotalPrice,
    };
  }, [lines, totalPrice, setLines, setTotalPrice]);

  return <CartContext.Provider value={values}>{props.children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart: context cannot be null');
  }

  return context;
}
