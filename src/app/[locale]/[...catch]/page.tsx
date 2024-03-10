'use client';

import Button from '@/components/Button';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import { useRouter } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'use-intl';

export default function NotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <>
      <Header nav={<Navigator />} />
      <div className="bg-gold bg-opacity-20">
        <Container className="flex items-end max-md:flex-col max-sm:items-center">
          <div className="w-full px-4 py-20 max-md:py-12 max-sm:py-8">
            <h1 className="heading-1 font-bold text-primary">Aiya! Page Gone Walkies!</h1>
            <p className="mt-4">
              <span className="italic text-primary">RUH-ROH!</span>{' '}
              <span className="uppercase text-secondary">(Wrong Page!)</span>
              <br />
              <span className="italic text-primary">RUH-RUFF! RUFF! RUFF!</span>{' '}
              <span className="uppercase text-secondary">(Try Reloading!)</span>
              <br />
              <span className="italic text-primary">WOOF! RUH-RUFF! RUFF! RUFF!</span>{' '}
              <span className="uppercase text-secondary">(Or Use Links Below!)</span>
              <br />
              <span className="italic text-primary">AROOOOOOOO!!!</span>
            </p>
            <div className="max-w-[180px]">
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
          <div className="w-[400px] min-w-[400px] px-4 pt-10">
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
