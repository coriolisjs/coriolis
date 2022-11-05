import { from } from "rxjs";

import { asObservable } from "../../../lib/rx/asObservable.js";

import "../../init.js";

describe("asObservable", () => {
  it("should get an observable from an array", () => {
    const results = [];
    asObservable(["a", "b", "c"]).subscribe((value) => results.push(value));

    expect(results).to.deep.equal(["a", "b", "c"]);
  });

  it("should get an observable from a resolved promise", () => {
    const promise = Promise.resolve("value");
    const results = [];
    let completed = false;

    asObservable(promise).subscribe({
      next: (value) => results.push(value),
      error: () => {
        throw new Error("should not get an error");
      },
      complete: () => {
        completed = true;
      },
    });

    // eslint-disable-next-line promise/always-return
    return promise.then(() => {
      expect(results).to.deep.equal(["value"]);
      expect(completed).to.equal(true);
    });
  });

  it("should get an observable from a rejected promise", () => {
    const promise = Promise.reject(new Error("error"));
    const results = [];
    let completed = false;

    asObservable(promise).subscribe({
      next: () => {
        throw new Error("should not get an error");
      },
      error: (error) => results.push(error.message),
      complete: () => {
        completed = true;
      },
    });

    // eslint-disable-next-line promise/always-return
    return promise.then(
      () => {
        throw new Error("should not resolve");
      },
      () => {
        expect(results).to.deep.equal(["error"]);
        expect(completed).to.equal(false);
      },
    );
  });

  it("should get the exact observable from an observable", () => {
    const observable = from(["a", "b"]);

    const resultObservabe = asObservable(observable);

    expect(resultObservabe).to.equal(observable);
  });

  it("should get an observable from a single value", () => {
    const results = [];
    asObservable("value").subscribe((value) => results.push(value));

    expect(results).to.deep.equal(["value"]);
  });
});
