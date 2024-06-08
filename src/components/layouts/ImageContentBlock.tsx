import clsx from 'clsx';
import Image from 'next/image';

import Container from '../Container';
import Block from './Block';

export default function ImageContentBlock({
  image,
  alt,
  reverse,
  className,
  children,
  startAdornment,
  endAdornment,
  breakpoint,
}: React.PropsWithChildren<{
  image: string;
  alt: string;
  className?: {
    block?: string;
    container?: string;
    image?: string;
  };
  reverse?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  breakpoint?: 'sm' | 'md';
}>) {
  return (
    <Block className={className?.block}>
      <Container className={className?.container}>
        {startAdornment}
        <div
          className={clsx(
            'flex flex-wrap items-center',
            reverse && 'flex-row-reverse',
            reverse && (breakpoint === 'sm' ? 'max-sm:flex-col' : 'max-md:flex-col')
          )}
        >
          <div className={clsx('w-1/2', breakpoint === 'sm' ? 'max-sm:w-full' : 'max-md:w-full')}>
            <div
              className={clsx('relative overflow-hidden rounded-[30px] pt-[80%]', className?.image)}
            >
              <Image alt={alt} src={image} fill />
            </div>
          </div>
          <div
            className={clsx(
              'w-1/2 md:px-[clamp(28px,4vw,80px)]',
              reverse ? 'pr-6' : 'pl-6',
              breakpoint === 'sm'
                ? 'max-sm:w-full max-sm:px-0 max-sm:pt-[30px]'
                : 'max-md:w-full max-md:px-0 max-md:pt-[30px]'
            )}
          >
            {children}
          </div>
        </div>
        {endAdornment}
      </Container>
    </Block>
  );
}
