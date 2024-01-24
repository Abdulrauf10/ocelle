import IconProps from './Icon';

export default function Phone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 11.7 20.25" className={className}>
      <path
        className="fill-white stroke-0"
        d="M11.7,18.98c0,.7-.64,1.27-1.43,1.27H1.37c-.79,0-1.37-.57-1.37-1.27V1.27C0,.57.59,0,1.37,0h8.91c.79,0,1.43.57,1.43,1.27v17.72Z"
      />
      <rect className="fill-primary stroke-0" x="1.27" y="1.58" width="9.17" height="14.87" />
      <circle className="fill-primary stroke-0" cx="5.85" cy="17.95" r=".79" />
    </svg>
  );
}
