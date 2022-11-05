import { stampEvent } from "../../../lib/event/stampEvent.js";

import "../../init.js";

describe("stampEvent", () => {
  it(
    `Given an event
      When stampEvent is called with a new event
      Then we get a new event object with a timestamp as meta property
  `,
    () => {
      const event = {
        type: "type",
        payload: "value",
      };

      expect(stampEvent(event).meta.timestamp).to.be.a("number");
    },
  );

  it(
    `Given an event with timestamp in meta
      When stampEvent is called with this event
      Then we get back the same event object without any change
  `,
    () => {
      const event = {
        type: "type",
        payload: "value",
        meta: {
          timestamp: 12345,
        },
      };

      expect(stampEvent(event).meta.timestamp).to.equal(12345);
      expect(stampEvent(event)).to.equal(event);
    },
  );
});
