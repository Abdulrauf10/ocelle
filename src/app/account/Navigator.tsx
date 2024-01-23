import Link from 'next/link';

export default function Navigator() {
  return (
    <ul className="flex flex-row justify-center max-xl:mx-0 max-xl:flex-col max-xl:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
      <li>
        <Link href="/account/plan" className="block px-4 py-2">
          My Plan
        </Link>
      </li>
      <li>
        <Link href="/account" className="block px-4 py-2">
          My Info
        </Link>
      </li>
      <li>
        <Link href="#" className="block px-4 py-2">
          Refer a Friend
        </Link>
      </li>
      <li>
        <Link href="/faq" className="block px-4 py-2">
          FAQ
        </Link>
      </li>
    </ul>
  );
}
