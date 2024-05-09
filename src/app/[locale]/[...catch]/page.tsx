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
        <Container className="flex max-w-screen-xl items-end max-[903px]:flex-col max-[903px]:items-center">
          <div className="w-full px-4 py-20 text-left max-[903px]:py-12 max-[903px]:py-8 max-[903px]:text-center">
            <h1 className="heading-1 font-bold text-primary">
              <i>Aiya!</i> <span className="inline-block">Page Gone Walkies!</span>
            </h1>
            <div className="mt-4">
              <p className="body-1">
                <span className="italic text-primary">Woof! Please use the links below.</span>
              </p>
            </div>

            <div className="mx-0 max-w-[180px] max-[903px]:mx-auto">
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
          <div className="w-full px-4 pt-0 xs:w-[480px] xs:min-w-[480px] min-[903px]:pt-10">
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
