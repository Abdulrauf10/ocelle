import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  className?: string;
}

interface LinkbuttonProps extends ButtonProps {
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
}

export default function Button({
  children,
  className,
  ...props
}: React.PropsWithChildren<ButtonProps | LinkbuttonProps>) {
  const linkProps = props as LinkbuttonProps;
  const classes = clsx(
    'inline-block cursor-pointer rounded-[30px] bg-secondary bg-dogfoot-icon bg-[length:25px_auto] bg-[center_right_15px] bg-no-repeat py-[10px] pl-[25px] pr-[50px] text-center text-[18px] font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#EA6A00]',
    className
  );

  if (linkProps.href) {
    return (
      <Link href={linkProps.href} className={classes} target={linkProps.target}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
