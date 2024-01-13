interface BackProps {
  onClick(): void;
}

export default function Back({ onClick }: BackProps) {
  return (
    <button
      className="flex select-none items-center text-lg text-primary"
      onClick={() => onClick()}
    >
      <i className="relative -top-px mr-1 inline-block rotate-[135deg] border-[length:0_1px_1px_0] border-primary p-1"></i>
      Back
    </button>
  );
}
