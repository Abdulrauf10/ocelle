import IconProps from './Icon';

export default function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20.5 12.27" className={className}>
      <line
        className="fill-none stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        x1=".5"
        y1="6.13"
        x2="18.87"
        y2="6.13"
      />
      <polygon
        className="fill-current stroke-0"
        points="13.9 12.27 12.88 11.17 18.3 6.13 12.88 1.1 13.9 0 20.5 6.13 13.9 12.27"
      />
    </svg>
  );
}
