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
        <h2 className="heading-3 font-bold text-primary">{title}</h2>
        {description && <p className="mt-5 italic text-primary">{description}</p>}
      </div>
      <div className={dense ? 'mt-4' : 'mt-8'}>{children}</div>
    </>
  );
}
