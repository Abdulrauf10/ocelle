import clsx from 'clsx';

interface PriceProps {
  className?: string;
  value: string | number;
  discount?: boolean;
  dollorSign?: boolean;
}

export default function Price({ value, discount, className, dollorSign = true }: PriceProps) {
  if (discount) {
    return (
      <span className={clsx('text-error line-through', className)}>
        {dollorSign && '$'}
        {value}
      </span>
    );
  }
  return (
    <span className={clsx('text-dark-green', className)}>
      {dollorSign && '$'}
      {value}
    </span>
  );
}
