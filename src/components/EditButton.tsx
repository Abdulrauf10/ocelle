import clsx from 'clsx';
import Pen from './icons/Pen';

interface EditButtonProps {
  className?: string;
  onClick(): void;
}

export default function EditButton({ className, onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      className={clsx('inline-flex items-center text-primary [&:hover_span]:underline', className)}
      onClick={onClick}
    >
      <span className="font-bold uppercase">Edit</span>
      <Pen className="ml-1.5 w-4" />
    </button>
  );
}
