import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(sinonChai)
chai.use(chaiAsPromised)
chai.use(dirtyChai)

global.expect = expect
global.sinon = sinon

// ////////////////
// Following defines a template string tag to catch test params inside a test title
// ////////
let lastParams
global.withParams = (parts, ...params) => {
  lastParams = params

  return (
    parts[0] +
    parts
      .slice(1)
      .map((part, idx) => JSON.stringify(params[idx], null, 2) + part)
      .join('')
  )
}

global.useParams = callback => {
  const params = lastParams.slice()

  return function(...args) {
    callback.call(this, ...params, ...args)
  }
}
