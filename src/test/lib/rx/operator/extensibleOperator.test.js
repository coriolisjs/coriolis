import { from } from "rxjs";
import { map } from "rxjs/operators";

import { createExtensibleOperator } from "../../../../lib/rx/operator/extensibleOperator.js";

import "../../../init.js";

describe("extensibleOperator", () => {
  it("should stream values mapped as expected", () => {
    const source = from("abcdefghijklmnop".slice());

    const results = [];
    const { operator, add } = createExtensibleOperator();

    const removeZ = add(map((value) => value + "z"));

    let removeY;
    source.pipe(operator).subscribe((value) => {
      results.push(value);

      if (value === "cz") {
        removeY = add(map((value) => value + "y"));
      }

      if (value === "gzy") {
        removeZ();
      }

      if (value === "ly") {
        removeY();
      }
    });

    expect(results).to.deep.equal([
      "az",
      "bz",
      "cz",
      "dzy",
      "ezy",
      "fzy",
      "gzy",
      "hy",
      "iy",
      "jy",
      "ky",
      "ly",
      "m",
      "n",
      "o",
      "p",
    ]);
  });
});
