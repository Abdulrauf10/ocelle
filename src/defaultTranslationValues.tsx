import { RichTranslationValues } from 'next-intl';

const defaultTranslationValues: RichTranslationValues = {
  i: (chunks) => <i>{chunks}</i>,
  b: (chunks) => <b>{chunks}</b>,
  br: () => <br />,
  dtbr: () => <br className="max-xl:hidden" />,
  sup: (chunks) => <sup className="body-4 inline-block">{chunks}</sup>,
  //TODO Change style to tailwind
  csup: (chunks) => (
    <sup className="body-4 inlinse-block" style={{ fontWeight: 400 }}>
      {chunks}
    </sup>
  ),
  ctsup: (chunks) => (
    <sup className="body-4 inlinse-block !top-[-0.8em]" style={{ fontWeight: 400, top: '-0.8em' }}>
      {chunks}
    </sup>
  ),
  sub: (chunks) => <sub className="body-4 inline-block">{chunks}</sub>,
  nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
  block: (chunks) => <span className="inline-block">{chunks}</span>,
  mbblock: (chunks) => <span className="inline max-sm:inline-block">{chunks}</span>,
  baskerville: (chunks) => (
    <span className="relative -top-px font-baskerville font-bold">{chunks}</span>
  ),
  apos1: () => <span style={{ marginRight: '-.14em' }}>’</span>,
  apos2: () => <span style={{ marginRight: '-.14em' }}>&apos;</span>,
  bold: (chunks) => <span className="font-normal">{chunks}</span>,
  medium: (chunks) => <span className="font-medium">{chunks}</span>,
};

export default defaultTranslationValues;
