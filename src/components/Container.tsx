import clsx from 'clsx';
import React from 'react';

interface ContainerProps {
  className?: string;
  screen?: boolean;
}

export default function Container({
  children,
  className,
  screen,
}: React.PropsWithChildren<ContainerProps>) {
  return (
    // <div className={clsx('mx-auto px-4', screen ? 'max-w-full' : 'max-w-8xl', className)}>
    <div className={clsx('mx-auto px-4', screen ? '' : 'max-w-8xl', className)}>{children}</div>
  );
}
