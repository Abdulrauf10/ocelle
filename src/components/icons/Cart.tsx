import IconProps from './Icon';

export default function Cart({ className, count }: IconProps & { count: number }) {
  return (
    <svg viewBox="0 0 70 70" className={className}>
      <circle className="fill-secondary stroke-0" cx="35" cy="35" r="35" />
      <path
        className="fill-white stroke-0"
        d="M23.82,46.32c-2.44,0-4.41,1.98-4.41,4.42s1.98,4.42,4.41,4.42,4.42-1.98,4.42-4.42-1.98-4.42-4.42-4.42Z"
      />
      <path
        className="fill-white stroke-0"
        d="M41.11,46.32c-2.44,0-4.42,1.98-4.42,4.42s1.98,4.42,4.42,4.42,4.42-1.98,4.42-4.42-1.98-4.42-4.42-4.42Z"
      />
      <path
        className="fill-white stroke-0"
        d="M59.78,17.48h-2.82c-1.76,0-3.34,1.11-3.94,2.77l-2.21,6.16h-7.35c0,.16.02.31.02.47,0,5.58-4.52,10.1-10.1,10.1s-10.1-4.52-10.1-10.1c0-.16.02-.31.02-.47h-8.51c-1.6,0-2.74,1.54-2.29,3.07l5.36,18.13c.04.14.1.27.16.4,1.03-2.17,3.23-3.68,5.79-3.68,3.05,0,5.6,2.14,6.25,4.99h4.8c.64-2.85,3.2-4.99,6.24-4.99,2.55,0,4.76,1.51,5.78,3.67l9.51-26.54c.08-.24.31-.4.56-.4h2.82c.66,0,1.19-.54,1.19-1.19v-1.19c0-.66-.53-1.19-1.19-1.19Z"
      />
      <path
        className="fill-none stroke-white"
        strokeMiterlimit={10}
        d="M25.24,26.28c0,4.5,3.65,8.15,8.15,8.15s8.15-3.65,8.15-8.15-3.65-8.15-8.15-8.15-8.15,3.65-8.15,8.15Z"
      />
      <text
        x="50%"
        textAnchor="middle"
        className="fill-white font-jost text-[11px]"
        transform="translate(-1.5 30.12)"
      >
        <tspan y="0">{count}</tspan>
      </text>
    </svg>
  );
}
