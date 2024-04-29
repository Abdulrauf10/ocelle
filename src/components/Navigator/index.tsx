import { useTranslations } from 'next-intl';
import React from 'react';

import PageDropdown from './PageDropdown';
import PageLink from './PageLink';

export default function Navigator() {
  const t = useTranslations('Navigator');

  return (
    <ul className="flex flex-row flex-wrap max-lg:mx-0 max-lg:flex-col max-lg:text-center [&_li]:list-none">
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
        <PageLink href="/why-fresh" name={t('why-fresh')} />
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
