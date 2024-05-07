import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HowPlanWorks() {
  const t = useTranslations('Home');
  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
        <Image
          src="/plan-works/icon-1.png"
          alt="your furry friend"
          width={110}
          height={110}
          className="inline-block"
        />
        <div className="mx-auto mt-5 h-9 w-9 rounded-full bg-gray text-center font-open-sans text-2xl font-bold leading-9 text-white">
          1
        </div>
        <div className="mt-3"></div>
        <h3 className="heading-4 text-gray">{t('block-5-item-1-title')}</h3>
        <div className="mt-3"></div>
        <p className="body-1">{t('block-5-item-1-content')}</p>
      </div>
      <div className=" w-1/3 px-8 py-5 text-center max-md:w-full">
        <Image
          src="/plan-works/icon-2.png"
          alt="starter box"
          width={110}
          height={110}
          className="ml-[20px] inline-block"
        />
        <div className="mx-auto mt-5 h-9 w-9 rounded-full bg-gray text-center font-open-sans text-2xl font-bold leading-9 text-white">
          2
        </div>
        <div className="mt-3"></div>
        <h3 className="heading-4 text-gray">{t('block-5-item-2-title')}</h3>
        <div className="mt-3"></div>
        <p className="body-1">{t('block-5-item-2-content')}</p>
      </div>
      <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
        <Image
          src="/plan-works/icon-3.png"
          alt="deliver"
          width={165}
          height={110}
          className="mr-[20px] inline-block"
        />
        <div className="mx-auto mt-5 h-9 w-9 rounded-full bg-gray text-center font-open-sans text-2xl font-bold leading-9 text-white">
          3
        </div>
        <div className="mt-3"></div>
        <h3 className="heading-4 text-gray">{t('block-5-item-3-title')}</h3>
        <div className="mt-3"></div>
        <p className="body-1">{t('block-5-item-3-content')}</p>
      </div>
    </div>
  );
}
