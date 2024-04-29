import clsx from 'clsx';

import IconProps from './Icon';

export default function Plus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 13.41 13.41" className={className}>
      <line
        className="fill-none stroke-gray"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.41}
        x1="12.71"
        y1="6.71"
        x2=".71"
        y2="6.71"
      />
      <line
        className="fill-none stroke-gray"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.41}
        x1="6.71"
        y1="12.71"
        x2="6.71"
        y2=".71"
      />
    </svg>
  );
}
