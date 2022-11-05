import { objectFrom } from "../../../lib/object/objectFrom.js";

import "../../init.js";

describe("objectFrom", () => {
  it(
    `Given an array containing tulpes
      When I call objectFrom on this array
      Then I get an object
  `,
    () => {
      const tulpes = [
        ["a", "vala"],
        ["b", "valb"],
        ["c", "valc"],
      ];

      expect(objectFrom(tulpes)).to.deep.equal({
        a: "vala",
        b: "valb",
        c: "valc",
      });
    },
  );

  it(
    `Given an array containing tulpes
      When I call objectFrom on this array
      Then I get an object, not a recurcive way
  `,
    () => {
      const tulpes = [
        ["a", "vala"],
        ["b", "valb"],
        ["c", [["d", "vald"]]],
      ];

      expect(objectFrom(tulpes)).to.deep.equal({
        a: "vala",
        b: "valb",
        c: [["d", "vald"]],
      });
    },
  );

  it(
    `Given an empty array
      When I call objectFrom on this array
      Then I get an empty object
  `,
    () => {
      const tulpes = [];

      expect(objectFrom(tulpes)).to.deep.equal({});
    },
  );
});
