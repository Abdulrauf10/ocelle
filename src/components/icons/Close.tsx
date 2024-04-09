import IconProps from './Icon';

export default function Close({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12.47 12.47" className={className}>
      <title>Close</title>
      <line
        className="fill-none stroke-current stroke-[1.8px]"
        strokeLinejoin="round"
        strokeLinecap="round"
        x1="11.57"
        y1=".9"
        x2=".9"
        y2="11.57"
      />
      <line
        className="fill-none stroke-current stroke-[1.8px]"
        strokeLinejoin="round"
        strokeLinecap="round"
        x1="11.57"
        y1="11.57"
        x2=".9"
        y2=".9"
      />
    </svg>
  );
}
