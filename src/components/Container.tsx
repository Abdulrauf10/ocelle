import clsx from 'clsx';
import React from 'react';

interface ContainerProps {
  className?: string;
}

export default function Container({
  children,
  className,
}: React.PropsWithChildren<ContainerProps>) {
  return <div className={clsx('mx-auto max-w-8xl px-4', className)}>{children}</div>;
}
