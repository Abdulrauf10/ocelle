import { ReactNode } from 'react';

interface TickListProps {
  items: ReactNode[];
}

export default function TickList({ items }: TickListProps) {
  return (
    <ul className="list-none">
      {items.map((item, idx) => {
        return (
          <li
            key={idx}
            className="mx-0 my-2.5 bg-[url('./brown-tick.png')] bg-[length:24px_24px] bg-[left_center] bg-no-repeat pl-[35px] text-[#be873b]"
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
}
