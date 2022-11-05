import { createEventBuilder } from "../eventBuilder.js";

import "./init.js";

describe("eventBuilder", () => {
  it("Creates event with only a type", () => {
    const eventBuilder = createEventBuilder("eventType");

    const event = eventBuilder();

    expect(event).to.deep.equal({ type: "eventType" });
  });

  it("Gives easy access to event type", () => {
    const eventBuilder = createEventBuilder("eventType");

    expect(eventBuilder.toString()).to.equal("eventType");
  });

  it("Creates event with a payload used as is from builder params", () => {
    const eventBuilder = createEventBuilder("eventType");

    const event = eventBuilder({ any: "value" });

    expect(event).to.deep.equal({
      type: "eventType",
      payload: { any: "value" },
    });
  });

  it("Creates event with a payload computed from builder params", () => {
    const eventBuilder = createEventBuilder(
      "eventType",
      ({ arg1, arg2, arg3 }) => [arg1, arg2, arg3],
    );

    const event = eventBuilder({
      arg1: { any: "value1" },
      arg2: { any: "value2" },
      arg3: { any: "value3" },
    });

    expect(event).to.deep.equal({
      type: "eventType",
      payload: [{ any: "value1" }, { any: "value2" }, { any: "value3" }],
    });
  });

  it("Creates event with payload and meta", () => {
    const eventBuilder = createEventBuilder(
      "eventType",
      ({ arg }) => arg,
      ({ meta }) => meta,
    );

    const event = eventBuilder({ arg: "value", meta: "meta" });

    expect(event).to.deep.equal({
      type: "eventType",
      payload: "value",
      meta: "meta",
    });
  });

  it("Adds error boolean in case payload is an Error instance", () => {
    const error = new Error("test error");
    const eventBuilder = createEventBuilder(
      "eventType",
      sinon.stub().returns(error),
    );

    const event = eventBuilder();

    expect(event).to.deep.equal({
      type: "eventType",
      payload: error,
      error: true,
    });
  });

  it("Handles errors while building payload, creating an error event", () => {
    const error = new Error("test error");
    const eventBuilder = createEventBuilder(
      "eventType",
      sinon.stub().throws(error),
    );

    const event = eventBuilder();

    expect(event).to.deep.equal({
      type: "eventType",
      payload: error,
      error: true,
    });
  });

  it("Handles errors while building meta, creating an error event", () => {
    const error = new Error("test error");
    const eventBuilder = createEventBuilder(
      "eventType",
      () => ({}),
      sinon.stub().throws(error),
    );

    const event = eventBuilder();

    expect(event).to.deep.equal({
      type: "eventType",
      payload: error,
      error: true,
    });
  });
});
