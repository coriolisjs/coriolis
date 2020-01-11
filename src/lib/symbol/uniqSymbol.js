// Symbol is already building "unique" instances.
// But for debug purpose, a unique "name" helps.
// This is why this function will create a Symbol instance with a random name
export const uniqSymbol = () => Symbol('uniqSymbol' + Math.random().toString(36).substring(2, 15))
