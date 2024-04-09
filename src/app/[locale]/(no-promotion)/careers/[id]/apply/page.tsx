import { notFound } from 'next/navigation';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Title from '../Title';
import { Career } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import ApplyCareerForm from '@/components/forms/ApplyCareer';
import { applyCareerAction } from './action';
import AppThemeProvider from '@/components/AppThemeProvider';

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

  if (!career) {
    notFound();
  }

  return (
    <main>
      <AppThemeProvider
        theme={{
          components: {
            MuiOutlinedInput: {
              styleOverrides: {
                input: {
                  padding: '10px 14.5px',
                },
              },
            },
          },
        }}
      >
        <ApplyCareerForm
          title={career.name}
          startAdornment={<Title career={career} />}
          action={async (data) => {
            'use server';
            data.set('id', String(career.id));
            await applyCareerAction(data);
          }}
        />
      </AppThemeProvider>
    </main>
  );
}
