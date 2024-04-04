export function nativeRound(num: number, decimalPlaces: number = 1) {
  const p = Math.pow(10, decimalPlaces);
  return Math.round(num * p + Number.EPSILON) / p;
}
