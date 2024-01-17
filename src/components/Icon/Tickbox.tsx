import IconProps from './Icon';

export default function Tickbox({ className }: IconProps) {
  return (
    <svg viewBox="0 0 21.31 21.31" className={className}>
      <rect className="fill-[#be873b] stroke-0" width="21.31" height="21.31" rx="2" ry="2" />
      <path
        className="fill-white stroke-0"
        d="M19.47,4.72c-.26-.4-.69-.63-1.16-.63-.27,0-.53.08-.75.22-4.88,3.16-7.99,7.8-9.46,10.4l-2.48-3.24c-.26-.34-.66-.54-1.1-.54-.31,0-.6.1-.84.28-.29.22-.48.55-.53.92-.05.37.05.73.27,1.02l3.81,4.98c.26.34.67.54,1.1.54.06,0,.11,0,.17-.01.48-.06.91-.37,1.1-.82.03-.07,3.15-7.13,9.46-11.21.31-.2.52-.51.6-.87.08-.36,0-.73-.19-1.04Z"
      />
    </svg>
  );
}
