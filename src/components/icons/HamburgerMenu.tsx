import IconProps from './Icon';

export default function HamburgerMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 26 20" className={className}>
      <title>Hamburger Menu</title>
      <line stroke="#333333" strokeLinecap="round" strokeWidth="2" x1={1} x2={25} y1={1} y2={1} />
      <line stroke="#333333" strokeLinecap="round" strokeWidth="2" x1={1} x2={25} y1={10} y2={10} />
      <line stroke="#333333" strokeLinecap="round" strokeWidth="2" x1={1} x2={25} y1={19} y2={19} />
    </svg>
  );
}
