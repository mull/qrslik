export const intoArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value]
