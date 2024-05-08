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
  const getStyles = () => {
    switch (styles) {
      case 'tight':
        return 'py-tight';
      case 'narrow':
        return 'py-4 max-xl:py-10';
      case 'custom':
        return undefined;
      case 'normal':
        return '';
      default:
        return 'py-normal';
    }
  };

  return <div className={clsx(getStyles(), className)}>{children}</div>;
}
