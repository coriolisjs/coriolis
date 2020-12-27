import { createProjectionSetupAPI } from './api/index'

const tryProjection = (projection, params) => {
  try {
    return projection(params)
  } catch (error) {
    error.message = `Projection execution error: ${error.message}`
    throw error
  }
}

export const compileProjection = (projection, getStateFlow) => {
  if (typeof projection !== 'function') {
    throw new TypeError('Projection must be a function')
  }

  const {
    setupAPI,
    preventOutOfScopeUsage,
    getPostTreatmentData,
  } = createProjectionSetupAPI()

  const projectionBehavior = tryProjection(projection, setupAPI)

  if (typeof projectionBehavior !== 'function') {
    throw new TypeError('Given projection is not working')
  }

  preventOutOfScopeUsage()

  const { name, initialState, getInputs, stateless } = getPostTreatmentData(
    projectionBehavior,
    getStateFlow,
  )

  const reducer = (lastState, event) => {
    const inputs = getInputs(lastState, event)

    if (!inputs) {
      return lastState
    }

    return projectionBehavior(...inputs)
  }

  Object.defineProperty(reducer, 'name', {
    value: name || projection.name,
    writable: false,
  })

  Object.defineProperty(reducer, 'stateless', {
    value: stateless,
    writable: false,
  })

  return {
    initialState,
    reducer,
  }
}
