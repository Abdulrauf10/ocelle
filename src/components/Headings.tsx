import clsx from 'clsx';

interface HeadingsProps {
  id?: string;
  className?: string;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  styles: 'h1' | 'h2';
  weight?: 'light' | 'normal' | 'bold';
}

export default function Headings({
  id,
  tag,
  styles,
  className,
  weight,
  children,
}: React.PropsWithChildren<HeadingsProps>) {
  const Tag = `${tag}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      id={id}
      className={clsx(
        weight === 'light' ? 'font-light' : weight === 'normal' ? 'font-normal' : 'font-bold',
        styles === 'h2'
          ? 'text-[26px] leading-[34px]'
          : 'text-[3vw] leading-[1.2em] max-3xl:text-[3.2vw] max-xl:text-[3.6vw] max-lg:text-[4.2vw] max-md:text-[36px] max-xs:text-[32px]',
        className
      )}
    >
      {children}
    </Tag>
  );
}
