import { useRouter } from '@/navigation';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import { Path } from '../types';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';

export default function IndexFragment({ navigate }: FragmentProps<Path>) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Container>
      <Headings tag="h1" styles="h2" className="text-center text-primary">
        {t('cancel-my-subscription')}
      </Headings>
      <p className="mx-auto mt-4 max-w-[680px] text-center">
        {t.rich('cancel-my-subscription:description', { br: () => <br /> })}
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
