import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Navigator() {
  const t = useTranslations('general');

  return (
    <ul className="flex flex-row max-xl:mx-0 max-xl:flex-col max-xl:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
      <li>
        <Link href="/how-works" className="block px-4 py-2">
          {t('how-it-works')}
        </Link>
      </li>
      <li>
        <Link href="/recipes" className="block px-4 py-2">
          {t('recipes')}
        </Link>
      </li>
      <li>
        <Link href="/why-fresh" className="block px-4 py-2">
          {t('why-fresh')}
        </Link>
      </li>
      <li>
        <Link href="/faq" className="block px-4 py-2 uppercase">
          {t('faq')}
        </Link>
      </li>
      <li>
        <Link href="#" className="block px-4 py-2">
          {t('reviews')}
        </Link>
      </li>
      <li>
        <Link href="/about-us" className="block px-4 py-2">
          {t('about-us')}
        </Link>
      </li>
    </ul>
  );
}
