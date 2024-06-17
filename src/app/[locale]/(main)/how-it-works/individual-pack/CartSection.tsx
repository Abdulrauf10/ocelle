'use client';

import React from 'react';

import { deleteCartLine, updateCartLine } from './actions';

import CartRows from '@/components/CartRows';
import Container from '@/components/Container';
import CartDialog from '@/components/dialogs/Cart';
import Cart from '@/components/icons/Cart';
import { useCart } from '@/contexts/cart';
import { useRouter } from '@/navigation';

export default function CartSection() {
  const router = useRouter();
  const { lines, totalPrice, setLines, setTotalPrice } = useCart();
  const [querying, setQuerying] = React.useState(false);

  const handleCartItemUpdate = React.useCallback(
    async (lineId: string, quantity: number) => {
      try {
        setQuerying(true);
        const { lines, totalPrice } = await updateCartLine(lineId, quantity);
        setLines(lines);
        setTotalPrice(totalPrice);
      } finally {
        setQuerying(false);
      }
    },
    [setLines, setTotalPrice]
  );

  const handleCartItemDelete = React.useCallback(
    async (lineId: string) => {
      try {
        setQuerying(true);
        const { lines, totalPrice } = await deleteCartLine(lineId);
        setLines(lines);
        setTotalPrice(totalPrice);
      } finally {
        setQuerying(false);
      }
    },
    [setLines, setTotalPrice]
  );

  if (lines.length === 0) {
    return undefined;
  }

  return (
    <CartDialog
      lines={
        <CartRows
          lines={lines}
          onUpdateClick={handleCartItemUpdate}
          onDeleteClick={handleCartItemDelete}
          disabled={querying}
        />
      }
      subtotal={totalPrice?.amount ?? 0}
      onCheckoutClick={() => router.push('/checkout')}
      disabled={querying}
    >
      <div className="fixed left-0 top-40 w-full max-lg:top-[340px]">
        <Container className="text-right">
          <button type="button">
            <Cart
              className="w-16"
              count={lines.reduce((count, line) => line.quantity + count, 0)}
            />
          </button>
        </Container>
      </div>
    </CartDialog>
  );
}
