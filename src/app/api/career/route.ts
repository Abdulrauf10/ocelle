import AppDataSource from '@/AppDataSource';
import { NextRequest, NextResponse } from 'next/server';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Career, CareerSubmission } from '@/entities';

export const dynamic = 'force-dynamic'; // defaults to auto

function assertString(formData: FormData, field: string) {
  if (!formData.get(field) || typeof formData.get(field) !== 'string') {
    return `\`${field}\` is not a string`;
  }
}

function assertFile(formData: FormData, field: string, nullable: boolean = false) {
  if (nullable && !formData.get(field)) {
    return;
  }
  if (!formData.get(field) || !(formData.get(field) instanceof File)) {
    return `\`${field}\` is not a file`;
  }
}

export async function POST(request: NextRequest) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const body = await request.formData();

  console.log(body);

  const validate = [
    assertString(body, 'id'),
    assertString(body, 'firstName'),
    assertString(body, 'lastName'),
    assertString(body, 'email'),
    assertString(body, 'phone'),
    assertFile(body, 'resume'),
    assertFile(body, 'coverLetter', true),
  ];

  if (validate.some((v) => v != null)) {
    return NextResponse.json(
      { message: 'some fields has a validation error', errors: validate.filter((v) => v != null) },
      { status: 400 }
    );
  }

  const data = await queryRunner.manager.findOne(Career, {
    where: {
      id: parseInt(body.get('id') as string),
      applyDate: LessThanOrEqual(new Date()),
      endDate: MoreThanOrEqual(new Date()),
      isDisabled: false,
    },
    relations: { lines: true },
  });

  if (!data) {
    return NextResponse.json(
      { message: `id '${body.get('id')}' cannot be found` },
      { status: 400 }
    );
  }

  const entity = queryRunner.manager.create(CareerSubmission, {
    firstName: body.get('firstName') as string,
    lastName: body.get('lastName') as string,
    email: body.get('email') as string,
    phone: body.get('phone') as string,
    resume: Buffer.from(await (body.get('resume') as File).arrayBuffer()),
    coverLetter: body.get('coverLetter')
      ? Buffer.from(await (body.get('coverLetter') as File).arrayBuffer())
      : undefined,
    career: data,
  });

  await queryRunner.manager.save(entity);

  await queryRunner.release();

  return NextResponse.json({ ok: true });
}
