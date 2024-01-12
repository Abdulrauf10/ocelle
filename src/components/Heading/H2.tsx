import clsx from 'clsx';
import React from 'react';

interface H2Props {
  id?: string;
  className?: string;
  inline?: boolean;
}

export default function H2({ id, children, inline, className }: React.PropsWithChildren<H2Props>) {
  return (
    <h2
      id={id}
      className={clsx(
        'font-bold',
        inline
          ? 'text-[34px] leading-[40px] max-lg:text-[28px] max-lg:leading-[34px]'
          : 'text-[3vw] leading-[3.25vw] max-md:text-[32px] max-md:leading-[38px]',
        className
      )}
    >
      {children}
    </h2>
  );
}
