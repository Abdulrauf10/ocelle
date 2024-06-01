'use client';

import Image from 'next/image';
import { useTranslations } from 'use-intl';

import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import Promotion from '@/components/Promotion';
import Button from '@/components/buttons/Button';
import { useRouter } from '@/navigation';

export default function NotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <>
      <Promotion />
      <Header nav={<Navigator />} />
      <div className="bg-gold bg-opacity-20">
        <Container className="flex max-w-screen-xl items-center max-[951px]:flex-col max-[951px]:items-center">
          <div className="w-full py-20 max-[951px]:py-8 max-[951px]:text-center">
            <h1 className="heading-1 font-bold text-primary">
              <span className="inline-block">
                <i>Aiya! </i>
              </span>{' '}
              <span className="inline-block">Page Gone Walkies!</span>
            </h1>
            <div className="pt-4"></div>
            <p className="body-1 text-primary">
              Please use the links below. <i>Woof!</i>
            </p>
            <div className="pt-4"></div>
            <div className="mx-0 max-w-[180px] max-[951px]:mx-auto">
              <Button fullWidth onClick={() => router.back()}>
                <span className="flex-1">{t('go-back')}</span>
              </Button>
              <div className="pt-4"></div>
              <Button fullWidth href="/">
                <span className="flex-1">{t('go-home')}</span>
              </Button>
            </div>
          </div>
          <div className="w-full max-w-full pt-24 max-[951px]:pt-0 xs:w-[500px] min-[952px]:min-w-[530px] min-[952px]:px-4">
            <div className="relative pt-[100%]">
              <Image src="/404.png" alt="404 dog" fill />
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
