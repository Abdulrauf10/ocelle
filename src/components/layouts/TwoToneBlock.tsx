import clsx from 'clsx';

import Container from '../Container';

export default function TwoToneBlock({
  className,
  reverse,
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
  reverse?: boolean;
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
      <div className={clsx('absolute -inset-full flex max-md:hidden', className?.bg)}>
        {reverse ? (
          <>
            <div className={clsx('flex-1', className?.bgRight)}></div>
            <div className={clsx('flex-1', className?.bgLeft)}></div>
          </>
        ) : (
          <>
            <div className={clsx('flex-1', className?.bgLeft)}></div>
            <div className={clsx('flex-1', className?.bgRight)}></div>
          </>
        )}
      </div>
      <div className="md:hidden">
        <div className={clsx(className?.bgLeft, className?.mbLeft)}>{left}</div>
        <div className={clsx(className?.bgRight, className?.mbRight)}>{right}</div>
      </div>
      <div className="max-md:hidden">
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
