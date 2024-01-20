import Image from 'next/image';

export default function Benefits() {
  return (
    <div className="mt-5 flex flex-wrap justify-center">
      <div className="mt-10 w-[30%] max-w-[400px] p-5 max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="border-gray relative h-full rounded-[20px] border p-6">
          <div className="absolute -top-[35px] left-1/2 -translate-x-1/2 bg-white px-3">
            <Image
              src="/question/icon-1.svg"
              alt="hot food"
              width={60}
              height={60}
              className="min-h-[60px]"
            />
          </div>
          <h3 className="text-gray mt-3 text-lg font-bold">Just Real, Good Food</h3>
          <p>Fresh, human-grade, natural ingredients</p>
        </div>
      </div>
      <div className="mt-10 w-[30%] max-w-[420px] p-5 max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="border-gray relative h-full rounded-[20px] border p-6">
          <div className="absolute -top-[38px] left-1/2 -translate-x-1/2 bg-white px-3">
            <Image
              src="/question/icon-2.svg"
              alt="hot food"
              width={60}
              height={63}
              className="min-h-[60px]"
            />
          </div>
          <h3 className="text-gray mt-3 text-lg font-bold">Ready To Serve</h3>
          <p>Pre-portioned packs make serving a snap</p>
        </div>
      </div>
      <div className="mt-10 w-[30%] max-w-[400px] p-5 max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="border-gray relative h-full rounded-[20px] border p-6">
          <div className="absolute -top-[32px] left-1/2 -translate-x-1/2 bg-white px-3">
            <Image
              src="/question/icon-3.svg"
              alt="hot food"
              width={110}
              height={60}
              className="min-h-[60px] min-w-[110px]"
            />
          </div>
          <h3 className="text-gray mt-3 text-lg font-bold">Convenient Deliveries</h3>
          <p>Sit back and skip the hassle</p>
        </div>
      </div>
    </div>
  );
}
