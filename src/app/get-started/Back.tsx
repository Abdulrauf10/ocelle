interface BackProps {
  onClick(): void;
}

export default function Back({ onClick }: BackProps) {
  return (
    <button
      className="flex select-none items-center text-[18px] text-primary"
      onClick={() => onClick()}
    >
      <i className="mr-1 inline-block rotate-[135deg] border-[length:0_1px_1px_0] border-primary p-[3px]"></i>
      Back
    </button>
  );
}
