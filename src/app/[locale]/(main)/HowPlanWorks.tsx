import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Mark = {
  title: React.ReactNode;
  content: React.ReactNode;
};

export default function HowPlanWorks({
  mark1,
  mark2,
  mark3,
}: {
  mark1: Mark;
  mark2: Mark;
  mark3: Mark;
}) {
  const t = useTranslations('Home');
  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
        <Image
          src="/plan-works/icon-1.png"
          alt="your furry friend"
          width={112}
          height={112}
          className="inline-block"
        />
        <div className="mx-auto mt-5 h-9 w-9 rounded-full bg-gray text-center font-open-sans text-2xl font-bold leading-9 text-white">
          1
        </div>
        <div className="pt-3"></div>
        <h3 className="heading-4 text-gray">{mark1.title}</h3>
        <div className="pt-4"></div>
        <p className="body-1">{mark1.content}</p>
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
        <div className="pt-3"></div>
        <h3 className="heading-4 text-gray">{mark2.title}</h3>
        <div className="pt-4"></div>
        <p className="body-1">{mark2.content}</p>
      </div>
      <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
        <Image
          src="/plan-works/icon-3.png"
          alt="deliver"
          width={180}
          height={120}
          className="mr-[20px] inline-block"
        />
        <div className="mx-auto mt-5 h-9 w-9 rounded-full bg-gray text-center font-open-sans text-2xl font-bold leading-9 text-white">
          3
        </div>
        <div className="pt-3"></div>
        <h3 className="heading-4 text-gray">{mark3.title}</h3>
        <div className="pt-4"></div>
        <p className="body-1">{mark3.content}</p>
      </div>
    </div>
  );
}
