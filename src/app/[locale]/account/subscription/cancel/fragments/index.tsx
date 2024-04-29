import { useTranslations } from 'next-intl';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import { useRouter } from '@/navigation';

export default function IndexFragment() {
  const t = useTranslations();
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <Container>
      <h1 className="heading-4 text-center font-bold text-primary">
        {t('cancel-my-subscription')}
      </h1>
      <p className="mx-auto mt-4 max-w-[680px] text-center">
        {t.rich('cancel-my-subscription:description')}
      </p>
      <div className="mt-6 text-center">
        <Button href="/account/pause-delivery">{t('pause-all-deliveries')}</Button>
      </div>
      <div className="mx-auto mt-6 max-w-[590px]">
        <div className="-m-2 flex flex-wrap">
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[280px]"
              fullWidth
              reverse
              onClick={() => router.back()}
            >
              {t('go-back')}
            </Button>
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[280px]"
              fullWidth
              reverse
              onClick={() => navigate('survey')}
            >
              {t('cancel-subscription')}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
