'use client';

import React from 'react';

import { deleteCartLine, updateCartLine } from './actions';

import CartRows from '@/components/CartRows';
import CartDialog from '@/components/dialogs/Cart';
import Cart from '@/components/icons/Cart';
import { useCart } from '@/contexts/cart';
import { useRouter } from '@/navigation';

export default function CartSection() {
  const router = useRouter();
  const { lines, totalPrice, setLines, setTotalPrice } = useCart();
  const [pending, startTransition] = React.useTransition();

  const handleCartItemUpdate = React.useCallback(
    async (lineId: string, quantity: number) => {
      startTransition(async () => {
        const { lines, totalPrice } = await updateCartLine(lineId, quantity);
        setLines(lines);
        setTotalPrice(totalPrice);
      });
    },
    [setLines, setTotalPrice]
  );

  const handleCartItemDelete = React.useCallback(
    async (lineId: string) => {
      startTransition(async () => {
        const { lines, totalPrice } = await deleteCartLine(lineId);
        setLines(lines);
        setTotalPrice(totalPrice);
      });
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
          disabled={pending}
        />
      }
      subtotal={totalPrice?.amount ?? 0}
      onCheckoutClick={() => router.push('/checkout')}
      disabled={pending}
    >
      <button type="button" className="fixed right-8 top-36">
        <Cart className="w-16" count={lines.reduce((count, line) => line.quantity + count, 0)} />
      </button>
    </CartDialog>
  );
}
