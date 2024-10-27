import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Block from '@/components/layouts/Block';
import { Career } from '@/entities';
import { Classification, WorkPattern, WorkType } from '@/enums';
import careerService from '@/services/career';

async function fetchData() {
  const careers = await careerService.list();
  const operations = [];
  const marketing = [];
  const financeAndAccounting = [];
  const technology = [];
  const sales = [];
  for (const career of careers) {
    if (career.classification === Classification.Operations) {
      operations.push(career);
      continue;
    }
    if (career.classification === Classification.Marketing) {
      marketing.push(career);
      continue;
    }
    if (career.classification === Classification.FinanceAndAccounting) {
      financeAndAccounting.push(career);
      continue;
    }
    if (career.classification === Classification.Technology) {
      technology.push(career);
      continue;
    }
    if (career.classification === Classification.Sales) {
      sales.push(career);
      continue;
    }
  }
  return { count: careers.length, operations, marketing, financeAndAccounting, technology, sales };
}

function CareerBlock({ career }: { career: Career }) {
  const t = useTranslations();
  const b = useTranslations('Button');
  return (
    <div className="mt-4 rounded-2xl bg-white px-10 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-sm:px-4 max-sm:py-6">
      <div className="-mx-3 -my-2 flex items-start ">
        <div className="w-full px-3 py-2">
          <h3 className="body-1 body-weight-1 pb-[2px] !leading-6 text-brown">{career.name}</h3>
          <div className="mt-1"></div>
          <div className="body-3">
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
        <div className="mx-auto my-auto block px-3  md:hidden">
          <Button
            theme="primary"
            href={`./careers/${career.id}`}
            className="whitespace-nowrap !text-base"
            disableIcon
          >
            {b('see-details')}
          </Button>
        </div>
        <div className="mx-auto hidden px-3 py-2 md:block">
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
    <main className="flex grow flex-col">
      <Block styles="narrow" className="bg-primary bg-opacity-10 !py-10">
        <Container>
          <h1 className="heading-2 text-center font-bold text-primary">{c('block-1-title')}</h1>
          <div className="mt-2"></div>
          <p className="body-3 text-center text-secondary">{c('block-1-content')}</p>
        </Container>
      </Block>
      <Block styles="custom" className="grow bg-gold bg-opacity-10 pb-6 pt-10 max-xl:py-10">
        <Container className="max-w-screen-lg">
          {count > 0 ? (
            <div className="-my-10">
              {operations.length > 0 && (
                <div className="my-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Operations</h2>
                  {operations.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {marketing.length > 0 && (
                <div className="my-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Marketing</h2>
                  {marketing.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {financeAndAccounting.length > 0 && (
                <div className="my-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">
                    Finance & Accounting
                  </h2>
                  {financeAndAccounting.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {technology.length > 0 && (
                <div className="my-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Technology</h2>
                  {technology.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
              {sales.length > 0 && (
                <div className="my-10">
                  <h2 className="heading-4 font-bold uppercase text-primary">Sales</h2>
                  {sales.map((career) => (
                    <CareerBlock key={career.id} career={career} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-[640px] text-center">
              <p className="body-3">{c.rich('block-2-content-1')}</p>
              <div className="mt-4"></div>
              <p className="body-3">
                {c.rich('block-2-content-2')}
                <UnderlineButton
                  label="careers@ocelle.dog"
                  theme="primary"
                  href="mailto:careers@ocelle.dog"
                />
                {c('block-2-content-3')}
              </p>
              <div className="mt-6"></div>
              <p className="body-3 font-bold italic text-primary">{c('block-2-content-4')}</p>
            </div>
          )}
        </Container>
      </Block>
    </main>
  );
}
