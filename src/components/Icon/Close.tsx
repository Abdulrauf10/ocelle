import IconProps from './Icon';

export default function Close({ className }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" className={className}>
      <title>Close</title>
      <circle className="fill-primary stroke-0" cx="7" cy="7" r="7" />
      <line
        className="fill-none stroke-white"
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="9.83"
        y1="4.3"
        x2="4.17"
        y2="9.96"
      />
      <line
        className="fill-none stroke-white"
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="9.83"
        y1="9.96"
        x2="4.17"
        y2="4.3"
      />
    </svg>
  );
}
