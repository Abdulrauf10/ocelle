import clsx from 'clsx';
import React from 'react';

import DogFoot from '../icons/DogFoot';

import { Link } from '@/navigation';

interface ButtonBaseProps {
  fontSize?: 'normal' | 'small';
  theme?: 'primary' | 'secondary' | 'red' | 'yellow' | 'green' | 'dark-green';
  className?: string;
  reverse?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  iconNotNeed?: boolean;
}

interface ButtonProps extends ButtonBaseProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
}

interface LinkbuttonProps extends ButtonBaseProps {
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLAnchorElement>;
}

function ButtonIcon() {
  return <DogFoot className="ml-2 w-6 fill-current" />;
}

export default function Button({
  fontSize,
  theme,
  children,
  className,
  onClick,
  onTouchEnd,
  reverse,
  fullWidth,
  disabled,
  ...props
}: React.PropsWithChildren<ButtonProps | LinkbuttonProps>) {
  const buttonProps = props as ButtonProps;
  // check if icon is needed.
  let iconNeed = true;
  const linkProps = props as LinkbuttonProps;
  const baseClasses = clsx(
    'font-open-sans items-center justify-center rounded-[30px] py-2 px-6 text-center font-bold border-2 select-none',
    fullWidth ? 'flex w-full' : 'inline-flex'
  );
  const reverseBaseClasses = clsx('mouse:hover:border-gray');
  const primaryClasses = clsx(
    'border-primary',
    reverse
      ? clsx(reverseBaseClasses, 'bg-white text-primary')
      : 'bg-primary text-white mouse:hover:opacity-85'
  );
  const secondaryClasses = clsx(
    'border-secondary',
    reverse
      ? clsx(reverseBaseClasses, 'bg-white text-secondary')
      : 'bg-secondary text-white mouse:hover:opacity-85'
  );
  const redClasses = clsx(
    'border-how-it-works-red',
    reverse
      ? clsx(reverseBaseClasses, 'bg-white text-how-it-works-red')
      : 'bg-how-it-works-red text-white mouse:hover:opacity-85'
  );
  const yellowClasses = clsx(
    'border-how-it-works-yellow',
    reverse
      ? clsx(reverseBaseClasses, 'bg-white text-how-it-works-yellow')
      : 'bg-how-it-works-yellow text-white mouse:hover:opacity-85'
  );
  const greenClasses = clsx(
    'border-how-it-works-green',
    reverse
      ? clsx(reverseBaseClasses, 'bg-white text-how-it-works-green')
      : 'bg-how-it-works-green text-white mouse:hover:opacity-85'
  );
  const darkGreenClasses = clsx(
    'border-how-it-works-dark-green',
    reverse
      ? clsx(reverseBaseClasses, 'bg-white text-how-it-works-dark-green')
      : 'bg-how-it-works-dark-green text-white mouse:hover:opacity-85'
  );
  const classes = disabled
    ? clsx(
        baseClasses,
        'bg-gray bg-opacity-50 border-[#CDCAC2] text-white pointer-events-none',
        className
      )
    : clsx(
        baseClasses,
        'cursor-pointer transition-all duration-300 ease-in-out',
        theme === 'dark-green'
          ? darkGreenClasses
          : theme === 'green'
            ? greenClasses
            : theme === 'yellow'
              ? yellowClasses
              : theme === 'red'
                ? redClasses
                : theme === 'primary'
                  ? primaryClasses
                  : secondaryClasses,
        className
      );

  if (buttonProps.iconNotNeed) {
    iconNeed = false;
  }
  if (linkProps.href) {
    return (
      <Link
        href={linkProps.href}
        className={classes}
        target={linkProps.target}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        onTouchEnd={onTouchEnd as React.TouchEventHandler<HTMLAnchorElement>}
      >
        <div className={clsx(!fontSize || fontSize === 'normal' ? 'body-1' : 'body-2')}>
          {children}
        </div>
        {iconNeed && <ButtonIcon />}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={buttonProps.type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      onTouchEnd={onTouchEnd as React.TouchEventHandler<HTMLButtonElement>}
      disabled={disabled}
    >
      <div className={clsx(!fontSize || fontSize === 'normal' ? 'body-1' : 'body-2')}>
        {children}
      </div>
      {iconNeed && <ButtonIcon />}
    </button>
  );
}
