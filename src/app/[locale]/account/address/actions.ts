'use server';

import Joi from 'joi';

import { CountryCode } from '@/gql/graphql';
import userService from '@/services/user';

interface ChangeShippingAddressAction {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: CountryCode;
  isSameAsBillingAddress: boolean;
}

const changeShippingAddressActionSchema = Joi.object<ChangeShippingAddressAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  streetAddress1: Joi.string().required(),
  streetAddress2: Joi.string().required().allow(''),
  district: Joi.string().required(),
  region: Joi.string().required(),
  country: Joi.string().required(),
  isSameAsBillingAddress: Joi.boolean().required(),
});

export async function changeShippingAddressAction(data: ChangeShippingAddressAction) {
  const { value, error } = changeShippingAddressActionSchema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  await userService.updateSelfDeliveryAddress(
    {
      firstName: value.firstName,
      lastName: value.lastName,
      streetAddress1: value.streetAddress1,
      streetAddress2: value.streetAddress2,
      district: value.district,
      region: value.region,
      country: CountryCode.Hk,
    },
    value.isSameAsBillingAddress
  );
}

interface ChangeBillingAddressAction {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: CountryCode;
  postalCode?: string;
}

const changeBillingAddressActionSchema = Joi.object<ChangeBillingAddressAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  streetAddress1: Joi.string().required(),
  streetAddress2: Joi.string().required().allow(''),
  district: Joi.string().required(),
  region: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().optional(),
});

export async function changeBillingAddressAction(data: ChangeBillingAddressAction) {
  const { value, error } = changeBillingAddressActionSchema.validate(data, { allowUnknown: true });

  if (error) {
    throw new Error('schema is not valid');
  }

  await userService.updateSelfBillingAddress(value);
}
