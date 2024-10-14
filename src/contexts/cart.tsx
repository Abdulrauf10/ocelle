'use client';

import React from 'react';

import { CheckoutLineFragment, MoneyFragment } from '@/gql/graphql';
import { CartReturn } from '@/types/dto';

interface CartContextProps {
  lines: CheckoutLineFragment[];
  discountPrice?: MoneyFragment;
  subtotalPrice?: MoneyFragment;
  shippingPrice?: MoneyFragment;
  totalPrice?: MoneyFragment;
  setLines(lines: CheckoutLineFragment[]): void;
  setDiscountPrice(discountPrice: MoneyFragment): void;
  setSubtotalPrice(subtotalPrice: MoneyFragment): void;
  setShippingPrice(shippingPrice: MoneyFragment): void;
  setTotalPrice(totalPrice: MoneyFragment): void;
  setCart(cart: CartReturn): void;
  clear(): void;
}

const CartContext = React.createContext<CartContextProps | undefined>(undefined);

export function CartContextProvider(
  props: React.PropsWithChildren<{
    lines: CheckoutLineFragment[];
    discountPrice?: MoneyFragment;
    subtotalPrice?: MoneyFragment;
    shippingPrice?: MoneyFragment;
    totalPrice?: MoneyFragment;
  }>
) {
  const [lines, setLines] = React.useState<CheckoutLineFragment[]>(props.lines);
  const [discountPrice, setDiscountPrice] = React.useState<MoneyFragment | undefined>(
    props.discountPrice
  );
  const [subtotalPrice, setSubtotalPrice] = React.useState<MoneyFragment | undefined>(
    props.subtotalPrice
  );
  const [shippingPrice, setShippingPrice] = React.useState<MoneyFragment | undefined>(
    props.shippingPrice
  );
  const [totalPrice, setTotalPrice] = React.useState<MoneyFragment | undefined>(props.totalPrice);

  const setCart = React.useCallback((cart: CartReturn) => {
    const { lines, discountPrice, subtotalPrice, shippingPrice, totalPrice } = cart;
    setLines(lines);
    setDiscountPrice(discountPrice);
    setSubtotalPrice(subtotalPrice);
    setShippingPrice(shippingPrice);
    setTotalPrice(totalPrice);
  }, []);

  const clear = React.useCallback(() => {
    setLines([]);
    setDiscountPrice(undefined);
    setSubtotalPrice(undefined);
    setShippingPrice(undefined);
    setTotalPrice(undefined);
  }, []);

  const values = React.useMemo(() => {
    return {
      lines,
      setLines,
      discountPrice,
      setDiscountPrice,
      subtotalPrice,
      setSubtotalPrice,
      shippingPrice,
      setShippingPrice,
      totalPrice,
      setTotalPrice,
      setCart,
      clear,
    };
  }, [
    lines,
    discountPrice,
    subtotalPrice,
    shippingPrice,
    totalPrice,
    setLines,
    setDiscountPrice,
    setSubtotalPrice,
    setShippingPrice,
    setTotalPrice,
    setCart,
    clear,
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
