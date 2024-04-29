import { useTranslations } from 'next-intl';

import Container from '@/components/Container';
import Block from '@/components/layouts/Block';
import { Career } from '@/entities';
import { WorkPattern, WorkType } from '@/enums';

export default function Title({ career }: { career: Career }) {
  const t = useTranslations();

  return (
    <Block styles="custom" className="bg-primary bg-opacity-10 py-5">
      <Container className="max-w-screen-lg">
        <h1 className="heading-4 font-bold text-brown">{career.name}</h1>
        <div className="body-2 mt-1">
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
      </Container>
    </Block>
  );
}
