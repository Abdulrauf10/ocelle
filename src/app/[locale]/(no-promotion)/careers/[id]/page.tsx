import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Title from './Title';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import Block from '@/components/layouts/Block';
import { CareerLine } from '@/entities';
import { CareerLineType } from '@/enums';
import careerService from '@/services/career';

function CareerBlock({ title, lines }: { title: React.ReactNode; lines: CareerLine[] }) {
  return (
    <div className="overflow-hidden rounded-[27px] border-2 border-primary">
      <h2 className="body-1 body-weight-1 bg-primary px-8 py-4 text-white">{title}</h2>
      <div className="bg-white px-8 py-6">
        <ul className="-my-2 list-none">
          {lines.map((line) => (
            <li key={line.id} className="flex py-2">
              <div className="mr-2 flex h-[13px] items-center">
                <div className="h-2 w-2 min-w-2 rounded-full bg-primary"></div>
              </div>
              <p className="body-3">{line.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function CareerView({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }
  const career = await careerService.get(id);
  const c = await getTranslations('Careers');
  const b = await getTranslations('Button');
  if (!career) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <Title career={career} />
      <Block styles="custom" className="flex grow flex-col bg-gold bg-opacity-10 py-6">
        <Container className="flex max-w-screen-lg grow flex-col">
          <p className="body-3">{c.rich('detail-content-1')}</p>
          <div className="mt-6"></div>
          <p className="body-3">{c.rich('detail-content-2')}</p>
          <div className="mt-6"></div>
          <CareerBlock
            title={c.rich('what-you’ll-do')}
            lines={career.lines.filter((line) => line.lineType === CareerLineType.Responsibility)}
          />
          <div className="mt-6"></div>
          <CareerBlock
            title={c.rich('what-you’ll-need')}
            lines={career.lines.filter((line) => line.lineType === CareerLineType.Requirement)}
          />
          <div className="mt-6"></div>
          <CareerBlock
            title={c('benefits')}
            lines={career.lines.filter((line) => line.lineType === CareerLineType.Benefit)}
          />
          <div className="mt-6"></div>
          <p className="body-3 italic">{c.rich('detail-content-3')}</p>
          <div className="mt-6"></div>
          <div className="text-center">
            <Button className="min-w-[180px]" href={`./${params.id}/apply`}>
              {b('apply')}
            </Button>
          </div>
        </Container>
      </Block>
    </main>
  );
}
