'use server';

import { getLoginedMe } from '@/actions';
import { User } from '@/entities';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { executeQuery } from '@/helpers/queryRunner';
import { attachPaymentMethod, detachPaymentMethod, retrievePaymentMethod } from '@/services/stripe';
import Joi from 'joi';

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

  const paymentMethod = await retrievePaymentMethod(value.paymentMethodId);

  // TODO: 3D secure handler while updating card, default cannot handle auto payment

  await attachPaymentMethod(paymentMethod.id, me.stripe);

  await executeQuery(async (queryRunner) => {
    await queryRunner.manager.update(User, me.id, { stripePaymentMethod: paymentMethod.id });
  });

  try {
    // slient mode
    await detachPaymentMethod(me.stripePaymentMethod);
  } catch (e) {
    console.error(e);
  }
}
