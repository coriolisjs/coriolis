import { throwFalsy } from "../../../lib/function/throwFalsy.js";

import "../../init.js";

describe("throwFalsy", () => {
  it(
    `Given a validator and an error object
      And an argument for the validator
      When throwFalsy is called with those
      And validation is truthy
      Then throwFalsy should just return undefined
  `,
    () => {
      const validator = sinon.stub().returns(true);
      const error = new Error("error");

      const result = throwFalsy(validator, error)("arg");

      expect(result).to.be.undefined();
      expect(validator).to.have.been.calledWith("arg");
    },
  );

  it(
    `Given a validator and an error object
      And an argument for the validator
      When throwFalsy is called with those
      And validation is falsy
      Then throwFalsy should throw the error object
  `,
    () => {
      const validator = sinon.stub().returns(false);
      const error = new Error("error");

      const experiment = () => throwFalsy(validator, error)("arg");

      expect(experiment).to.throw(error);
      expect(validator).to.have.been.calledWith("arg");
    },
  );
});
