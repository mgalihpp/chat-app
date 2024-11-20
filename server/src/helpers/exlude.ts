/**
 * Exclude one or more keys from an object.
 * @param obj - The object from which to exclude keys.
 * @param keys - The keys to exclude.
 * @returns The object with the specified keys excluded.
 */
export function exclude<Obj, Key extends keyof Obj>(
  obj: Obj,
  keys: Key[]
): Obj {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}
