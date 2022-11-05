import { compileProjection } from "../../projection/compile.js";
import { createReducedState } from "../../projection/reducedState.js";
import { createReducedStateChain } from "../../projection/reducedStateChain.js";

import "../init.js";

describe(
  `Projection compiler
  Converts a projection into a reducer and an initial state
`,
  () => {
    it(
      `Given a simple projection using events and an initial state
      When compiled
      Then we get a reducer and an initial state
    `,
      () => {
        const testprojection = ({ useState, useEvent }) => (
          useState([]), useEvent(), (state, event) => [].concat(state, [event])
        );

        const { reducer, initialState } = compileProjection(testprojection);

        expect(initialState).to.eql([]);
        expect(reducer(initialState, "event1")).to.eql(["event1"]);
        expect(reducer(["event1"], "event2")).to.eql(["event1", "event2"]);
      },
    );

    it(
      `Given a two projections, one using the other
      When compiled
      Then we get a reducer and an initial state
    `,
      () => {
        const testprojection1 = ({ useState, useEvent }) => (
          useState([]), useEvent(), (state, event) => [].concat(state, [event])
        );
        const testprojection2 = ({ useProjection }) => (
          useProjection(testprojection1), (eventsList) => eventsList.length
        );

        const defaultGetStateFlow = (...args) => {
          let reducer;
          let initialState;

          if (args[0] === "reducer") {
            [, reducer, initialState] = args;
          } else if (typeof args[0] === "function") {
            const [projection] = args;

            ({ reducer, initialState } = compileProjection(
              projection,
              defaultGetStateFlow,
            ));
          }

          return createReducedStateChain(
            createReducedState(reducer, initialState),
          );
        };

        const { reducer, initialState } = compileProjection(
          testprojection2,
          defaultGetStateFlow,
        );

        expect(initialState).to.equal(0);
        expect(reducer(initialState, "event1")).to.equal(1);
        expect(reducer(["event1"], "event2")).to.equal(2);
      },
    );
  },
);
