import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

interface ListProps {
  className?: {
    root?: string;
    list?: string;
    row?: string;
    icon?: string;
    item?: string;
  };
  picture?: ReactNode;
  items: ReactNode[];
}

export default function List({ className, picture, items }: ListProps) {
  const t = useTranslations();
  return (
    <div className={className?.root}>
      <ul className={clsx('list-none', className?.list)}>
        {items.map((item, idx) => {
          return (
            <li key={idx} className={clsx('mx-0 flex items-start', className?.row)}>
              <div className={clsx(className?.icon)}>{picture}</div>
              <div className={clsx(className?.item)}>{item}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
