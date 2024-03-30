import clsx from 'clsx';
import React from 'react';

interface BlockProps {
  className?: string;
  styles?: 'tight' | 'normal' | 'narrow' | 'custom';
}

export default function Block({
  className,
  styles,
  children,
}: React.PropsWithChildren<BlockProps>) {
  return (
    <div
      className={clsx(
        styles === 'tight'
          ? 'py-[2.4vw] max-xl:py-10'
          : styles === 'normal'
            ? 'py-[3.5vw] max-xl:py-10'
            : styles === 'narrow'
              ? 'py-4 max-xl:py-10'
              : 'py-[3.5vw] max-xl:py-10',
        className
      )}
    >
      {children}
    </div>
  );
}
