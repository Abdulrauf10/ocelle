'use client';

import clsx from 'clsx';
import React from 'react';

export default function Sticky({
  disabled,
  children,
}: React.PropsWithChildren<{ disabled?: boolean }>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useLayoutEffect(() => {
    function handler() {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        setIsSticky(top <= 0 && window.scrollY > 0);
      }
    }
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        !disabled ? 'sticky top-0 z-30' : 'relative',
        !disabled && isSticky && 'shadow-[0_5px_10px_#ccc]'
      )}
    >
      {children}
    </div>
  );
}
