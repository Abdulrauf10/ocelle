import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import CircleTick from '@/components/icons/CircleTick';

export default function CompleteFragment() {
  const t = useTranslations();

  return (
    <Container>
      <div className="mx-auto h-12 w-12 rounded-full bg-secondary p-1.5">
        <CircleTick className="relative top-px" />
      </div>
      <div className="mt-2"></div>
      <h1 className="heading-4 text-center font-bold text-primary">
        {t('cancellation-successful')}
      </h1>
      <div className="mt-6"></div>
      <div className="relative -m-2 mx-auto flex max-w-[780px] items-center justify-center max-lg:flex-col">
        <div className="absolute -left-24 p-2 max-lg:static">
          <Image src="/account/sorry.svg" alt="Sorry dog" width={80} height={80} />
        </div>
        <div className="p-2">
          <div className="text-center text-2xl font-bold text-gold">{t('till-we-meet-again')}</div>
          <p className="mx-auto mt-4 text-center">
            {t.rich('thank-you-for-your-patronage', { br: () => <br /> })}
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <UnderlineButton
          type="button"
          href="/account"
          label={t('back-to-{}', { name: t('my-info') })}
        />
      </div>
    </Container>
  );
}
