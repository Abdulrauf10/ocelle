import IconProps from './Icon';

export default function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 10.94 5.3" className={className}>
      <polyline
        className="fill-none stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="10.44 .5 7.96 2.65 5.47 4.8 2.99 2.65 .5 .5"
      />
    </svg>
  );
}
