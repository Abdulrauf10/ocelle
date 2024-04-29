import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Pen from '../icons/Pen';

import { Link } from '@/navigation';

interface EditButtonProps {
  href?: string;
  className?: string;
  onClick?(e: React.MouseEvent<HTMLElement>): void;
}

export default function EditButton({ className, href, onClick }: EditButtonProps) {
  const t = useTranslations();
  const classes = clsx('inline-flex items-center text-primary [&:hover_span]:underline', className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        <span className="font-bold uppercase">{t('edit')}</span>
        <Pen className="ml-1.5 w-[1em]" />
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      <span className="font-bold uppercase">{t('edit')}</span>
      <Pen className="ml-1.5 w-[1em]" />
    </button>
  );
}
