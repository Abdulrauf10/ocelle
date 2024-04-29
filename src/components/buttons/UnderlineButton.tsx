import clsx from 'clsx';
import React from 'react';

import { Link } from '@/navigation';

interface UnderlineButtonBaseProps {
  theme?: 'primary' | 'secondary';
  label: React.ReactNode;
  underline?: boolean;
  className?: string;
}

interface ButtonProps extends UnderlineButtonBaseProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
}

interface LinkbuttonProps extends UnderlineButtonBaseProps {
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function UnderlineButton({
  theme,
  className,
  underline,
  label,
  onClick,
  ...props
}: ButtonProps | LinkbuttonProps) {
  const buttonProps = props as ButtonProps;
  const linkProps = props as LinkbuttonProps;
  const classes = clsx(
    'inline-block',
    theme === 'primary' ? 'text-primary' : 'text-secondary',
    underline ? 'underline' : 'hover:underline',
    className
  );

  if (linkProps.href) {
    return (
      <Link
        href={linkProps.href}
        className={classes}
        target={linkProps.target}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={buttonProps.type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {label}
    </button>
  );
}
