import { hasOnlyKeys } from "../../../lib/object/hasOnlyKeys.js";

import "../../init.js";

describe("hasOnlyKeys", () => {
  it(
    `Given an object with varions properties
      When I call hasOnlyKeys on this object with the exact list of keys of this object
      Then I get true
  `,
    () => {
      const subject = {
        key1: "key1",
        key2: "key2",
        key3: "key3",
        key4: "key4",
      };

      const result = hasOnlyKeys(subject, ["key1", "key2", "key3", "key4"]);

      expect(result).to.be.true();
    },
  );

  it(
    `Given an object with varions properties
      When I call hasOnlyKeys on this object with not all the keys of this object
      Then I get false
  `,
    () => {
      const subject = {
        key1: "key1",
        key2: "key2",
        key3: "key3",
        key4: "key4",
      };

      const result = hasOnlyKeys(subject, ["key1", "key2", "key3"]);

      expect(result).to.be.false();
    },
  );

  it(
    `Given an object with varions properties
      When I call hasOnlyKeys on this object with more then the keys of this object
      Then I get true
  `,
    () => {
      const subject = {
        key1: "key1",
        key2: "key2",
      };

      const result = hasOnlyKeys(subject, ["key1", "key2", "key3"]);

      expect(result).to.be.true();
    },
  );

  it(
    `Given an object with no properties
      When I call hasOnlyKeys on this object with an empty list
      Then I get true
  `,
    () => {
      const subject = {};

      const result = hasOnlyKeys(subject, []);

      expect(result).to.be.true();
    },
  );

  it(
    `Given an object with no properties
      When I call hasOnlyKeys on this object with some values
      Then I get true
  `,
    () => {
      const subject = {};

      const result = hasOnlyKeys(subject, ["any", "value"]);

      expect(result).to.be.true();
    },
  );
});
