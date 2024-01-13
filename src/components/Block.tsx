import clsx from 'clsx';
import React from 'react';

interface BlockProps {
  className?: string;
}

export default function Block({ className, children }: React.PropsWithChildren<BlockProps>) {
  return <div className={clsx('py-[3.5vw] max-sm:py-10', className)}>{children}</div>;
}
