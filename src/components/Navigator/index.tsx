import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

import PageDropdown from './PageDropdown';
import PageLink from './PageLink';

export default function Navigator() {
  const t = useTranslations('Navigator');

  return (
    <ul
      className={clsx(
        'flex flex-row flex-wrap [&_li]:list-none',
        'max-xl:lang-zh:mx-0 max-xl:lang-zh:flex-col max-xl:lang-zh:text-center',
        'max-lg:lang-en:mx-0 max-lg:lang-en:flex-col max-lg:lang-en:text-center'
      )}
    >
      <li>
        <PageDropdown
          name={t('how-it-works')}
          items={[
            { name: t('subscription'), href: '/how-it-works/subscription' },
            { name: t('individual-packs'), href: '/how-it-works/individual-pack' },
          ]}
        />
      </li>
      <li>
        <PageLink href="/recipes" name={t('recipes')} />
      </li>
      <li>
        <PageLink href="/why-fresh/benefits-of-fresh-dog-food" name={t('why-fresh')} />
      </li>
      <li className="uppercase">
        <PageLink href="/faq" name={t('faq')} />
      </li>
      {/* <li>
        <PageLink href="/reviews" name={t('reviews')} />
      </li> */}
      <li>
        <PageLink href="/about-us" name={t('about-us')} />
      </li>
    </ul>
  );
}
