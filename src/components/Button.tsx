import clsx from 'clsx';
import React from 'react';
import DogFoot from './icons/DogFoot';
import { Link } from '@/navigation';

interface ButtonBaseProps {
  theme?: 'primary' | 'secondary';
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
  theme,
  children,
  className,
  onClick,
  reverse,
  fullWidth,
  ...props
}: React.PropsWithChildren<ButtonProps | LinkbuttonProps>) {
  const buttonProps = props as ButtonProps;
  const linkProps = props as LinkbuttonProps;
  const primaryClasses = clsx(
    'border-primary',
    reverse
      ? 'bg-white text-primary hover:bg-gray hover:bg-opacity-5 hover:border-gray'
      : 'bg-primary text-white hover:opacity-85'
  );
  const secondaryClasses = clsx(
    'border-secondary',
    reverse
      ? 'bg-white text-secondary hover:bg-gray hover:bg-opacity-5 hover:border-gray'
      : 'bg-secondary text-white hover:opacity-85'
  );
  const classes = clsx(
    'items-center justify-center cursor-pointer rounded-[30px] py-1.5 px-6 text-center text-xl font-bold border',
    'transition-all duration-300 ease-in-out',
    fullWidth ? 'flex w-full' : 'inline-flex',
    theme === 'primary' ? primaryClasses : secondaryClasses,
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
