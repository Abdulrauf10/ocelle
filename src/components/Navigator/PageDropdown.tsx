'use client';

import React from 'react';
import ArrowDown from '../icons/ArrowDown';
import { Link, usePathname } from '@/navigation';

interface PageDropdownProps {
  name: string;
  items: Array<{
    name: string;
    href: string;
  }>;
}

export default function PageDropdown({ name, items }: PageDropdownProps) {
  const pathname = usePathname();
  const id = React.useId();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if ((e.target as HTMLElement).closest(`[data-id="${id}"]`) == null) {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener('click', handleClick);
    }
    return () => window.removeEventListener('click', handleClick);
  });

  return (
    <div data-id={id} className="relative inline-block">
      <button
        className="flex cursor-pointer items-center px-4 py-2 hover:text-primary hover:underline"
        onClick={() => setOpen(!open)}
      >
        {name}
        <ArrowDown className="ml-1.5 w-3" />
      </button>
      {open && (
        <div className="absolute top-full bg-white bg-opacity-80 px-4 py-2 max-lg:static max-lg:bg-transparent">
          <ul className="-my-0.5 max-lg:-my-1 [&_li]:list-none">
            {items.map((item, idx) => {
              return (
                <li key={idx} className="py-0.5 max-lg:py-1">
                  <Link
                    href={item.href}
                    className="block whitespace-nowrap hover:text-primary hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
