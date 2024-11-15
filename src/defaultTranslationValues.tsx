import { RichTranslationValues } from 'next-intl';
import { individualPackProducts } from './products';

const defaultTranslationValues: RichTranslationValues = {
  i: (chunks) => <i>{chunks}</i>,
  b: (chunks) => <b>{chunks}</b>,
  br: () => <br />,
  dtbr: () => <br className="max-xl:hidden" />,
  smbrhidden: () => <br className="sm:hidden" />,
  mobilebronly: () => <br className="sm:hidden" />,
  freshbr: () => <br className="inline-block max-lg:hidden" />,
  individualheaderbr :()=><br className="inline-block max-lg:hidden" />,
  individualblock9br :()=><br className="inline-block md:hidden" />,
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
  tbr: () => <br className="lg:hidden" />,
  custombr: () => <br className="max-md:hidden md:block lg:hidden xl:block" />,
  xlhiddenbr: () => <br className="xl:hidden" />,
  smhidderbr: () => <br className="sm:hidden" />,
  mbblock: (chunks) => <span className="inline max-sm:inline-block">{chunks}</span>,
  baskerville: (chunks) => (
    <span className="relative -top-[4px] font-baskerville font-bold">{chunks}</span>
  ),
  baskervillefresh: (chunks) => (
    <span className="relative font-baskerville font-bold" style={{ top: '-4px' }}>
      {chunks}
    </span>
  ),
  apos16: () => <span style={{ marginRight: '-.16em' }}>’</span>,
  apos14: () => <span style={{ marginRight: '-.14em' }}>’</span>,
  apos10: () => <span style={{ marginRight: '-.10em' }}>’</span>,
  apos04: () => <span style={{ marginRight: '-.04em' }}>&apos;</span>,
  bold: (chunks) => <span className="font-normal">{chunks}</span>,
  medium: (chunks) => <span className="font-medium">{chunks}</span>,
};

export default defaultTranslationValues;
