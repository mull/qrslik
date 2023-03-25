import { IdentifierSqlToken, sql } from "slonik"
import { SlonikQueryWithSelection, evenMorePrimitive } from "../utils"
import { z } from "zod"

export function insert<
  T extends z.ZodRawShape,
  /*const*/ Values extends { [k in keyof T]?: any }
>(
  table_name: IdentifierSqlToken,
  schema: z.ZodObject<T>,
  obj: Values
): SlonikQueryWithSelection<T, T> {
  const fields: Array<keyof Values> = Object.keys(obj)
  const entries = Object.entries(obj)
  const columnList = sql.join(
    fields.map((f) => sql.identifier([f.toString()])),
    sql.fragment`,`
  )
  const valueList = sql.join(
    entries.map(([key, value]) => {
      const parser = schema.shape[key]
      return evenMorePrimitive(parser, value)
    }),
    sql.fragment`, `
  )

  return sql.type(schema)`
    INSERT INTO ${table_name} (${columnList})
    VALUES (${valueList})
    RETURNING *
  `
}
