import Pen from './icons/Pen';

interface EditButtonProps {
  onClick(): void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center text-primary [&:hover_span]:underline"
      onClick={onClick}
    >
      <span className="font-bold uppercase">Edit</span>
      <Pen className="ml-1.5 w-4" />
    </button>
  );
}
