interface SectionBreakProps {
  half?: boolean;
}

export default function SectionBreak({ half }: SectionBreakProps) {
  return <div className={half ? 'mt-10' : 'mt-24'}></div>;
}
