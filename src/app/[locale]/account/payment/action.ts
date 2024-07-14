'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import stripeClient from '@/clients/stripe';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import userService from '@/services/user';

interface UpdateCreditCardAction {
  paymentMethodId: string;
}

const schema = Joi.object<UpdateCreditCardAction>({
  paymentMethodId: Joi.string().required(),
});

export default async function updateCreditCardAction(data: UpdateCreditCardAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  if (!me.stripe || !me.stripePaymentMethod) {
    throw new StripeNotReadyError(me.id);
  }

  const paymentMethod = await stripeClient.retrievePaymentMethod(value.paymentMethodId);

  // TODO: 3D secure handler while updating card, default cannot handle auto payment

  await stripeClient.attachPaymentMethod(paymentMethod.id, me.stripe);
  await userService.attachStripePaymentMethod(me.id, paymentMethod.id);

  try {
    // slient mode
    await stripeClient.detachPaymentMethod(me.stripePaymentMethod);
  } catch (e) {
    console.error(e);
  }
}
