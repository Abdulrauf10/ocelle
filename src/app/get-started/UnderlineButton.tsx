import clsx from 'clsx';
import React from 'react';

interface UnderlineButtonProps {
  className?: string;
  active?: boolean;
  onClick(): void;
}

export default function UnderlineButton({
  className,
  active = true,
  onClick,
  children,
}: React.PropsWithChildren<UnderlineButtonProps>) {
  return (
    <button
      className={clsx('text-lg text-secondary', className, active && 'underline')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
