import { RichTranslationValues } from 'next-intl';

const defaultTranslationValues: RichTranslationValues = {
  i: (chunks) => <i>{chunks}</i>,
  b: (chunks) => <b>{chunks}</b>,
  br: () => <br />,
  dtbr: () => <br className="max-xl:hidden" />,
  smbrhidden: () => <br className="sm:hidden" />,
  mobilebronly: () => <br className="sm:hidden" />,
  lgbrdisplay: () => <br className=" max-lg:hidden" />,
  sup: (chunks) => <sup className="body-4 inline-block">{chunks}</sup>,
  //TODO Change style to tailwind
  sbr: () => <br className="max-md:hidden xl:hidden" />,
  d2t1m2: () => <br className="hidden max-md:block xl:block" />,
  runonadddash: () => <span className="display max-md:hidden xl:hidden"> — </span>,
  csup: (chunks) => (
    <sup className="body-4 inline-block" style={{ fontWeight: 400 }}>
      {chunks}
    </sup>
  ),
  ctsup: (chunks) => (
    <sup className="body-4 !top-[-0.8em] inline-block" style={{ fontWeight: 400, top: '-0.8em' }}>
      {chunks}
    </sup>
  ),
  sub: (chunks) => <sub className="body-4 inline-block">{chunks}</sub>,
  nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
  block: (chunks) => <span className="inline-block">{chunks}</span>,
  tabletblockonly: (chunks) => <span className="sm:inline-block lg:inline">{chunks}</span>,
  mbblock: (chunks) => <span className="inline max-sm:inline-block">{chunks}</span>,
  baskerville: (chunks) => (
    <span className="relative -top-[4px] font-baskerville font-bold">{chunks}</span>
  ),
  apos1: () => <span style={{ marginRight: '-.14em' }}>’</span>,
  apos2: () => <span style={{ marginRight: '-.1em' }}>&apos;</span>,
  bold: (chunks) => <span className="font-normal">{chunks}</span>,
  medium: (chunks) => <span className="font-medium">{chunks}</span>,
};

export default defaultTranslationValues;
