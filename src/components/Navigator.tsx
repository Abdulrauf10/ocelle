import Link from 'next/link';

export default function Navigator() {
  return (
    <ul className="flex flex-row max-xl:mx-0 max-xl:flex-col max-xl:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
      <li>
        <Link href="/how-works" className="block px-4 py-2">
          How It Works
        </Link>
      </li>
      <li>
        <Link href="/recipes" className="block px-4 py-2">
          Recipes
        </Link>
      </li>
      <li>
        <Link href="/why-fresh" className="block px-4 py-2">
          Why Fresh?
        </Link>
      </li>
      <li>
        <Link href="/faq" className="block px-4 py-2">
          FAQ
        </Link>
      </li>
      <li>
        <Link href="#" className="block px-4 py-2">
          Reviews
        </Link>
      </li>
      <li>
        <Link href="/about-us" className="block px-4 py-2">
          About Us
        </Link>
      </li>
    </ul>
  );
}
