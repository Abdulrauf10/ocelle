import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Block from '@/components/layouts/Block';
import { Career } from '@/entities';
import { Classification, WorkPattern, WorkType } from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';

async function fetchData() {
  return executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.find(Career, {
      where: {
        applyDate: LessThanOrEqual(new Date()),
        endDate: MoreThanOrEqual(new Date()),
        isDisabled: false,
      },
      relations: { lines: true },
    });

    return {
      count: data.length,
      operations: data.filter((d) => d.classification === Classification.Operations),
      marketing: data.filter((d) => d.classification === Classification.Marketing),
      financeAndAccounting: data.filter(
        (d) => d.classification === Classification.FinanceAndAccounting
      ),
      technology: data.filter((d) => d.classification === Classification.Technology),
      sales: data.filter((d) => d.classification === Classification.Sales),
    };
  });
}

function CareerBlock({ career }: { career: Career }) {
  const t = useTranslations();
  const b = useTranslations('Button');
  return (
    <div className="mt-4 rounded-2xl bg-white px-10 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-sm:px-4 max-sm:py-6">
      <div className="-mx-3 -my-2 flex items-center max-xs:flex-wrap">
        <div className="w-full px-3 py-2">
          <h3 className="body-1 font-bold text-brown">{career.name}</h3>
          <div className="body-3 mt-1">
            {t(
              career.workType === WorkType.FullTime
                ? 'full-time'
                : career.workType === WorkType.PartTime
                  ? 'part-time'
                  : 'contract'
            )}
            &nbsp;/&nbsp;
            {t(
              career.workPattern === WorkPattern.OnSite
                ? 'on-site'
                : career.workPattern === WorkPattern.Hybrid
                  ? 'hybrid'
                  : 'remote'
            )}
          </div>
        </div>
        <div className="mx-auto px-3 py-2">
          <Button
            theme="primary"
            href={`./careers/${career.id}`}
            className="whitespace-nowrap !text-base"
          >
            {b('see-details')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function Careers() {
  const { count, operations, marketing, financeAndAccounting, technology, sales } =
    await fetchData();
  const t = await getTranslations();
  const c = await getTranslations('Careers');
  return (
    <main>
      <Block styles="narrow" className="bg-primary bg-opacity-10">
        <Container>
          <h1 className="heading-2 text-center font-bold text-primary">{c('block-1-title')}</h1>
          <p className="body-3 mt-2 text-center text-secondary">{c('block-1-content')}</p>
        </Container>
      </Block>
      <Block styles="custom" className="bg-gold bg-opacity-10 pb-6 pt-4 max-xl:py-10">
        <Container className="max-w-screen-lg">
          {count > 0 ? (
            <div className="-my-10">
              {operations.length > 0 && (
                <div className="py-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Operations</h2>
                  {operations.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {marketing.length > 0 && (
                <div className="py-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Marketing</h2>
                  {marketing.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {financeAndAccounting.length > 0 && (
                <div className="py-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">
                    Finance & Accounting
                  </h2>
                  {financeAndAccounting.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {technology.length > 0 && (
                <div className="py-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Technology</h2>
                  {technology.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {sales.length > 0 && (
                <div className="py-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Sales</h2>
                  {sales.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="body-3 mx-auto max-w-[640px] text-center">
              <p>{c('block-2-content-1')}</p>
              <p className="mt-4">
                {c('block-2-content-2')}
                <UnderlineButton
                  label="careers@ocelle.dog"
                  theme="primary"
                  href="mailto:careers@ocelle.dog"
                />
                {c('block-2-content-3')}
              </p>
              <p className="mt-6 font-bold italic text-primary">{c('block-2-content-4')}</p>
            </div>
          )}
        </Container>
      </Block>
    </main>
  );
}
