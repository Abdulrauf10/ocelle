import { Link } from '@/navigation';

export default function PageLink({ href, name }: { href: string; name: string }) {
  return (
    <Link href={href} className="block px-4 py-2 hover:text-primary hover:underline">
      {name}
    </Link>
  );
}
