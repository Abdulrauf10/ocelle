import { RichTranslationValues } from 'next-intl';

const defaultTranslationValues: RichTranslationValues = {
  i: (chunks) => <i>{chunks}</i>,
  b: (chunks) => <b>{chunks}</b>,
  br: () => <br />,
  sup: (chunks) => <sup>{chunks}</sup>,
  sub: (chunks) => <sub>{chunks}</sub>,
  nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
  block: (chunks) => <span className="inline-block">{chunks}</span>,
};

export default defaultTranslationValues;
