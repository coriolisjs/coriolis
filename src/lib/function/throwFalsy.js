export const throwFalsy = (validator, error) => (arg) => {
  if (!validator(arg)) {
    throw error
  }
}
