import IconProps from './Icon';

export default function Bell({ className }: IconProps) {
  return (
    <svg viewBox="0 0 30.24 41.55" className={className}>
      <path
        className="fill-none stroke-brown"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={1.6}
        d="M18.75,4.43v2.99c-1.13-.42-2.37-.62-3.63-.62s-2.51.22-3.64.64v-3.01c0-2,1.63-3.63,3.64-3.63,1.01,0,1.9.4,2.56,1.07.66.66,1.07,1.57,1.07,2.56Z"
      />
      <path
        className="fill-none stroke-brown"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={1.6}
        d="M8.56,35.38c.61,3.07,3.32,5.37,6.57,5.37s5.95-2.3,6.55-5.37h-13.12Z"
      />
      <path
        className="fill-none stroke-brown"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={1.6}
        d="M26.09,22.64v-4.92c0-6.03-4.91-10.93-10.97-10.93h0c-6.06,0-10.97,4.89-10.97,10.93v4.92c0,2.21-.38,4.4-1.12,6.48l-2.23,6.26h28.64l-2.23-6.26c-.74-2.08-1.12-4.27-1.12-6.48Z"
      />
    </svg>
  );
}
