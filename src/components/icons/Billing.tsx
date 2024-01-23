import IconProps from './Icon';

export default function Billing({ className }: IconProps) {
  return (
    <svg viewBox="0 0 35.79 44.47" className={className}>
      <path
        className="fill-brown stroke-0"
        d="M34.19,35.17c0,4.25-3.46,7.71-7.71,7.71H1.59V9.3C1.59,5.05,5.05,1.59,9.3,1.59h24.89v33.57h0ZM0,9.3v35.17h26.49c5.13,0,9.3-4.17,9.3-9.3V0H9.3C4.17,0,0,4.17,0,9.3"
      />
      <polygon
        className="fill-brown stroke-0"
        points="30.02 14.4 17.27 14.4 17.27 16 30.02 16 30.02 14.4 30.02 14.4"
      />
      <polygon
        className="fill-brown stroke-0"
        points="5.77 32.93 5.77 34.52 30.02 34.52 30.02 32.93 5.77 32.93 5.77 32.93"
      />
      <polygon
        className="fill-brown stroke-0"
        points="5.77 23.54 5.77 25.14 30.02 25.14 30.02 23.54 5.77 23.54 5.77 23.54"
      />
      <text
        className="fill-brown font-jost stroke-0 text-[12.64px] font-bold"
        transform="translate(5.68 19.47)"
      >
        <tspan x="0" y="0">
          $
        </tspan>
      </text>
    </svg>
  );
}
