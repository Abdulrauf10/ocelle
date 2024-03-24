import Button from '@/components/Button';
import Container from '@/components/Container';
import { Career, CareerLine } from '@/entities';
import { CareerLineType } from '@/enums';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Title from './Title';
import Block from '@/components/Block';
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

interface SectionProps {
  title: string;
  lines: CareerLine[];
}

function Section({ title, lines }: SectionProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border-2 border-primary">
      <h2 className="body-1 bg-primary px-8 py-4 font-bold text-white">{title}</h2>
      <div className="bg-white px-8 py-6">
        <ul className="-my-2 list-none">
          {lines.map((line) => (
            <li key={line.id} className="flex py-2">
              <div className="mr-2 flex h-[20px] items-center">
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
  const career = await fetchData(parseInt(params.id));
  const t = await getTranslations();

  if (!career) {
    notFound();
  }

  return (
    <main>
      <Title career={career} />
      <Block styles="tight" className="bg-gold bg-opacity-10">
        <Container className="max-w-screen-lg">
          <p className="body-3">
            OCELLE was born with the mission of improving the lives of pets and pet parents
            nationwide. We make human-grade pet food, tailored for each dog’s nutritional needs, and
            deliver directly to our customers’ doors. Through OCELLE’s carefully crafted meals and
            health services for members, dogs can truly live their healthiest, happiest lives.
          </p>
          <p className="body-3 mt-6">
            As a member of our growing team, you’ll take part in a company culture that cares deeply
            about its work and its team members. We move fast, value autonomy and ownership, and are
            always looking for new ideas.
          </p>
          <div className="mt-6">
            <Section
              title="What You’ll Do:"
              lines={career.lines.filter((line) => line.lineType === CareerLineType.Responsibility)}
            />
          </div>
          <div className="mt-6">
            <Section
              title="What You’ll Need:"
              lines={career.lines.filter((line) => line.lineType === CareerLineType.Requirement)}
            />
          </div>
          <div className="mt-6">
            <Section
              title="Benefits:"
              lines={career.lines.filter((line) => line.lineType === CareerLineType.Benefit)}
            />
          </div>
          <p className="body-3 mt-6 italic">
            At OCELLE we know that people are the heart of the business, and we prioritise their
            welfare. OCELLE embraces diversity and equal opportunity. We&apos;re committed to
            building a team that represents a variety of backgrounds, perspectives, and skills.
            OCELLE is an equal opportunity employer and does not discriminate on the basis of race,
            national origin, gender, gender identity, sexual orientation, disability, age, or other
            legally protected status. For individuals with disabilities who would like to request an
            accommodation, please include that in your application.
          </p>
          <div className="mt-6 text-center">
            <Button className="min-w-[180px]" href={`./${params.id}/apply`}>
              {t('apply')}
            </Button>
          </div>
        </Container>
      </Block>
    </main>
  );
}
