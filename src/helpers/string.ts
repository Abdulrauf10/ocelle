import countryCodes from 'country-codes-list';

function stringToBoolean(string?: string) {
  if (string == null) {
    return undefined;
  }
  if (string.toUpperCase() === 'Y' || string === '1') {
    return true;
  }
  return false;
}

function booleanToString(bool?: boolean) {
  if (bool == null) {
    return undefined;
  }
  if (bool) {
    return 'Y';
  }
  return 'N';
}

function getCountryCodes() {
  return countryCodes
    .all()
    .map(({ countryCallingCode }) => countryCallingCode)
    .filter((value, index, self) => index === self.findIndex((code) => code === value))
    .sort();
}

export { stringToBoolean, booleanToString, getCountryCodes };
