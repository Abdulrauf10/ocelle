'use client';

import { IndividualRecipePack } from '@/enums';
import { CheckoutLineFragment } from '@/gql/graphql';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import TrashBin from './icons/TrashBin';
import { individualPackProducts } from '@/products';
import { weightToGrams } from '@/helpers/saleor';
import NumberInput from './inputs/Number';

export default function CartRows({
  lines,
  disabled,
  onUpdateClick,
  onDeleteClick,
}: {
  lines: CheckoutLineFragment[];
  disabled?: boolean;
  onUpdateClick(lineId: string, quantity: number): Promise<void>;
  onDeleteClick(lineId: string): Promise<void>;
}) {
  const t = useTranslations();

  const contents = React.useMemo(() => {
    return {
      [individualPackProducts[IndividualRecipePack.Bundle].variant.sku]: {
        picture: '/recipes/individual/bundle.jpg',
      },
      [individualPackProducts[IndividualRecipePack.Chicken].variant.sku]: {
        picture: '/recipes/individual/chicken.jpg',
      },
      [individualPackProducts[IndividualRecipePack.Beef].variant.sku]: {
        picture: '/recipes/individual/beef.jpg',
      },
      [individualPackProducts[IndividualRecipePack.Lamb].variant.sku]: {
        picture: '/recipes/individual/lamb.jpg',
      },
      [individualPackProducts[IndividualRecipePack.Duck].variant.sku]: {
        picture: '/recipes/individual/duck.jpg',
      },
      [individualPackProducts[IndividualRecipePack.Pork].variant.sku]: {
        picture: '/recipes/individual/pork.jpg',
      },
    };
  }, []);

  return lines.map((line, idx) => {
    const content = line.variant.sku ? contents[line.variant.sku] : undefined;
    if (!content) {
      return <React.Fragment key={line.id}></React.Fragment>;
    }
    return (
      <React.Fragment key={line.id}>
        <div className="-mx-2 flex">
          <div className="px-2">
            <div className="relative h-24 w-24 overflow-hidden rounded-md">
              <Image src={content.picture} alt="" fill />
            </div>
          </div>
          <div className="w-full px-2">
            <div className="-mx-2 flex justify-between">
              <div className="px-2">
                <div className="font-bold">{line.variant.product.name}</div>
                <div className="mt-1">
                  {t('{}-g', { value: weightToGrams(line.variant.weight!) })}
                </div>
              </div>
              <div className="px-2">
                <button
                  type="button"
                  className="relative top-1"
                  onClick={() => onDeleteClick(line.id)}
                  disabled={disabled}
                >
                  <TrashBin className="w-4 text-primary" />
                </button>
              </div>
            </div>
            <div className="-mx-2 mt-2 flex items-center justify-between">
              <div className="px-2">
                <NumberInput
                  className={{ root: 'border-brown', input: 'body-3' }}
                  min={0}
                  value={line.quantity}
                  onChange={(value) => onUpdateClick(line.id, value)}
                />
              </div>
              <div className="px-2">${line.totalPrice.gross.amount.toFixed(2)}</div>
            </div>
          </div>
        </div>
        {idx !== lines.length - 1 && <hr className="my-4 border-[#231815]" />}
      </React.Fragment>
    );
  });
}
