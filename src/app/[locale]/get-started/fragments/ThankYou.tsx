import Container from '@/components/Container';
import Headings from '@/components/Headings';
import { useTranslations } from 'next-intl';
import Benefits from '../Benefits';
import { Link } from '@/navigation';
import Image from 'next/image';

export default function ThankYouFragment() {
  const t = useTranslations();

  return (
    <Container className="text-center">
      <Link href="/" className="relative z-10 mx-auto inline-block px-2">
        <Image
          alt="Ocelle"
          src="/ocelle-logo.png"
          width={160}
          height={48}
          className="min-w-[160px]"
        />
      </Link>
      <Headings tag="h1" styles="h2" className="mt-6 font-bold text-primary">
        {t('thank-you-for-your-order')}
      </Headings>
      <p className="mt-4 text-primary">
        {t('your-starter-box-will-be-delivered-on-the-{}', { date: '8th of January 2024' })}
      </p>
      <Benefits />
    </Container>
  );
}
