import { IdentifierSqlToken, PrimitiveValueExpression, sql } from "slonik"
import { ValueRecord, evenMorePrimitive, intoPrimitive } from "../utils"
import { z } from "zod"

export function update<T extends z.ZodRawShape>(
  table_name: IdentifierSqlToken,
  schema: z.ZodObject<T>,
  match: ValueRecord<z.ZodObject<T>>,
  values: ValueRecord<z.ZodObject<T>>
): Readonly<{
  parser: z.ZodAny
  type: "SLONIK_TOKEN_QUERY"
  sql: string
  values: PrimitiveValueExpression[]
}> {
  const where_list = sql.join(
    Object.entries(match).map(([key, value]) => {
      const identifier = sql.identifier([key])
      const val = intoPrimitive(value)
      return sql.fragment`${identifier} = ${val}`
    }),
    sql.fragment` AND `
  )

  const set_list = sql.join(
    Object.entries(values).map(([key, value]) => {
      const identifier = sql.identifier([key])
      const parser = schema.shape[key]
      const val = evenMorePrimitive(parser, value)
      return sql.fragment`${identifier} = ${val}`
    }),
    sql.fragment`, `
  )

  return sql.unsafe`
  UPDATE ${table_name}
  SET ${set_list}
  WHERE ${where_list}
`
}
