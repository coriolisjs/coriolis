import { of, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { asObservable } from './lib/rx/asObservable'
import { promiseObservable } from './lib/rx/promiseObservable'
import { isCommand } from './lib/event/isValidEvent'

export const commandRunner = (commandCore, effectAPI) => {
  const { execute: command, executionPromise } = promiseObservable(() => {
    try {
      return asObservable(
        commandCore({
          // FIXME: Here we give the power for a command to add an effect
          // Do we need some control as if this effect is removed as expected when command is ended ?
          // As the command is the only scope with the removeEffect function, is it acceptable
          // that this command ends without removing all added effects ?
          addEffect: effectAPI.addEffect,
          getProjectionValue: (projection) =>
            effectAPI.withProjection(projection).getValue(),
        }),
      ).pipe(
        mergeMap((event) =>
          isCommand(event)
            ? commandRunner(event, effectAPI).command()
            : of(event),
        ),
      )
    } catch (error) {
      return new Observable((observer) => observer.error(error))
    }
  })

  return {
    command,
    executionPromise: executionPromise
      // any error would cause global system error via observable emited error.
      // Sending back error also on this promise could cause confusion so we wrap error message
      .catch((error) => {
        error.message = `Command execution caused global error: ${error.message}`
        throw error
      }),
  }
}
