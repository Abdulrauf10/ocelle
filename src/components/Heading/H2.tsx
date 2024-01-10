import clsx from 'clsx';
import React from 'react';

interface H2Props {
  className?: string;
}

export default function H2({ children, className }: React.PropsWithChildren<H2Props>) {
  return (
    <h2
      className={clsx(
        'text-[3vw] font-bold leading-[3.25vw] max-md:text-[32px] max-md:leading-[38px]',
        className
      )}
    >
      {children}
    </h2>
  );
}
