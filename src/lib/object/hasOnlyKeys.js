import { omit } from "./omit.js";

export const hasOnlyKeys = (obj, allowed) =>
  Object.keys(omit(obj, allowed)).length === 0;
