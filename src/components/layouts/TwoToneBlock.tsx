import clsx from 'clsx';

import Container from '../Container';

export default function TwoToneBlock({
  className,
  reverse,
  left,
  right,
  bgLeft,
  bgRight,
  breakpoint,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
  bgLeft?: React.ReactNode;
  bgRight?: React.ReactNode;
  reverse?: boolean;
  breakpoint?: 'md' | 'lg';
  className?: {
    root?: string;
    bgLeft?: string;
    bgRight?: string;
    container?: string;
    bg?: string;
    mbLeft?: string;
    mbRight?: string;
    separator?: string;
  };
}) {
  return (
    <div className={clsx('relative overflow-hidden', className?.root)}>
      <div
        className={clsx(
          'absolute inset-0 flex',
          breakpoint === 'lg' ? 'max-lg:hidden' : 'max-md:hidden',
          className?.bg
        )}
      >
        {reverse ? (
          <>
            <div className={clsx('flex-1', className?.bgRight)}>{bgRight}</div>
            <div className={clsx('flex-1', className?.bgLeft)}>{bgLeft}</div>
          </>
        ) : (
          <>
            <div className={clsx('flex-1', className?.bgLeft)}>{bgLeft}</div>
            <div className={clsx('flex-1', className?.bgRight)}>{bgRight}</div>
          </>
        )}
      </div>
      <div className={clsx(breakpoint === 'lg' ? 'lg:hidden' : 'md:hidden')}>
        <div className={clsx(className?.bgLeft, className?.mbLeft)}>{left}</div>
        <div className={clsx(className?.bgRight, className?.mbRight)}>{right}</div>
      </div>
      <div className={clsx(breakpoint === 'lg' ? 'max-lg:hidden' : 'max-md:hidden')}>
        <Container className={className?.container}>
          <div className="relative flex items-center">
            <div className="flex-1">{left}</div>
            <div className={clsx('px-[3%]', className?.separator)}></div>
            <div className="flex-1">{right}</div>
          </div>
        </Container>
      </div>
    </div>
  );
}
