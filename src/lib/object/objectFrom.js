import { getUniqKeyName } from "./getUniqKeyName.js";

export const objectFrom = (arr) =>
  arr.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [getUniqKeyName(acc, key)]: value,
    }),
    {},
  );
