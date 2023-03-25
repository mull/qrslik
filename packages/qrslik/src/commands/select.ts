import { z } from "zod"
import { SlonikQueryWithSelection } from "../utils"
import { IdentifierSqlToken, sql } from "slonik"

export function select<
  T extends z.ZodRawShape,
  Columns extends { [k in keyof T]?: true }
>(
  from: IdentifierSqlToken,
  schema: z.ZodObject<T>,
  columns: Columns,
  alias?: IdentifierSqlToken
): SlonikQueryWithSelection<T, Columns> {
  const selections: any[] = []
  const fieldSelections = Object.entries(columns)
  const columnQualifier = alias ? alias : from

  for (const [field, value] of fieldSelections) {
    if (value === true)
      selections.push(sql.identifier([...columnQualifier.names, field]))
  }

  const tableAliasFragment = alias ? sql.fragment`AS ${alias}` : sql.fragment``

  return sql.type(schema.pick(columns))`
    SELECT ${sql.join(selections, sql.fragment`, `)} 
    FROM ${from} ${tableAliasFragment}
  `
}
