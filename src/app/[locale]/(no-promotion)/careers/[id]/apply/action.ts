'use server';

import { Career, CareerSubmission } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import Joi from 'joi';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

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

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Career, {
      where: {
        id: parseInt(value.id),
        applyDate: LessThanOrEqual(new Date()),
        endDate: MoreThanOrEqual(new Date()),
        isDisabled: false,
      },
      relations: { lines: true },
    });

    if (!data) {
      throw new Error('career not found');
    }

    const entity = queryRunner.manager.create(CareerSubmission, {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      resume: Buffer.from(await value.resume.arrayBuffer()),
      coverLetter:
        value.coverLetter.size > 0 ? Buffer.from(await value.coverLetter.arrayBuffer()) : undefined,
      career: data,
    });

    await queryRunner.manager.save(entity);
  });

  return { ok: true };
}
