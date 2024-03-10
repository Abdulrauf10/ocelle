import React from 'react';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { Career } from '@/entities';
import { Classification, WorkPattern, WorkType } from '@/enums';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import UnderlineButton from '@/components/UnderlineButton';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Block from '@/components/Block';
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

  return (
    <div className="mt-4 rounded-2xl bg-white px-10 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-sm:px-10 max-sm:py-6">
      <div className="-mx-3 -my-2 flex items-center max-xs:flex-wrap">
        <div className="w-full px-3 py-2">
          <div className="body-1 font-bold text-brown">{career.name}</div>
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
        <div className="px-3 py-2">
          <Button
            theme="primary"
            href={`./careers/${career.id}`}
            className="whitespace-nowrap !text-base"
          >
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
          <h1 className="heading-2 text-center font-bold text-primary">Dog People Wanted</h1>
          <p className="body-3 mt-2 text-center text-secondary">
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
                  <div className="heading-4 font-bold uppercase text-primary">Operations</div>
                  {operations.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {marketing.length > 0 && (
                <div className="py-10">
                  <div className="heading-4 font-bold uppercase text-primary">Marketing</div>
                  {marketing.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {financeAndAccounting.length > 0 && (
                <div className="py-10">
                  <div className="heading-4 font-bold uppercase text-primary">
                    Finance & Accounting
                  </div>
                  {financeAndAccounting.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {technology.length > 0 && (
                <div className="py-10">
                  <div className="heading-4 font-bold uppercase text-primary">Technology</div>
                  {technology.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {sales.length > 0 && (
                <div className="py-10">
                  <div className="heading-4 font-bold uppercase text-primary">Sales</div>
                  {sales.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="body-3 mx-auto max-w-[640px] text-center">
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
