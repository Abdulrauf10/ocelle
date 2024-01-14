import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';

interface ListProps {
  className?: {
    list?: string;
    listItem?: string;
  };
  picture?: ReactNode;
  items: ReactNode[];
}

export default function List({ className, picture, items }: ListProps) {
  return (
    <ul className={clsx('list-none', className?.list)}>
      {items.map((item, idx) => {
        return (
          <li
            key={idx}
            className={clsx('mx-0 my-2.5 flex items-center text-[#be873b]', className?.listItem)}
          >
            {picture}
            <div>{item}</div>
          </li>
        );
      })}
    </ul>
  );
}
