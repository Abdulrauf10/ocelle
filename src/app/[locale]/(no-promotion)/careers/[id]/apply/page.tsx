import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Title from '../Title';
import { Career } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import ApplyCareerForm from '@/components/forms/ApplyCareer';
import { applyCareerAction } from './action';

async function fetchData(id: number) {
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

export default async function CareerApply({ params }: { params: { id: string } }) {
  const career = await fetchData(parseInt(params.id));
  const t = await getTranslations();

  if (!career) {
    notFound();
  }

  return (
    <main>
      <ApplyCareerForm
        title={career.name}
        startAdornment={<Title career={career} />}
        action={async (data) => {
          'use server';
          data.set('id', String(career.id));
          await applyCareerAction(data);
        }}
      />
    </main>
  );
}
