import Joi from 'joi';

import { UpdateCheckoutDataAction } from './types';

const addressSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  streetAddress1: Joi.string().required(),
  streetAddress2: Joi.string().required().allow(''),
  district: Joi.string().required(),
  region: Joi.string().required(),
  country: Joi.string().required(),
});

const updateCheckoutDataActionSchema = Joi.object<UpdateCheckoutDataAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).required(),
  whatsapp: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).optional(),
  receiveNews: Joi.boolean().optional(),
  isSameBillingAddress: Joi.boolean().optional(),
  deliveryDate: Joi.date().required(),
  deliveryAddress: addressSchema.required(),
  billingAddress: addressSchema,
});

export { updateCheckoutDataActionSchema };
