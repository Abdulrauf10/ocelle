import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Navigator() {
  const t = useTranslations('general');

  return (
    <ul className="flex flex-row justify-center max-lg:mx-0 max-lg:flex-col max-lg:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
      <li>
        <Link href="/account/plan" className="block px-4 py-2">
          {t('my-plan')}
        </Link>
      </li>
      <li>
        <Link href="/account" className="block px-4 py-2">
          {t('my-info')}
        </Link>
      </li>
      <li>
        <Link href="#" className="block px-4 py-2">
          {t('refer-a-friend')}
        </Link>
      </li>
      <li>
        <Link href="/faq" className="block px-4 py-2 uppercase">
          {t('faq')}
        </Link>
      </li>
    </ul>
  );
}
