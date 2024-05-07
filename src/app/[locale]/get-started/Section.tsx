import clsx from 'clsx';
import React from 'react';

interface SectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  dense?: boolean;
}

export default function Section({
  title,
  description,
  className,
  dense,
  children,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <>
      <div className={className}>
        <h2 className="heading-4 font-bold text-primary">{title}</h2>
        <div className="mt-5"></div>
        {description && (
          <>
            <p className="body-3 italic text-primary">{description}</p>
            <div className="mb-3"></div>
          </>
        )}
      </div>
      <div className={clsx(!dense && 'mt-5')}>{children}</div>
    </>
  );
}
