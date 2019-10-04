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
