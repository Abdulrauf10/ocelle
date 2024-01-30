import Block from '@/components/Block';
import Container from '@/components/Container';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface SectionProps {
  image: string;
  alt: string;
  className?: string;
  reverse?: boolean;
  heading?: React.ReactNode;
}

export default function Section({
  image,
  alt,
  reverse,
  className,
  children,
  heading,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <Block className={className}>
      <Container>
        {heading}
        <div
          className={clsx(
            'flex flex-wrap items-center',
            reverse && 'flex-row-reverse max-sm:flex-col'
          )}
        >
          <div className="w-1/2 max-sm:w-full">
            <div className="relative overflow-hidden rounded-[30px] pt-[80%] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]">
              <Image alt={alt} src={image} fill />
            </div>
          </div>
          <div className="w-1/2 px-[4vw] max-sm:w-full max-sm:px-[30px] max-sm:pt-[30px]">
            {children}
          </div>
        </div>
      </Container>
    </Block>
  );
}
