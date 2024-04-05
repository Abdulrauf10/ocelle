'use client';

import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import Block from '@/components/layouts/Block';
import { IndividualRecipePack } from '@/enums';
import { colon } from '@/helpers/translation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { addToCart } from './actions';
import { useCart } from '@/contexts/cart';
import edjsHTML from 'editorjs-html';
import { ProductFragment } from '@/gql/graphql';
import RecipeMediumDialog from '@/components/dialogs/RecipeMedium';
import { weightToGrams } from '@/helpers/saleor';
import xss from 'xss';

const parser = edjsHTML();

export default function Product({
  picture,
  reverse,
  className,
  theme,
  pack,
  product,
  ingredients,
  targetedNutrientBlendIngredients,
  calorie,
  analysis,
}: {
  picture: string;
  reverse?: boolean;
  theme?: 'primary' | 'secondary' | 'red' | 'yellow' | 'green';
  className: {
    root?: string;
    title?: string;
    content?: string;
  };
  pack: IndividualRecipePack;
  product: ProductFragment;
  ingredients: string[];
  targetedNutrientBlendIngredients: string[];
  calorie: number;
  analysis: {
    protein: number;
    fat: number;
    fibre: number;
    moisture: number;
  };
}) {
  const t = useTranslations();
  const { setLines, setTotalPrice } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  const handleButtonClick = React.useCallback(async () => {
    const { lines, totalPrice } = await addToCart(pack, quantity);
    setLines(lines);
    setTotalPrice(totalPrice);
  }, [pack, quantity, setLines, setTotalPrice]);

  const getPrice = (product: ProductFragment) => {
    return product.variants![0].pricing!.price!.gross.amount;
  };

  const getWeight = (product: ProductFragment) => {
    return weightToGrams(product.variants![0].weight!);
  };

  const description = parser.parse(JSON.parse(product.description ?? ''));

  return (
    <Block className={className.root}>
      <Container className="max-w-screen-lg overflow-hidden">
        <div
          className={clsx(
            '-mx-6 -my-4 flex max-md:flex-col max-md:items-center max-md:text-center',
            reverse && 'flex-row-reverse'
          )}
        >
          <div className="w-[480px] min-w-[480px] px-6 py-4 max-lg:w-[420px] max-lg:min-w-[420px] max-xs:w-full max-xs:min-w-0">
            <div className="relative pt-[100%]">
              <Image
                src={picture}
                alt={product.name}
                fill
                className="rounded-[40px] shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              />
            </div>
          </div>
          <div className="w-full px-6 py-4">
            <h2 className={clsx('heading-2 font-bold', className.title)}>
              {product.name} – {t('{}-g', { value: getWeight(product) })}
            </h2>
            <p className={clsx('mt-4 text-[30px]', className.title)}>${getPrice(product)}</p>
            <div className={clsx('body-1 mt-4', className.content)}>
              {description.map((content, idx) => (
                <span
                  key={idx}
                  className="my-4 block"
                  dangerouslySetInnerHTML={{ __html: xss(content) }}
                />
              ))}
            </div>
            {pack !== IndividualRecipePack.Bundle && (
              <div className="mt-6">
                <RecipeMediumDialog
                  name={product.name}
                  description={description.map((content, idx) => (
                    <span key={idx} dangerouslySetInnerHTML={{ __html: xss(content) }} />
                  ))}
                  picture="/meal-plan/chicken-recipe.jpg"
                  ingredients={ingredients}
                  targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                  calorie={calorie}
                  analysis={analysis}
                >
                  <Button theme={theme} reverse>
                    {t('see-details')}
                  </Button>
                </RecipeMediumDialog>
              </div>
            )}
            <label className="mt-6 block">
              <span className={clsx('body-1 mr-3 inline-block font-bold', className.content)}>
                {colon(t, 'quantity')}
              </span>
              <input
                type="number"
                name="quantity"
                className="w-20 rounded-lg border border-brown px-3 py-2 text-center"
                value={quantity}
                step={1}
                min={1}
                onChange={({ target }) => setQuantity(parseInt(target.value))}
              />
            </label>
            <div className="mt-6">
              <Button type="button" theme={theme} onClick={handleButtonClick}>
                {t('add-to-cart')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Block>
  );
}
