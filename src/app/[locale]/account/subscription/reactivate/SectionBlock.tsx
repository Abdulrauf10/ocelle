import clsx from 'clsx';

interface SectionBlockProps {
  className?: string;
}

export default function SectionBlock({
  className,
  children,
}: React.PropsWithChildren<SectionBlockProps>) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-[720px] rounded-2xl border border-gray bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}
