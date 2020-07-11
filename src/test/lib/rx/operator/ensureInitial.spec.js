import { of, interval } from 'rxjs'

import { ensureInitial } from '../../../../lib/rx/operator/ensureInitial'

describe('ensureInitial', () => {
  it('should not add initial value if a value is sent synchronously', () => {
    const results = []
    of('test')
      .pipe(ensureInitial(() => 'default initial value'))
      .subscribe((value) => results.push(value))

    expect(results).to.deep.equal(['test'])
  })

  it('should add initial value if no value is sent synchronously', () => {
    const results = []
    interval(1000)
      .pipe(ensureInitial(() => 'default initial value'))
      .subscribe((value) => results.push(value))
      .unsubscribe()

    expect(results).to.deep.equal(['default initial value'])
  })
})
