import React from 'react';
import AppDataSource from '@/AppDataSource';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { Career } from '@/entities';
import { Classification, WorkPattern, WorkType } from '@/enums';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import UnderlineButton from '@/components/UnderlineButton';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Headings from '@/components/Headings';
import Block from '@/components/Block';

async function fetchData() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const data = await queryRunner.manager.find(Career, {
    where: {
      applyDate: LessThanOrEqual(new Date()),
      endDate: MoreThanOrEqual(new Date()),
      isDisabled: false,
    },
    relations: { lines: true },
  });

  await queryRunner.release();

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
}

function CareerBlock({ career }: { career: Career }) {
  const t = useTranslations();

  return (
    <div className="mt-4 rounded-2xl bg-white px-16 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-sm:px-10 max-sm:py-6">
      <div className="-mx-3 -my-2 flex items-center max-xs:flex-wrap">
        <div className="w-full px-3 py-2">
          <div className="text-2xl font-bold text-brown">{career.name}</div>
          <div className="mt-1">
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
        <div className="px-3 py-2">
          <Button theme="primary" href={`./careers/${career.id}`} className="whitespace-nowrap">
            {t('see-details')}
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

  return (
    <main>
      <Block styles="tight" className="bg-primary bg-opacity-10">
        <Container>
          <Headings tag="h1" styles="h1" className="text-center text-primary">
            Dog People Wanted
          </Headings>
          <p className="mt-4 text-center text-secondary">
            Make a living helping dogs live happier, healthier lives.
          </p>
        </Container>
      </Block>
      <Block styles="tight" className="bg-gold bg-opacity-10">
        <Container className="max-w-screen-lg">
          {count > 0 ? (
            <div className="-my-10">
              {operations.length > 0 && (
                <div className="py-10">
                  <div className="text-4xl font-bold uppercase text-primary max-sm:text-2xl">
                    Operations
                  </div>
                  {operations.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {marketing.length > 0 && (
                <div className="py-10">
                  <div className="text-4xl font-bold uppercase text-primary max-sm:text-2xl">
                    Marketing
                  </div>
                  {marketing.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {financeAndAccounting.length > 0 && (
                <div className="py-10">
                  <div className="text-4xl font-bold uppercase text-primary max-sm:text-2xl">
                    Finance & Accounting
                  </div>
                  {financeAndAccounting.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {technology.length > 0 && (
                <div className="py-10">
                  <div className="text-4xl font-bold uppercase text-primary max-sm:text-2xl">
                    Technology
                  </div>
                  {technology.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {sales.length > 0 && (
                <div className="py-10">
                  <div className="text-4xl font-bold uppercase text-primary max-sm:text-2xl">
                    Sales
                  </div>
                  {sales.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-[640px] text-center">
              <p>
                While we don&apos;t currently have any positions open, we&apos;re always on the
                lookout for talented individuals who share our love for wagging tails and healthy
                dogs.
              </p>
              <p className="mt-4">
                If you&apos;re eager to make a difference, please send your resume to&nbsp;
                <UnderlineButton
                  label="careers@ocelle.dog"
                  theme="primary"
                  href="mailto:careers@ocelle.dog"
                />
                . You never know, the paw-fect opportunity might just arise!
              </p>
              <p className="mt-6 font-bold italic text-primary">
                We look forward to hearing from you!
              </p>
            </div>
          )}
        </Container>
      </Block>
    </main>
  );
}
