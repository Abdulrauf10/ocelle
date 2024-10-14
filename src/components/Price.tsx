import clsx from 'clsx';

interface PriceProps {
  className?: string;
  value: string | number;
  discount?: boolean;
}

export default function Price({ value, discount, className }: PriceProps) {
  if (discount) {
    return <span className={clsx('text-error line-through', className)}>{value}</span>;
  }
  return <span className={clsx('text-dark-green', className)}>{value}</span>;
}
