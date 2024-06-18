'use server';

import Joi from 'joi';

import { getLoginedMeFullSize } from '@/actions';
import { User } from '@/entities';
import { UpdateSelfAddressDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';

interface ChangeShippingAddressAction {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
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

  const { id, defaultShippingAddress } = await getLoginedMeFullSize();

  const { accountAddressUpdate } = await executeGraphQL(UpdateSelfAddressDocument, {
    variables: {
      id: defaultShippingAddress!.id,
      firstName: value.firstName,
      lastName: value.lastName,
      streetAddress1: value.streetAddress1,
      streetAddress2: value.streetAddress2,
      city: value.district,
      countryArea: value.region,
    },
  });

  if (!accountAddressUpdate || accountAddressUpdate.errors.length > 0) {
    console.error(accountAddressUpdate?.errors);
    throw new Error('change shipping address failed');
  }

  await executeQuery(async (queryRunner) => {
    const user = await queryRunner.manager.findOne(User, { where: { id } });
    user!.isDeliveryUsAsBillingAddress = value.isSameAsBillingAddress;
    await queryRunner.manager.save(user);
  });

  if (value.isSameAsBillingAddress) {
    await changeBillingAddressAction(value);
  }
}

interface ChangeBillingAddressAction {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
}

const changeBillingAddressActionSchema = Joi.object<ChangeBillingAddressAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  streetAddress1: Joi.string().required(),
  streetAddress2: Joi.string().required().allow(''),
  district: Joi.string().required(),
  region: Joi.string().required(),
  country: Joi.string().required(),
});

export async function changeBillingAddressAction(data: ChangeBillingAddressAction) {
  const { value, error } = changeBillingAddressActionSchema.validate(data, { allowUnknown: true });

  if (error) {
    throw new Error('schema is not valid');
  }

  const { defaultBillingAddress } = await getLoginedMeFullSize();

  const { accountAddressUpdate } = await executeGraphQL(UpdateSelfAddressDocument, {
    variables: {
      id: defaultBillingAddress!.id,
      firstName: value.firstName,
      lastName: value.lastName,
      streetAddress1: value.streetAddress1,
      streetAddress2: value.streetAddress2,
      city: value.district,
      countryArea: value.region,
    },
  });

  if (!accountAddressUpdate || accountAddressUpdate.errors.length > 0) {
    console.error(accountAddressUpdate?.errors);
    throw new Error('change billing address failed');
  }
}
