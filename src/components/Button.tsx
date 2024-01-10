import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  className?: string;
}

export default function Button({ children, className }: React.PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={clsx(
        'inline-block cursor-pointer rounded-[30px] bg-secondary bg-dogfoot-icon bg-[length:25px_auto] bg-[center_right_15px] bg-no-repeat py-[10px] pl-[25px] pr-[50px] text-center text-[18px] font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#EA6A00]',
        className
      )}
    >
      {children}
    </button>
  );
}
