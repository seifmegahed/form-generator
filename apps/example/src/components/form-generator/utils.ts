import type { FieldDataType } from "./types";

export function reduceDefaultValues<K extends FieldDataType>(
  acc: Record<string, K["default"]>,
  item: K
): Record<string, K["default"]> {
  acc[item.name] = item.default;
  return acc;
}

export function reduceSchema<K extends FieldDataType>(
  acc: Record<string, K["schema"]>,
  item: K
): Record<string, K["schema"]> {
  acc[item.name] = item.schema;
  return acc;
}

export function emptyToUndefined(val: unknown) {
  return val === "" ? undefined : val;
}
