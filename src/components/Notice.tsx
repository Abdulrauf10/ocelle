import { Link } from '@/navigation';
import Container from './Container';
import { useTranslations } from 'next-intl';

export default function Notice() {
  const t = useTranslations();

  return (
    <div className="bg-primary py-2 text-center text-xl text-white max-xl:text-base">
      <Container>
        {t('get-50%-off-your-starter-box')}
        <Link href="/get-started" className="font-bold underline">
          {t('order-now')}
        </Link>
        !
      </Container>
    </div>
  );
}
