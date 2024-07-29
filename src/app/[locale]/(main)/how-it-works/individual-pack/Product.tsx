'use client';

import clsx from 'clsx';
import edjsHTML from 'editorjs-html';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { toast } from 'react-toastify';
import xss from 'xss';

import { addToCart, updateCartLine } from './actions';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import RecipeMediumDialog from '@/components/dialogs/RecipeMedium';
import NumberInput from '@/components/inputs/Number';
import Block from '@/components/layouts/Block';
import { useCart } from '@/contexts/cart';
import { IndividualRecipePack } from '@/enums';
import { ProductFragment } from '@/gql/graphql';
import { weightToGrams } from '@/helpers/saleor';
import { individualPackProducts } from '@/products';

const parser = edjsHTML();

export default function Product({
  picture,
  dialogPicture,
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
  dialogPicture?: string;
  reverse?: boolean;
  theme?: 'primary' | 'secondary' | 'red' | 'yellow' | 'green' | 'dark-green';
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
  const locale = useLocale();
  const t = useTranslations();
  const b = useTranslations('Button');
  const { lines, setCart } = useCart();
  const currentLine = React.useMemo(() => {
    return lines.find((line) => line.variant.product.slug === individualPackProducts[pack].slug);
  }, [lines, pack]);
  const name = React.useMemo(() => {
    if (locale === 'zh') {
      return product.translation?.name ?? product.name;
    } else {
      return product.name;
    }
  }, [locale, product]);
  const description = React.useMemo(() => {
    if (locale === 'zh') {
      return parser.parse(
        JSON.parse(product.translation?.description ?? product.description ?? '')
      );
    } else {
      return parser.parse(JSON.parse(product.description ?? ''));
    }
  }, [locale, product]);

  const handleQuantityChange = React.useCallback(
    async (quantity: number) => {
      if (!currentLine) {
        return;
      }
      const cart = await updateCartLine(currentLine.id, quantity);
      setCart(cart);
    },
    [currentLine, setCart]
  );

  const handleButtonClick = React.useCallback(async () => {
    const cart = await addToCart(pack, 1);
    setCart(cart);
    toast('item added to the cart.');
  }, [pack, setCart]);

  const getPrice = (product: ProductFragment) => {
    return product.variants![0].channelListings![0].price!.amount;
  };

  const getWeight = (product: ProductFragment) => {
    return weightToGrams(product.variants![0].weight!);
  };

  if (pack !== IndividualRecipePack.Bundle && !dialogPicture) {
    throw new Error('dialogPicture props is required');
  }

  return (
    <Block className={className.root}>
      <Container className="max-w-screen-lg">
        <div
          className={clsx(
            '-mx-6 -my-4 flex max-md:flex-col max-md:items-center max-md:text-center',
            reverse && 'flex-row-reverse'
          )}
        >
          <div className="w-[450px] min-w-[450px] px-6 py-4 max-lg:w-[420px] max-lg:min-w-[420px] max-xs:w-full max-xs:min-w-0">
            <div className="relative pt-[100%]">
              <Image
                src={picture}
                alt={name}
                fill
                className="rounded-[40px] shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              />
            </div>
          </div>
          <div className="w-full px-6 py-4">
            <h2 className={clsx('heading-2 font-bold', className.title)}>
              {name} ({t('{}-g', { value: getWeight(product) })})
            </h2>
            <div className="pt-4"></div>
            <p className={clsx('text-[30px]', className.title)}>${getPrice(product)}</p>
            <div className="pt-4"></div>
            <div className={clsx('-my-3', className.content)}>
              {description.map((content, idx) => (
                <div key={idx} className="block py-3">
                  <div className="body-1" dangerouslySetInnerHTML={{ __html: xss(content) }} />
                </div>
              ))}
            </div>
            {pack !== IndividualRecipePack.Bundle && (
              <div className="pt-6">
                <RecipeMediumDialog
                  name={name}
                  description={description.map((content, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: xss(content) }} />
                  ))}
                  picture={
                    <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                      <Image src={dialogPicture!} alt={name} fill />
                    </div>
                  }
                  ingredients={ingredients}
                  targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                  calorie={calorie}
                  analysis={analysis}
                >
                  <Button theme={theme} reverse>
                    {b('see-details')}
                  </Button>
                </RecipeMediumDialog>
              </div>
            )}
            {currentLine ? (
              <div className="pt-6">
                <span className={clsx('body-1 body-weight-1 mr-3 inline-block', className.content)}>
                  {t('{}-colon', { value: t('quantity') })}
                </span>
                <NumberInput
                  className={{
                    root: 'w-20 border-brown',
                    input: 'body-1 body-inline w-[78px] px-4 py-1',
                    icon: 'w-2.5',
                  }}
                  min={0}
                  max={99}
                  value={currentLine.quantity}
                  onChange={handleQuantityChange}
                  buttonDelayMs={1000}
                />
              </div>
            ) : (
              <div className="pt-6">
                <Button type="button" theme={theme} onClick={handleButtonClick}>
                  {b('add-to-cart')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Block>
  );
}
