'use client';

import { useRouter } from '@/navigation';
import clsx from 'clsx';

export default function ClickableBlock({
  className,
  icon,
  title,
  description,
  href,
  children,
}: React.PropsWithChildren<{
  className?: string;
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  href: string;
}>) {
  const router = useRouter();

  return (
    <div
      className={clsx(
        '-mx-2 flex cursor-pointer items-center rounded-2xl border border-gray bg-white px-4 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]',
        className
      )}
      onClick={() => router.push(href)}
    >
      <div className="flex-1 px-2">
        <div className="-mx-2 flex items-center">
          <div className="px-2">{icon}</div>
          <div className="px-2">
            <div className="text-xl text-brown">{title}</div>
            {description && <div>{description}</div>}
          </div>
        </div>
        {children}
      </div>
      <div className="px-2">
        <button>
          <svg viewBox="0 0 7 13" className="w-2">
            <polyline
              className="fill-none stroke-brown"
              strokeLinecap="round"
              strokeLinejoin="round"
              points=".5 .5 6.5 6.5 .5 12.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
