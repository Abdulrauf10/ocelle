import Image from 'next/image';

interface MarqueeContentProps {
  icon: string;
  alt: string;
  width: number;
  height: number;
}

export default function MarqueeContent({
  icon,
  alt,
  width,
  height,
  children,
}: React.PropsWithChildren<MarqueeContentProps>) {
  return (
    <div className="flex flex-nowrap items-center px-[25px] text-[20px] text-white">
      <div className="mr-[10px]">
        <Image src={`/feature/${icon}`} alt={alt} width={width} height={height} />
      </div>
      <div className="whitespace-nowrap">{children}</div>
    </div>
  );
}
