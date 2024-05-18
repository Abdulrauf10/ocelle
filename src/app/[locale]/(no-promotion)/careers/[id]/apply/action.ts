'use server';

import Joi from 'joi';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Career } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

interface ApplyCareerAction {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File;
  coverLetter: File;
}

const schema = Joi.object<ApplyCareerAction>({
  id: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  resume: Joi.custom((value, helpers) =>
    value instanceof File ? value : helpers.message({ custom: 'must be a file' })
  ).required(),
  coverLetter: Joi.custom((value, helpers) =>
    value instanceof File ? value : helpers.message({ custom: 'must be a file' })
  ).optional(),
});

export async function applyCareerAction(formData: FormData) {
  const { value, error } = schema.validate({
    id: formData.get('id'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    resume: formData.get('resume'),
    coverLetter: formData.get('coverLetter'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const data = await executeQuery(async (queryRunner) => {
    return await queryRunner.manager.findOne(Career, {
      where: {
        id: parseInt(value.id),
        applyDate: LessThanOrEqual(new Date()),
        endDate: MoreThanOrEqual(new Date()),
        isDisabled: false,
      },
      relations: { lines: true },
    });
  });

  if (!data) {
    throw new Error('career not found');
  }

  // TODO: setup email api for sending the submission

  return { ok: true };
}
