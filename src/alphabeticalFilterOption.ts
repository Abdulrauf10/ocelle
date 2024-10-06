import { FilterOptionsState } from '@mui/material';

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
// Give up on IE11 support for this feature
function stripDiacritics(string: string) {
  return typeof string.normalize !== 'undefined'
    ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : string;
}

export default function alphabeticalFilterOption<Value>(
  options: Value[],
  { inputValue, getOptionLabel }: FilterOptionsState<Value>
): Value[] {
  // reference to the source code from
  // https://github.com/mui/material-ui/blob/v5.15.20/packages/mui-base/src/useAutocomplete/useAutocomplete.js#L20-L57
  const input = stripDiacritics(inputValue.toLowerCase());
  if (!input) {
    return options;
  }
  const intermediaryMaps: { [key: string]: string } = {};
  const filteredOptions: Value[] = [];
  for (const option of options) {
    const raw = stripDiacritics(getOptionLabel(option).toLowerCase());
    if (raw.indexOf(input) > -1) {
      filteredOptions.push(option);
      intermediaryMaps[getOptionLabel(option)] = raw;
    }
  }
  // filter the option by starting with the input value and then by alphabetical order
  return filteredOptions.sort((a, b) => {
    const lowerA = intermediaryMaps[getOptionLabel(a)].substring(0, input.length);
    const lowerB = intermediaryMaps[getOptionLabel(b)].substring(0, input.length);

    if (lowerA == input) {
      if (lowerB != input) {
        return -1;
      }
    } else if (lowerB == input) {
      return 1;
    }

    return a < b ? -1 : a > b ? 1 : 0;
  });
}
