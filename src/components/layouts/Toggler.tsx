'use client';

import Collapse from '@mui/material/Collapse';
import clsx from 'clsx';
import React from 'react';

import Plus from '../icons/Plus';
import Sub from '../icons/Sub';

export default function Toggler({
  title,
  className,
  children,
}: {
  title: React.ReactNode;
  className?: { root?: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={clsx(
        'sh rounded-[20px] border border-gray bg-white px-8 py-6 shadow-black/20 drop-shadow-style-2 max-md:p-6',
        className?.root
      )}
      onClick={() => setOpen(!open)}
    >
      <div className="relative flex max-md:items-center">
        <div className="flex-1">{title}</div>
        <button className="right-3 top-3 ml-3 max-sm:absolute">
          {open ? <Sub className="w-4" /> : <Plus className="w-4" />}
        </button>
      </div>
      <Collapse in={open}>
        <hr className="my-4 border-gray" />
        <div className="mb-2 mt-6">{children}</div>
      </Collapse>
    </div>
  );
}
