import React from 'react';

export default function Button({ children }: React.PropsWithChildren<{}>) {
  return (
    <button className="bg-dogfoot-icon bg-secondary inline-block cursor-pointer rounded-[30px] bg-[length:25px_auto] bg-[center_right_15px] bg-no-repeat py-[10px] pl-[25px] pr-[50px] text-center text-[18px] font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#EA6A00]">
      {children}
    </button>
  );
}
