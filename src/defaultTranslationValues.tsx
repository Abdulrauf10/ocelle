import { RichTranslationValues } from 'next-intl';

const defaultTranslationValues: RichTranslationValues = {
  i: (chunks) => <i>{chunks}</i>,
  b: (chunks) => <b>{chunks}</b>,
  br: () => <br />,
  sup: (chunks) => <sup className="body-4 inline-block">{chunks}</sup>,
  sub: (chunks) => <sub className="body-4 inline-block">{chunks}</sub>,
  nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
  block: (chunks) => <span className="inline-block">{chunks}</span>,
  baskerville: (chunks) => (
    <span className="relative -top-px font-baskerville font-bold">{chunks}</span>
  ),
  apos1: () => <span style={{ marginRight: '-.13em' }}>’</span>,
  apos2: () => <span style={{ marginRight: '-.13em' }}>&apos;</span>,
  bold: (chunks) => <span className="font-bold">{chunks}</span>,
};

export default defaultTranslationValues;
