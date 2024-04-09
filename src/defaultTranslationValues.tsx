import { RichTranslationValues } from 'next-intl';

const defaultTranslationValues: RichTranslationValues = {
  important: (chunks) => <b>{chunks}</b>,
  nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
  inlineBlock: (chunks) => <span className="inline-block">{chunks}</span>,
};

export default defaultTranslationValues;
