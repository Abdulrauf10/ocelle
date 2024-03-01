export function getNumericEnumValues<T>(o: { [s: string]: T } | ArrayLike<T>) {
  return Object.values(o).filter((v) => typeof v === 'number');
}
