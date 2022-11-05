import { Observable } from "rxjs";

import { simpleUnsub } from "../simpleUnsub.js";
import { useState } from "../../var/useState.js";

export const countSubscriptions = (callback) => (source) => {
  const { getState, setState } = useState(0);

  const up = () => callback(setState(getState() + 1));
  const down = () => callback(setState(getState() - 1));

  return new Observable((observer) => {
    up();
    const unsub = simpleUnsub(source.subscribe(observer));

    return () => {
      down();
      unsub();
    };
  });
};
