import Block from './Block';
import Container from '../Container';
import clsx from 'clsx';
import Image from 'next/image';

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
              className={clsx(
                'relative overflow-hidden rounded-[30px] pt-[80%] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]',
                className?.image
              )}
            >
              <Image alt={alt} src={image} fill />
            </div>
          </div>
          <div
            className={clsx(
              'w-1/2 px-[4vw]',
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
