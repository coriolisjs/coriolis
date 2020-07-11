export const truncate = (size) => {
  const short = size - 4
  return (str) => {
    if (str.length > short) {
      return `${str.slice(0, short)}... `
    }

    return str.padEnd(size, ' ')
  }
}
