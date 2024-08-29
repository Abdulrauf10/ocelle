import Joi from 'joi';

import { ApplyCareerAction } from './types';

const applyCareerActionSchema = Joi.object<ApplyCareerAction>({
  id: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().lowercase().required(),
  phoneCountryCode: Joi.string().required(),
  phoneValue: Joi.string().required(),
  resume: Joi.custom((value, helpers) =>
    value instanceof File ? value : helpers.message({ custom: 'must be a file' })
  ).required(),
  coverLetter: Joi.custom((value, helpers) =>
    value instanceof File ? value : helpers.message({ custom: 'must be a file' })
  ).optional(),
});

export { applyCareerActionSchema };
