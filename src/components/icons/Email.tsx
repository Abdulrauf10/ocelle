import IconProps from './Icon';

export default function Email({ className }: IconProps) {
  return (
    <svg viewBox="0 0 17.6 12.57" className={className}>
      <path
        className="fill-current stroke-0"
        d="M8.8,8.8l-2.18-1.91L.4,12.23c.23.21.53.34.87.34h15.07c.34,0,.64-.13.86-.34l-6.22-5.34-2.18,1.91Z"
      />
      <path
        className="fill-current stroke-0"
        d="M17.2.34c-.23-.21-.53-.34-.87-.34H1.27c-.34,0-.64.13-.87.34l8.4,7.2L17.2.34Z"
      />
      <polygon className="fill-current stroke-0" points="0 1.1 0 11.55 6.08 6.38 0 1.1" />
      <polygon
        className="fill-current stroke-0"
        points="11.52 6.38 17.6 11.55 17.6 1.1 11.52 6.38"
      />
    </svg>
  );
}
