import H2 from '@/components/Heading/H2';
import React from 'react';

interface SectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export default function Section({
  title,
  description,
  children,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <>
      <H2 className="text-primary">{title}</H2>
      {description && <p className="mt-[20px] italic text-primary">{description}</p>}
      <div className="mt-[30px]">{children}</div>
    </>
  );
}
