'use client';

import React from 'react';

import SectionBlock from './SectionBlock';
import SectionHr from './SectionHr';

import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';

interface SectionBlockProps {
  className?: string;
  title?: React.ReactNode;
}

export default function CollapseBlock({
  className,
  title,
  children,
}: React.PropsWithChildren<SectionBlockProps>) {
  const [open, setOpen] = React.useState(true);

  return (
    <SectionBlock className={className}>
      <div className="item-center -mx-2 flex">
        <div className="flex-1 px-2">{title}</div>
        <button className="px-2" onClick={() => setOpen(!open)}>
          {open ? <Sub className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <>
          <SectionHr />
          {children}
        </>
      )}
    </SectionBlock>
  );
}
