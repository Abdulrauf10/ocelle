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
        <h2 className="heading-4 mb-4 font-bold text-primary">{title}</h2>
        {description && <p className="body-3 mb-2 italic text-primary">{description}</p>}
      </div>
      <div className={clsx(!dense && 'mt-4')}>{children}</div>
    </>
  );
}
