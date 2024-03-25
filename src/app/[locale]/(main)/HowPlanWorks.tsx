import Image from 'next/image';

export default function HowPlanWorks() {
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
        <h3 className="heading-4 mt-2 text-gray">Introduce your dog</h3>
        <p className="body-1 mt-2">
          Complete our short quiz so we can get to know your dog! We’ll help build a uniquely
          crafted meal plan, just for them.
        </p>
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
        <h3 className="heading-4 mt-2 text-gray">Get your starter box</h3>
        <p className="body-1 mt-2">
          Your starer box contains a two-week supply of freshly prepared meals, to let your dog do
          the all-important taste testing!
        </p>
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
        <h3 className="heading-4 mt-2 text-gray">Real, good food, regularly delivered</h3>
        <p className="body-1 mt-2">
          Ultra-Convenience: Our meals are delivered direct to your door, fresh and bursting with
          flavour and nutrients.
        </p>
      </div>
    </div>
  );
}
