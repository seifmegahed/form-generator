export function emptyToUndefined(val: unknown) {
  return val === "" ? undefined : val;
}

export function emptyToNull(val: unknown) {
  return val === "" ? null : val;
}
