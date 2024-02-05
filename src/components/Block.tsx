import clsx from 'clsx';
import React from 'react';

interface BlockProps {
  className?: string;
  styles?: 'tight' | 'normal';
}

export default function Block({
  className,
  styles,
  children,
}: React.PropsWithChildren<BlockProps>) {
  return (
    <div
      className={clsx(
        styles === 'tight' ? 'py-[2.5vw] max-xl:py-10' : 'py-[3.5vw] max-xl:py-10',
        className
      )}
    >
      {children}
    </div>
  );
}
