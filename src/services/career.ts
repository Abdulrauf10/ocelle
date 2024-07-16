import ejs from 'ejs';
import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import invariant from 'ts-invariant';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Career } from '@/entities';
import { CareerNotFoundError } from '@/errors/career';
import { executeQuery } from '@/helpers/queryRunner';

invariant(process.env.SMTP_HOST, 'Missing SMTP_HOST env variable');
invariant(process.env.SMTP_USER, 'Missing SMTP_USER env variable');
invariant(process.env.SMTP_PASS, 'Missing SMTP_PASS env variable');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

class CareerService {
  async list() {
    return executeQuery(async (queryRunner) => {
      return await queryRunner.manager.find(Career, {
        where: {
          applyDate: LessThanOrEqual(new Date()),
          endDate: MoreThanOrEqual(new Date()),
          isDisabled: false,
        },
        relations: { lines: true },
      });
    });
  }
  async get(id: number) {
    return executeQuery(async (queryRunner) => {
      return await queryRunner.manager.findOne(Career, {
        where: {
          id,
          applyDate: LessThanOrEqual(new Date()),
          endDate: MoreThanOrEqual(new Date()),
          isDisabled: false,
        },
        relations: { lines: true },
      });
    });
  }

  async sendToOcelle(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: { countryCode: string; value: string },
    resume: File,
    coverLetter?: File
  ) {
    const career = await this.get(id);

    if (!career) {
      throw new CareerNotFoundError();
    }

    const attachments: Mail.Attachment[] = [
      {
        filename: 'Resume',
        content: Buffer.from(await resume.arrayBuffer()),
      },
    ];

    if (coverLetter && coverLetter.size > 0) {
      attachments.push({
        filename: 'Cover Letter',
        content: Buffer.from(await coverLetter.arrayBuffer()),
      });
    }

    const html = await ejs.renderFile(process.cwd() + '/templates/submission.ejs', {
      firstName,
      lastName,
      email,
      phone: '+' + phone.countryCode + ' ' + phone.value,
      career: {
        name: career.name,
      },
    });

    // TODO: setup email api for sending the submission
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CAREER_MAILTO,
      subject: `Career Submission - ${career.name}`,
      text: convert(html),
      html,
      attachments,
    });

    return { info };
  }
}

const careerService = new CareerService();

export default careerService;
