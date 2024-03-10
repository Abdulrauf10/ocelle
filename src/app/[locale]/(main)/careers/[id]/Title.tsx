import Block from '@/components/Block';
import Container from '@/components/Container';
import { Career } from '@/entities';
import { WorkPattern, WorkType } from '@/enums';
import { useTranslations } from 'next-intl';

export default function Title({ career }: { career: Career }) {
  const t = useTranslations();

  return (
    <Block styles="tight" className="bg-primary bg-opacity-10">
      <Container className="max-w-screen-lg">
        <div className="heading-4 font-bold text-brown">{career.name}</div>
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
