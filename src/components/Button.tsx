import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import DogFoot from './DogFoot';

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

function ButtonIcon() {
  return (
    <div className="absolute right-[15px] top-1/2 -translate-y-1/2">
      <DogFoot className="w-[25px] fill-white" />
    </div>
  );
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
    'relative inline-block cursor-pointer rounded-[30px] bg-secondary py-[10px] pl-[25px] pr-[50px] text-center text-lg font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#EA6A00]',
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
        <ButtonIcon />
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
      <ButtonIcon />
      {children}
    </button>
  );
}
