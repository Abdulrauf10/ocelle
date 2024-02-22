import { Link } from '@/navigation';
import Container from './Container';
import { useTranslations } from 'next-intl';

export default function Notice() {
  const t = useTranslations();

  return (
    <div className="bg-primary py-2 pt-4 text-center text-xl text-white max-xl:text-base">
      <Container>
        {t('get-50%-off-your-starter-box')}
        <Link href="#" className="font-bold hover:underline" target="_blank">
          {t('order-now')}
        </Link>
        !
      </Container>
    </div>
  );
}
