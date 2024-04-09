'use client';

import CartDialog from '@/components/dialogs/Cart';
import Cart from '@/components/icons/Cart';
import CartRows from '@/components/CartRows';
import React from 'react';
import { deleteCartLine, updateCartLine } from './actions';
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
      <button type="button" className="fixed bottom-8 right-8">
        <Cart className="w-16" count={lines.length} />
      </button>
    </CartDialog>
  );
}
