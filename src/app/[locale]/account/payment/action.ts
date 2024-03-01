'use server';

import { getStoreMe } from '@/storeUserProvider';
import Joi from 'joi';

interface UpdateCreditCardAction {
  cardName: string;
  cardNo: string;
  cardExp: string;
  cardCvc: string;
}

const schema = Joi.object<UpdateCreditCardAction>({
  cardName: Joi.string().required(),
  cardNo: Joi.string().required(),
  cardExp: Joi.string().required(),
  cardCvc: Joi.string().required(),
});

export default async function updateCreditCardAction(formData: FormData) {
  const { value, error } = schema.validate({
    cardName: formData.get('cardName'),
    cardNo: formData.get('cardNo'),
    cardExp: formData.get('cardExp'),
    cardCvc: formData.get('cardCvc'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  // TODO: update credit card
}
