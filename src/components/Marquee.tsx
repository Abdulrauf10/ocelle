import clsx from 'clsx';
import Image from 'next/image';
import FastMarquee from 'react-fast-marquee';

export default function Marquee({
  className,
  items,
}: {
  className?: string;
  items: Array<{
    icon: string;
    alt: string;
    width: number;
    height: number;
    title: React.ReactNode;
  }>;
}) {
  const _items = [...items, ...items, ...items];

  return (
    <FastMarquee className={clsx('bg-primary py-2', className)}>
      {_items.map((item, idx) => (
        <div key={idx} className="flex flex-nowrap items-center px-6 text-white">
          <div className="mr-3">
            <Image
              src={item.icon}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="eager"
            />
          </div>
          <div className="body-1 whitespace-nowrap">{item.title}</div>
        </div>
      ))}
    </FastMarquee>
  );
}
