export function formatCurrency(number: number) {
  return number.toLocaleString('yue-Hant-HK', {
    currencyDisplay: 'narrowSymbol',
    style: 'currency',
    currency: 'HKD',
  });
}
