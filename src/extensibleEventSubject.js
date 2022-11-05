import { from, of } from "rxjs";
import { endWith, mergeMap } from "rxjs/operators";

import { payloadEquals } from "./lib/event/payloadEquals.js";
import { variableFunction } from "./lib/function/variableFunction.js";
import { createBroadcastSubject } from "./lib/rx/broadcastSubject.js";
import { createExtensibleObservable } from "./lib/rx/extensibleObservable.js";
import { createExtensibleOperator } from "./lib/rx/operator/extensibleOperator.js";

import { createEventSubject } from "./eventSubject.js";

export const FIRST_EVENT_TYPE = "All past events have been read";

const buildFirstEvent = () => ({
  type: FIRST_EVENT_TYPE,
  // a payload is important to check this event. Event itself will be changed (adding meta etc.)
  payload: {},
});

const createExtensibleEventMiddleware = () => {
  const { operator, add } = createExtensibleOperator();

  return {
    eventMiddleware: (event) => of(event).pipe(operator),
    addEventMiddleware: (middleware) => add(mergeMap(middleware)),
  };
};

// An extensible eventSubject is an eventSubject with additional functions to add sources, loggers and eventEnhancers
export const createExtensibleEventSubject = () => {
  const { broadcastSubject: logger, addTarget: addLogger } =
    createBroadcastSubject();

  const { operator: eventEnhancer, add: addEventEnhancer } =
    createExtensibleOperator();

  const { operator: pastEventEnhancer, add: addPastEventEnhancer } =
    createExtensibleOperator();

  const { eventMiddleware, addEventMiddleware } =
    createExtensibleEventMiddleware();

  const { observable: pastSource, add: addPastSource } =
    createExtensibleObservable();

  const addAnyAsPastSource = (source) => addPastSource(from(source));

  const { func: fusableAddPastSource, setup: changeFusableAddPastSource } =
    variableFunction(addAnyAsPastSource);

  const disableAddPastSource = () =>
    changeFusableAddPastSource(() => {
      throw new Error("addSource must be called before all sources completed");
    });

  const firstEvent = buildFirstEvent();
  // Check is done on payload value, event object itself
  // could have been changed (adding meta-data for example)
  const isFirstEvent = payloadEquals(firstEvent.payload);

  // From the moment this event source is created, it starts buffering all events it receives
  // until it gets a subscription and passes them
  const eventSubject = createEventSubject(
    pastSource.pipe(endWith(firstEvent)),
    logger,
    eventEnhancer,
    pastEventEnhancer,
    eventMiddleware,
  );

  return {
    eventSubject,
    addLogger,
    addEventEnhancer,
    addPastEventEnhancer,
    addEventMiddleware,
    addSource: fusableAddPastSource,
    disableAddSource: disableAddPastSource,
    isFirstEvent,
  };
};
