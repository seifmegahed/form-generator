export function emptyToUndefined(val: unknown) {
  return val === "" ? undefined : val;
}
