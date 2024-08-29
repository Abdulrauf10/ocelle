'use client';

import { useTranslations } from 'next-intl';

import { useReferralDialogContext } from './ReferralDialog';

import { Link } from '@/navigation';

export default function Navigator() {
  const dialog = useReferralDialogContext();
  const n = useTranslations('Navigator');

  return (
    <ul className="flex flex-row justify-center max-xl:mx-0 max-xl:flex-col max-xl:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
      <li>
        <Link href="/account/plan" className="block px-4 py-2">
          {n('my-plan')}
        </Link>
      </li>
      <li>
        <Link href="/account" className="block px-4 py-2">
          {n('my-info')}
        </Link>
      </li>
      <li>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            dialog.openDialog();
          }}
          className="block px-4 py-2"
        >
          {n('refer-a-friend')}
        </Link>
      </li>
      <li>
        <Link href="/faq" className="block px-4 py-2 uppercase">
          {n('faq')}
        </Link>
      </li>
    </ul>
  );
}
