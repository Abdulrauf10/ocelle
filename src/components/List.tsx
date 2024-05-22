import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

interface ListProps {
  className?: {
    root?: string;
    row?: string;
    item?: string;
  };
  picture?: ReactNode;
  items: ReactNode[];
}

export default function List({ className, picture, items }: ListProps) {
  const t = useTranslations();
  return (
    <ul className={clsx('list-none', className?.root)}>
      {items.map((item, idx) => {
        return (
          <li key={idx} className={clsx('mx-0 my-2.5 flex items-start', className?.row)}>
            <div>{picture}</div>
            <div className={clsx('w-[calc(100%_-_40px)]', className?.item)}>{item}</div>
          </li>
        );
      })}
    </ul>
  );
}
