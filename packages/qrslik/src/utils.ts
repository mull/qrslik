import { z } from "zod"
import { sql, PrimitiveValueExpression } from "slonik"

// effectively just removes undefined right meow
export const intoPrimitive = (value: any): PrimitiveValueExpression => {
  const definitely = value == null ? null : value
  return definitely
}

export function evenMorePrimitive(parser: any, value: any) {
  // we identify this as json
  if (parser instanceof z.ZodAny) {
    return JSON.stringify(value)
  }

  // convert arrays into arrays heyo
  const item_def = parser._def
  if (Array.isArray(value) && parser instanceof z.ZodArray) {
    if (item_def.type instanceof z.ZodString) {
      return sql.array(value, "text")
    } else if (item_def.type instanceof z.ZodNumber) {
      return sql.array(value, "int4")
    } else if (item_def.type instanceof z.ZodBoolean) {
      return sql.array(value, "bool")
    }
  }
  return intoPrimitive(value)
}

export const intoArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value]

// https://stackoverflow.com/a/48244432
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U]
export type ValueRecord<T extends z.ZodTypeAny> = AtLeastOne<z.infer<T>>

export type SlonikQueryWithSelection<
  T extends z.ZodRawShape,
  Columns = T
> = Readonly<{
  parser: z.ZodObject<Pick<T, Extract<keyof T, keyof Columns>>>
  type: "SLONIK_TOKEN_QUERY"
  sql: string
  values: PrimitiveValueExpression[]
}>
