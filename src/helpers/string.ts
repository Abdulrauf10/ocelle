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

export { stringToBoolean, booleanToString };
