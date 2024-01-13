import H2 from '@/components/Heading/H2';
import React from 'react';

interface SectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export default function Section({
  title,
  description,
  className,
  children,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <>
      <div className={className}>
        <H2 className="text-primary" inline>
          {title}
        </H2>
        {description && <p className="mt-5 italic text-primary">{description}</p>}
      </div>
      <div className="mt-8">{children}</div>
    </>
  );
}
