import Container from '@/components/Container';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/navigation';
import Image from 'next/image';
import Benefits from '../Benefits';
import { completeCheckout } from '../actions';
import { formatDate } from '@/helpers/date';

export default async function ThankYouPage() {
  const t = await getTranslations();
  const { deliveryDate } = await completeCheckout();

  if (!deliveryDate) {
    return redirect('/get-started');
  }

  return (
    <Container className="py-24 text-center">
      <Link href="/" className="relative z-10 mx-auto inline-block px-2">
        <Image
          alt="Ocelle"
          src="/ocelle-logo.png"
          width={160}
          height={48}
          className="min-w-[160px]"
        />
      </Link>
      <h1 className="heading-4 mt-6 font-bold text-primary">{t('thank-you-for-your-order')}</h1>
      <p className="mt-4 text-primary">
        {t('your-starter-box-will-be-delivered-on-the-{}', {
          date: formatDate(t, deliveryDate, true),
        })}
      </p>
      <Benefits />
    </Container>
  );
}
