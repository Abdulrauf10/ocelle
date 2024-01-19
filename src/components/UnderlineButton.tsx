import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface UnderlineButtonBaseProps {
  label: string;
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
  className,
  underline,
  label,
  onClick,
  ...props
}: ButtonProps | LinkbuttonProps) {
  const buttonProps = props as ButtonProps;
  const linkProps = props as LinkbuttonProps;
  const classes = clsx(
    'inline-block text-secondary',
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
