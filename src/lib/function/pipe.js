import { identity } from "./identity.js";

// We need a pipe function that handles multiple args on first function
export const pipe = (...fn) =>
  fn.slice(1).reduce(
    (acc, fn) => (...args) => fn(acc(...args)),
    fn[0] || identity,
  );
