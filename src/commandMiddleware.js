import { EMPTY, of, throwError } from 'rxjs'
import { isCommand } from './lib/event/isValidEvent'
import { asObservable } from './lib/rx/asObservable'

export const commandMiddleware =
  ({ addEffect, getProjectionValue, dispatch }) =>
  (eventOrCommand) => {
    if (!isCommand(eventOrCommand)) {
      return of(eventOrCommand)
    }

    try {
      asObservable(
        eventOrCommand({
          // FIXME: Here we give the power for a command to add an effect
          // Do we need some control as if this effect is removed as expected when command is ended ?
          // As the command is the only scope with the removeEffect function, is it acceptable
          // that this command ends without removing all added effects ?
          addEffect,
          getProjectionValue,
        }),
      ).subscribe(dispatch)
    } catch (error) {
      return throwError(() => error)
    }

    return EMPTY
  }
