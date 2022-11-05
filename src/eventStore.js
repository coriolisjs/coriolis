import { ReplaySubject, Subject } from "rxjs";
import { filter, share, skipUntil, take, takeUntil } from "rxjs/operators";

import { chain } from "./lib/function/chain.js";
import { pipe } from "./lib/function/pipe.js";
import { simpleUnsub } from "./lib/rx/simpleUnsub.js";

import { commandMiddleware } from "./commandMiddleware.js";
import { createExtensibleEventSubject } from "./extensibleEventSubject.js";
import { parseStoreArgs } from "./parseStoreArgs.js";
import { createStateFlowFactory } from "./projection/stateFlowFactory.js";

export const createStore = pipe(parseStoreArgs, (options) => {
  const {
    eventSubject,
    addLogger,
    addEventEnhancer,
    addPastEventEnhancer,
    addEventMiddleware,
    addSource,
    disableAddSource,
    isFirstEvent,
  } = createExtensibleEventSubject();

  const addAllEventsEnhancer = (enhancer) => {
    const removePastEventEnhancer = addPastEventEnhancer(enhancer);
    const removeEventEnhancer = addEventEnhancer(enhancer);

    return () => {
      removePastEventEnhancer();
      removeEventEnhancer();
    };
  };

  if (options.eventEnhancer) {
    addAllEventsEnhancer(options.eventEnhancer);
  }

  const handleError = options.errorHandler ||
    ((error) => {
      throw error;
    });

  // Use subjects to have single subscription points to connect all together (one for input, one for output)
  // eventCaster will handle events coming from eventSubject to projections and effects
  const eventCaster = new Subject();
  // eventCatcher will handle events coming from effects to eventSubject
  const eventCatcher = new Subject();

  const initDone$ = eventCaster.pipe(
    filter(isFirstEvent),
    take(1),
    share({
      connector: () => new ReplaySubject(1),
      resetOnRefCountZero: false,
      resetOnComplete: false,
      resetOnError: true,
    }),
  );

  const pastEvent$ = eventCaster.pipe(takeUntil(initDone$));

  const event$ = eventCaster.pipe(skipUntil(initDone$));

  const projectionsEvent$ = eventCaster.pipe(
    share({
      connector: () => new ReplaySubject(1),
      resetOnRefCountZero: false,
      resetOnComplete: true,
      resetOnError: true,
    }),
  );

  const stateFlowFactoryBuilder = options.stateFlowFactoryBuilder ||
    createStateFlowFactory;

  const withProjection = stateFlowFactoryBuilder(projectionsEvent$, initDone$);

  let dispatch = () => {
    throw new Error(
      "Dispatch while constructing your middleware is not allowed. " +
        "Other middleware would not be applied to this dispatch.",
    );
  };

  const effectAPI = {
    addEffect: (effect) =>
      simpleUnsub(
        effect({
          // destructuring here prevents mutations on effectAPI from effect
          ...effectAPI,
        }),
      ),
    addSource,
    addLogger,
    addEventEnhancer,
    addPastEventEnhancer,
    addAllEventsEnhancer,
    pastEvent$,
    event$,
    dispatch: (event) => dispatch(event),
    withProjection,
  };

  const middlewareAPI = {
    addEffect: effectAPI.addEffect,
    getProjectionValue: (projection) =>
      effectAPI.withProjection(projection).getValue(),
    dispatch: effectAPI.dispatch,
  };

  const middlewaresList = (options.middlewares || [commandMiddleware]).map(
    (middleware) => middleware(middlewareAPI),
  );

  const removeEventMiddlewares = addEventMiddleware(...middlewaresList);

  dispatch = eventCatcher.next.bind(eventCatcher);

  const initDoneSubscription = initDone$.subscribe(disableAddSource);

  // EventCatcher must be connected to eventSubject before effects
  // are added, to be ready to catch all events
  const eventCatcherSubscription = eventCatcher.subscribe(eventSubject);

  // connect each defined effect and buid a removeEffects function that disconnect all effects
  const removeEffects = chain(...options.effects.map(effectAPI.addEffect));

  // Once everything is pieced together, subscribe it to event source to start the process
  const eventCasterSubscription = eventSubject.subscribe(
    (value) => eventCaster.next(value),
    (error) => {
      destroyStore();
      handleError(error);
    },
    () => destroyStore(),
  );

  const destroyStore = chain(
    simpleUnsub(initDoneSubscription),
    simpleUnsub(eventCatcherSubscription),
    simpleUnsub(eventCasterSubscription),
    () => eventCaster.complete(),
    removeEventMiddlewares,
    removeEffects,
  );

  return {
    destroyStore,
    addEffect: effectAPI.addEffect,
  };
});
