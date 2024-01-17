import clsx from 'clsx';

interface PriceProps {
  className?: string;
  value: number;
  discount?: boolean;
}

export default function Price({ value, discount, className }: PriceProps) {
  if (discount) {
    return <span className={clsx('text-[#f00] line-through', className)}>${value}</span>;
  }
  return <span className={clsx('text-[#269D9E]', className)}>${value}</span>;
}
