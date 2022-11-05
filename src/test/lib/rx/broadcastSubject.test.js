import { Subject } from "rxjs";

import { createBroadcastSubject } from "../../../lib/rx/broadcastSubject.js";

import "../../init.js";

describe("broadcastSubject", () => {
  it("Possible to add a target", () => {
    const results = [];
    const { broadcastSubject, addTarget } = createBroadcastSubject();

    addTarget((value) => results.push(value));

    broadcastSubject.next("test");

    expect(results).to.deep.equal(["test"]);
  });

  it("Broadcasts events to all targets", () => {
    const results1 = [];
    const results2 = [];
    const { broadcastSubject, addTarget } = createBroadcastSubject();

    addTarget((value) => results1.push(value));
    addTarget((value) => results2.push(value));

    broadcastSubject.next("testA");
    broadcastSubject.next("testB");

    expect(results1).to.deep.equal(["testA", "testB"]);
    expect(results2).to.deep.equal(["testA", "testB"]);
  });

  it("Possible to remove a target", () => {
    const results1 = [];
    const results2 = [];
    const results3 = [];
    const { broadcastSubject, addTarget } = createBroadcastSubject();

    const removeTarget1 = addTarget((value) => results1.push(value));
    const removeTarget2 = addTarget((value) => results2.push(value));

    broadcastSubject.next("testA");

    const removeTarget3 = addTarget((value) => results3.push(value));

    broadcastSubject.next("testB");

    removeTarget2();

    broadcastSubject.next("testC");

    removeTarget3();

    broadcastSubject.next("testD");

    removeTarget1();

    broadcastSubject.next("testE");

    expect(results1).to.deep.equal(["testA", "testB", "testC", "testD"]);
    expect(results2).to.deep.equal(["testA", "testB"]);
    expect(results3).to.deep.equal(["testB", "testC"]);
  });

  it("A target can dispatch feedbacks", () => {
    const feedbacks = [];
    const results = [];

    const { broadcastSubject, addTarget } = createBroadcastSubject();

    // catch events emitted by targets (could be logging reports...)
    broadcastSubject.subscribe((value) => feedbacks.push(value));

    const feedbackSubject = new Subject();
    const targetInput = {
      next: (value) => {
        results.push(value);
        feedbackSubject.next("got it");
      },
    };
    const targetSubject = Subject.create(targetInput, feedbackSubject);

    const removeTarget1 = addTarget(targetSubject);

    broadcastSubject.next("testA");

    broadcastSubject.next("testB");

    removeTarget1();

    broadcastSubject.next("testC");

    expect(feedbacks).to.deep.equal(["got it", "got it"]);
    expect(results).to.deep.equal(["testA", "testB"]);
  });

  // it('A target`s feedback error leads to error for all feedback observable')
});
