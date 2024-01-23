import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import DogFoot from './icons/DogFoot';

interface ButtonBaseProps {
  className?: string;
  reverse?: boolean;
  fullWidth?: boolean;
}

interface ButtonProps extends ButtonBaseProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
}

interface LinkbuttonProps extends ButtonBaseProps {
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function ButtonIcon() {
  return <DogFoot className="ml-2 w-6 fill-current" />;
}

export default function Button({
  children,
  className,
  onClick,
  reverse,
  fullWidth,
  ...props
}: React.PropsWithChildren<ButtonProps | LinkbuttonProps>) {
  const buttonProps = props as ButtonProps;
  const linkProps = props as LinkbuttonProps;
  const classes = clsx(
    'items-center justify-center cursor-pointer rounded-[30px] py-1.5 px-6 text-center text-lg font-bold border border-secondary',
    'transition-all duration-300 ease-in-out',
    fullWidth ? 'flex w-full' : 'inline-flex',
    reverse
      ? 'bg-white text-secondary hover:bg-gray hover:bg-opacity-5 hover:border-gray'
      : 'bg-secondary text-white hover:bg-[#EA6A00] hover:border-[#EA6A00]',
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
        <ButtonIcon />
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
      <ButtonIcon />
    </button>
  );
}
