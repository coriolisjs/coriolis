import { EMPTY, of } from "rxjs";

import { promiseObservable } from "../../../lib/rx/promiseObservable.js";

import "../../init.js";

describe("promiseObservable", () => {
  it("should return an observable from a promise", () => {
    const results = [];
    const { execute, executionPromise } = promiseObservable(() => of("test"));

    execute().subscribe((value) => results.push(value));

    return executionPromise;
  });

  it("should return an observable from a promise", () => {
    const { execute, executionPromise } = promiseObservable(() => EMPTY);

    execute().subscribe();

    return executionPromise;
  });
});
