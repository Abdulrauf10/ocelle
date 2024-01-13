import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
}

interface LinkbuttonProps {
  href: string;
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function Button({
  children,
  className,
  onClick,
  ...props
}: React.PropsWithChildren<ButtonProps | LinkbuttonProps>) {
  const buttonProps = props as ButtonProps;
  const linkProps = props as LinkbuttonProps;
  const classes = clsx(
    'inline-block cursor-pointer rounded-[30px] bg-secondary bg-dogfoot-icon bg-[length:25px_auto] bg-[center_right_15px] bg-no-repeat py-[10px] pl-[25px] pr-[50px] text-center text-lg font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#EA6A00]',
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
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={buttonProps.type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  );
}
