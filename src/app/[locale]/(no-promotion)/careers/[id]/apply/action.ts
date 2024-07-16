'use server';

import invariant from 'ts-invariant';

import { applyCareerActionSchema } from './validators';

import careerService from '@/services/career';

export async function applyCareerAction(formData: FormData) {
  invariant(process.env.CAREER_MAILTO, 'Missing CAREER_MAILTO env variable');

  const { value, error } = applyCareerActionSchema.validate({
    id: formData.get('id'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phoneCountryCode: formData.get('phoneCountryCode'),
    phoneValue: formData.get('phoneValue'),
    resume: formData.get('resume'),
    coverLetter: formData.get('coverLetter'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const { info } = await careerService.sendToOcelle(
    parseInt(value.id),
    value.firstName,
    value.lastName,
    value.email,
    { countryCode: value.phoneCountryCode, value: value.phoneValue },
    value.resume,
    value.coverLetter
  );

  return { ok: true, id: info.messageId };
}
