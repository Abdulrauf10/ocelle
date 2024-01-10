import Image from 'next/image';

export default function Benefits() {
  return (
    <div className="mt-[20px] flex flex-wrap justify-center">
      <div className="mt-[40px] w-[30%] max-w-[400px] p-[20px] max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="relative h-full rounded-[20px] border border-[#9A9486] p-[25px]">
          <div className="absolute -top-[35px] left-1/2 -translate-x-1/2 bg-white px-3">
            <Image
              src="/question/icon-1.svg"
              alt="hot food"
              width={60}
              height={60}
              className="min-h-[60px]"
            />
          </div>
          <h3 className="mt-[10px] text-[18px] font-bold text-[#9A9486]">Just Real, Good Food</h3>
          <p>Fresh, human-grade, natural ingredients</p>
        </div>
      </div>
      <div className="mt-[40px] w-[30%] max-w-[420px] p-[20px] max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="relative h-full rounded-[20px] border border-[#9A9486] p-[25px]">
          <div className="absolute -top-[38px] left-1/2 -translate-x-1/2 bg-white px-3">
            <Image
              src="/question/icon-2.svg"
              alt="hot food"
              width={60}
              height={60}
              className="min-h-[60px]"
            />
          </div>
          <h3 className="mt-[10px] text-[18px] font-bold text-[#9A9486]">Ready To Serve</h3>
          <p>Pre-portioned packs make serving a snap</p>
        </div>
      </div>
      <div className="mt-[40px] w-[30%] max-w-[400px] p-[20px] max-lg:w-1/3 max-lg:p-[10px] max-md:w-full">
        <div className="relative h-full rounded-[20px] border border-[#9A9486] p-[25px]">
          <div className="absolute -top-[32px] left-1/2 -translate-x-1/2 bg-white px-3">
            <Image
              src="/question/icon-3.svg"
              alt="hot food"
              width={110}
              height={60}
              className="min-h-[60px]"
            />
          </div>
          <h3 className="mt-[10px] text-[18px] font-bold text-[#9A9486]">Convenient Deliveries</h3>
          <p>Sit back and skip the hassle</p>
        </div>
      </div>
    </div>
  );
}
