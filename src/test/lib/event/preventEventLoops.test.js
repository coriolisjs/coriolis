import { preventEventLoops } from "../../../lib/event/preventEventLoops.js";

import "../../init.js";

describe("preventEventLoops", () => {
  it(
    `Given an event
      When preventEventLoops is called with a new event
      Then we get a new event object with a unique meta property
  `,
    () => {
      const event = {
        type: "type",
        payload: "value",
      };

      expect(preventEventLoops("key")(event)).to.deep.equal({
        ...event,
        meta: {
          key: true,
        },
      });
    },
  );

  it(
    `Given an event
      When preventEventLoops is called with a event that was returned by a previous call to preventEventLoops
      Then we get an exception
  `,
    () => {
      const event = {
        type: "type",
        payload: "value",
      };

      const loppProtectedEvent = preventEventLoops("key")(event);

      expect(() => preventEventLoops("key")(loppProtectedEvent)).to.throw();
    },
  );
});
