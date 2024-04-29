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
        <Container className="flex max-w-screen-xl items-end max-md:flex-col max-sm:items-center">
          <div className="w-full px-4 py-20 text-left max-md:py-12 max-md:text-center max-sm:py-8">
            <h1 className="heading-1 font-bold text-primary">
              <i>Aiya!</i> <span className="inline-block">Page Gone Walkies!</span>
            </h1>
            <p className="body-1 mt-4">
              <span className="italic text-primary">RUH-ROH!</span>{' '}
              <span className="uppercase text-secondary">(TRY RELOADING!)</span>
              <br />
              <span className="italic text-primary">WOOF! RUH-RUFF!</span>{' '}
              <span className="uppercase text-secondary">(Or Use Links Below!)</span>
              <br />
              <span className="italic text-primary">AROOOOOOOO!!!</span>
            </p>

            <div className="mx-0 max-w-[180px] max-md:mx-auto">
              <div className="mt-4">
                <Button fullWidth onClick={() => router.back()}>
                  <span className="flex-1">{t('go-back')}</span>
                </Button>
              </div>
              <div className="mt-4">
                <Button fullWidth href="/">
                  <span className="flex-1">{t('go-home')}</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full px-4 pt-10 xs:w-[480px] xs:min-w-[480px]">
            <div className="relative pt-[103.3%]">
              <Image src="/404.png" alt="404 dog" fill />
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
