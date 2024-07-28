import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Benefits() {
  const t = useTranslations();

  return (
    <div className="mt-5 flex flex-wrap justify-center">
      <div className="mt-10 w-[30%] max-w-[400px] p-5 max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="relative h-full rounded-[20px] border border-gray p-6">
          <div className="absolute -top-[42px] left-1/2 w-[96px] -translate-x-1/2 bg-white">
            <Image
              src="/get-started/icon-1.svg"
              alt="hot food"
              width={64}
              height={64}
              className="m-auto min-h-[64px]"
            />
          </div>
          <div className="mt-3"></div>
          <h3 className="body-2 font-bold text-gray">{t('just-real-good-food')}</h3>
          <div className="mt-1"></div>
          <p className="body-3">{t('fresh-human-grade-natural-ingredients')}</p>
        </div>
      </div>
      <div className="mt-10 w-[30%] max-w-[420px] p-5 max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="relative h-full rounded-[20px] border border-gray p-6">
          <div className="absolute -top-[56px] left-1/2 w-[96px] -translate-x-1/2 bg-white">
            <Image
              src="/get-started/icon-2.svg"
              alt="hot food"
              width={60}
              height={64}
              className="m-auto min-h-[93px]"
            />
          </div>
          <div className="mt-3"></div>
          <h3 className="body-2 relative font-bold text-gray">{t('ready-to-serve')}</h3>
          <div className="mt-1"></div>
          <p className="body-3">{t('pre-portioned-packs-make-serving-a-snap')}</p>
        </div>
      </div>
      <div className="mt-10 w-[30%] max-w-[400px] p-5 max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="relative h-full rounded-[20px] border border-gray p-6">
          <div className="absolute -top-[30px] left-1/2 w-[128px] -translate-x-1/2 bg-white">
            <Image
              src="/get-started/icon-3.svg"
              alt="hot food"
              width={96}
              height={60}
              className="m-auto min-w-[96px]"
            />
          </div>
          <div className="mt-3"></div>
          <h3 className="body-2 font-bold text-gray">{t('convenient-deliveries')}</h3>
          <div className="mt-1"></div>
          <p className="body-3">{t('sit-back-and-skip-the-hassle')}</p>
        </div>
      </div>
    </div>
  );
}
