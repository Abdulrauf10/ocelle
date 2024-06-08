'use server';

import ejs from 'ejs';
import { convert } from 'html-to-text';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import invariant from 'ts-invariant';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Career } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

invariant(process.env.NODEMAILER_SERVICE, 'Missing NODEMAILER_SERVICE env variable');
invariant(process.env.SMTP_USER, 'Missing SMTP_USER env variable');
invariant(process.env.SMTP_PASS, 'Missing SMTP_PASS env variable');

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface ApplyCareerAction {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneValue: string;
  resume: File;
  coverLetter: File;
}

const schema = Joi.object<ApplyCareerAction>({
  id: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phoneCountryCode: Joi.string().required(),
  phoneValue: Joi.string().required(),
  resume: Joi.custom((value, helpers) =>
    value instanceof File ? value : helpers.message({ custom: 'must be a file' })
  ).required(),
  coverLetter: Joi.custom((value, helpers) =>
    value instanceof File ? value : helpers.message({ custom: 'must be a file' })
  ).optional(),
});

export async function applyCareerAction(formData: FormData) {
  invariant(process.env.CAREER_MAILTO, 'Missing CAREER_MAILTO env variable');

  const { value, error } = schema.validate({
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

  const attachments: Mail.Attachment[] = [
    {
      filename: 'Resume',
      content: Buffer.from(await value.resume.arrayBuffer()),
    },
  ];

  if (value.coverLetter.size > 0) {
    attachments.push({
      filename: 'Cover Letter',
      content: Buffer.from(await value.coverLetter.arrayBuffer()),
    });
  }

  const html = await ejs.renderFile(process.cwd() + '/templates/submission.ejs', {
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    phone: '+' + value.phoneCountryCode + ' ' + value.phoneValue,
    career: {
      name: data.name,
    },
  });

  // TODO: setup email api for sending the submission
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CAREER_MAILTO,
    subject: `Career Submission - ${data.name}`,
    text: convert(html),
    html,
    attachments,
  });

  return { ok: true, id: info.messageId };
}
