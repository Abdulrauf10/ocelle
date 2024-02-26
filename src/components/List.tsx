import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface ListProps {
  className?: {
    list?: string;
    listItem?: string;
  };
  picture?: ReactNode;
  items: ReactNode[];
}

export default function List({ className, picture, items }: ListProps) {
  const t = useTranslations();
  return (
    <ul className={clsx('list-none', className?.list)}>
      {items.map((item, idx) => {
        return (
          <li key={idx} className={clsx('mx-0 my-2.5 flex items-start', className?.listItem)}>
            <div>{picture}</div>
            <div>{t(item)}</div>
          </li>
        );
      })}
    </ul>
  );
}
