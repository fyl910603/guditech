export function isNullOrUndefined(value) {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
}

export function toFixed2(value) {
  if (value !== null || value !== undefined) {
    return value.toFixed(2);
  }
  return '';
}
