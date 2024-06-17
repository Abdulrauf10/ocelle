'use client';

import React from 'react';

import { CheckoutLineFragment, MoneyFragment } from '@/gql/graphql';
import { CartReturn } from '@/types/dto';

interface CartContextProps {
  lines: CheckoutLineFragment[];
  subtotalPrice?: MoneyFragment;
  shippingPrice?: MoneyFragment;
  totalPrice?: MoneyFragment;
  setLines(lines: CheckoutLineFragment[]): void;
  setSubtotalPrice(subtotalPrice: MoneyFragment): void;
  setShippingPrice(shippingPrice: MoneyFragment): void;
  setTotalPrice(totalPrice: MoneyFragment): void;
  setCart(cart: CartReturn): void;
}

const CartContext = React.createContext<CartContextProps | undefined>(undefined);

export function CartContextProvider(
  props: React.PropsWithChildren<{
    lines: CheckoutLineFragment[];
    subtotalPrice?: MoneyFragment;
    shippingPrice?: MoneyFragment;
    totalPrice?: MoneyFragment;
  }>
) {
  const [lines, setLines] = React.useState<CheckoutLineFragment[]>(props.lines);
  const [subtotalPrice, setSubtotalPrice] = React.useState<MoneyFragment | undefined>(
    props.subtotalPrice
  );
  const [shippingPrice, setShippingPrice] = React.useState<MoneyFragment | undefined>(
    props.shippingPrice
  );
  const [totalPrice, setTotalPrice] = React.useState<MoneyFragment | undefined>(props.totalPrice);

  const setCart = React.useCallback((cart: CartReturn) => {
    const { lines, subtotalPrice, shippingPrice, totalPrice } = cart;
    setLines(lines);
    setSubtotalPrice(subtotalPrice);
    setShippingPrice(shippingPrice);
    setTotalPrice(totalPrice);
  }, []);

  const values = React.useMemo(() => {
    return {
      lines,
      setLines,
      subtotalPrice,
      setSubtotalPrice,
      shippingPrice,
      setShippingPrice,
      totalPrice,
      setTotalPrice,
      setCart,
    };
  }, [
    lines,
    subtotalPrice,
    shippingPrice,
    totalPrice,
    setLines,
    setSubtotalPrice,
    setShippingPrice,
    setTotalPrice,
    setCart,
  ]);

  return <CartContext.Provider value={values}>{props.children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart: context cannot be null');
  }

  return context;
}
