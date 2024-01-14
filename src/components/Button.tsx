import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import DogFoot from './Icon/DogFoot';

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
  return <DogFoot className="ml-2 w-6 fill-white" />;
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
    'inline-flex items-center cursor-pointer rounded-[30px] bg-secondary py-2 px-6 text-center text-lg font-bold text-white',
    'transition-all duration-300 ease-in-out hover:bg-[#EA6A00]',
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
