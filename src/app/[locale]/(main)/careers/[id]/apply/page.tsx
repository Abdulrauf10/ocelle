import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import ApplyForm from './ApplyForm';
import Title from '../Title';
import { Career } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

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
      <ApplyForm id={parseInt(params.id)} title={career.name}>
        <Title career={career} />
      </ApplyForm>
    </main>
  );
}
