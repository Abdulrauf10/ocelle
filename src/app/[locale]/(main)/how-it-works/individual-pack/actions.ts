'use server';

import invariant from 'ts-invariant';

import { getCartCookie, setCartCookie } from '@/actions';
import {
  FREE_SHIPPING_MIN_TOTAL_AMOUNT,
  SHIPPING_METHOD_SF_EXPRESS_FIXED,
  SHIPPING_METHOD_SF_EXPRESS_MIN_FREE,
} from '@/consts';
import { IndividualRecipePack } from '@/enums';
import { CheckoutNotFoundError } from '@/errors/checkout';
import { individualPackProducts, individualPackProductsValues } from '@/products';
import checkoutService from '@/services/checkout';
import productService from '@/services/product';
import { CartReturn } from '@/types/dto';

export async function getProducts() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const products = await productService.find({
    channel: process.env.SALEOR_CHANNEL_SLUG,
    where: {
      slug: {
        oneOf: individualPackProductsValues.map((product) => product.slug),
      },
    },
  });

  return {
    [IndividualRecipePack.Bundle]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Bundle].slug
    )!,
    [IndividualRecipePack.Chicken]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Chicken].slug
    )!,
    [IndividualRecipePack.Beef]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Beef].slug
    )!,
    [IndividualRecipePack.Duck]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Duck].slug
    )!,
    [IndividualRecipePack.Lamb]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Lamb].slug
    )!,
    [IndividualRecipePack.Pork]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Pork].slug
    )!,
  };
}

export async function getOrCreateCheckout() {
  const cartOrCheckoutId = await getCartCookie();

  if (cartOrCheckoutId) {
    try {
      const checkout = await checkoutService.getById(cartOrCheckoutId);
      if (checkout) {
        return checkout;
      }
    } catch (e) {
      if (e instanceof CheckoutNotFoundError) {
        // skip
      } else {
        throw e;
      }
    }
  }

  const checkout = await checkoutService.create();

  setCartCookie(checkout.id);

  return checkout;
}

export async function addToCart(pack: IndividualRecipePack, quantity: number): Promise<CartReturn> {
  const cart = await getOrCreateCheckout();

  const { totalPrice } = await checkoutService.appendLine(
    cart.id,
    individualPackProducts[pack].slug,
    quantity
  );

  const checkout = await checkoutService.assignShippingMethod(
    cart.id,
    totalPrice.gross.amount >= FREE_SHIPPING_MIN_TOTAL_AMOUNT
      ? SHIPPING_METHOD_SF_EXPRESS_MIN_FREE
      : SHIPPING_METHOD_SF_EXPRESS_FIXED
  );

  return {
    lines: checkout.lines,
    discountPrice: checkout.discount ?? undefined,
    subtotalPrice: checkout.subtotalPrice.gross,
    shippingPrice: checkout.shippingPrice.gross,
    totalPrice: checkout.totalPrice.gross,
  };
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartReturn> {
  const cartId = await getCartCookie();

  invariant(cartId, 'cart not found in the cookie');

  const { totalPrice } = await checkoutService.updateLine(cartId, lineId, quantity);

  const checkout = await checkoutService.assignShippingMethod(
    cartId,
    totalPrice.gross.amount >= FREE_SHIPPING_MIN_TOTAL_AMOUNT
      ? SHIPPING_METHOD_SF_EXPRESS_MIN_FREE
      : SHIPPING_METHOD_SF_EXPRESS_FIXED
  );

  return {
    lines: checkout.lines,
    discountPrice: checkout.discount ?? undefined,
    subtotalPrice: checkout.subtotalPrice.gross,
    shippingPrice: checkout.shippingPrice.gross,
    totalPrice: checkout.totalPrice.gross,
  };
}

export async function deleteCartLine(lineId: string): Promise<CartReturn> {
  const cartId = await getCartCookie();

  invariant(cartId, 'cart not found in the cookie');

  const { totalPrice } = await checkoutService.deleteLine(cartId, lineId);

  const checkout = await checkoutService.assignShippingMethod(
    cartId,
    totalPrice.gross.amount >= FREE_SHIPPING_MIN_TOTAL_AMOUNT
      ? SHIPPING_METHOD_SF_EXPRESS_MIN_FREE
      : SHIPPING_METHOD_SF_EXPRESS_FIXED
  );

  return {
    lines: checkout.lines,
    discountPrice: checkout.discount ?? undefined,
    subtotalPrice: checkout.subtotalPrice.gross,
    shippingPrice: checkout.shippingPrice.gross,
    totalPrice: checkout.totalPrice.gross,
  };
}
