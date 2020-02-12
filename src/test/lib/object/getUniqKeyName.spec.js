import { getUniqKeyName } from '../../../lib/object/getUniqKeyName'

describe(`getUniqKeyName
  Get's a unique key name for an object, given or not a base name`, () => {
  it(
    withParams`Given an object with no "unnamed" key defined
      When no key name is given
      Then the result should be ${'unnamed'}
  `,
    useParams(expected => {
      const result = getUniqKeyName({})

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object with an "unnamed" key defined
      When no key name is given
      Then the result should be ${'unnamed-2'}
  `,
    useParams(expected => {
      const result = getUniqKeyName({ unnamed: true })

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object with keys "unnamed" and "unnamed-2" defined
      When no key name is given
      Then the result should be ${'unnamed-3'}
  `,
    useParams(expected => {
      const result = getUniqKeyName({ unnamed: true, 'unnamed-2': true })

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object without specific key defined
      When key name ${'given-key'} is given
      Then the result should be ${'given-key'}
  `,
    useParams((given, expected) => {
      const result = getUniqKeyName({}, given)

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object with key ${'given-key'} defined
      When this key name is given
      Then the result should be ${'given-key-2'}
  `,
    useParams((given, expected) => {
      const result = getUniqKeyName({ 'given-key': true }, given)

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object with keys "given-key" and "given-key-2" defined
      When key name ${'given-key'} is given
      Then the result should be ${'given-key-3'}
  `,
    useParams((given, expected) => {
      const result = getUniqKeyName(
        { 'given-key': true, 'given-key-2': true },
        given,
      )

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object with keys "given-key" and "given-key-2" defined
      When key name ${'given-key-2'} is given
      Then the result should be ${'given-key-3'}
  `,
    useParams((given, expected) => {
      const result = getUniqKeyName(
        { 'given-key': true, 'given-key-2': true },
        given,
      )

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object with keys "given-key" and "given-key-2" defined
      When key name ${'other-key'} is given
      Then the result should be ${'other-key'}
  `,
    useParams((given, expected) => {
      const result = getUniqKeyName(
        { 'given-key': true, 'given-key-2': true },
        given,
      )

      expect(result).to.equal(expected)
    }),
  )

  it(
    withParams`Given an object
${{ 'a-key': true, 'a-key-2': true, 'a-key-4': true }}
      When key name ${'a-key'} is given
      Then the result should be ${'a-key-3'}
  `,
    useParams((givenObject, givenKey, expected) => {
      const result = getUniqKeyName(givenObject, givenKey)

      expect(result).to.equal(expected)
    }),
  )
})
