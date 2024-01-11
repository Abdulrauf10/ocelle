import clsx from 'clsx';
import React from 'react';

interface H2Props {
  className?: string;
  inline?: boolean;
}

export default function H2({ children, inline, className }: React.PropsWithChildren<H2Props>) {
  return (
    <h2
      className={clsx(
        'font-bold',
        inline
          ? 'text-[2vw] leading-[2.25vw] max-lg:text-[28px] max-lg:leading-[34px]'
          : 'text-[3vw] leading-[3.25vw] max-md:text-[32px] max-md:leading-[38px]',
        className
      )}
    >
      {children}
    </h2>
  );
}
