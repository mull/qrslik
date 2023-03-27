import {
  IdentifierSqlToken,
  PrimitiveValueExpression,
  SqlFragment,
  sql,
} from "slonik"
import { z } from "zod"
import { SlonikQueryWithSelection, ValueRecord, intoArray } from "./utils"
import { insert } from "./commands/insert"
import { update } from "./commands/update"
import { select } from "./commands/select"

export { insert, update, select }

export interface View<T extends z.ZodRawShape> {
  identifier: IdentifierSqlToken
  alias?: IdentifierSqlToken

  /**
   * Shorthand for selecting all columns of a view
   */
  selectStar(): SlonikQueryWithSelection<T, T>
  /**
   * @param columns An object whose keys are part of the schema.
   *                A value of true includes the column in the result selection.
   * @example
   * const post_titles = post_view.select({title: true})
   */
  select<Columns extends { [k in keyof T]?: true }>(
    columns: Columns
  ): SlonikQueryWithSelection<T, Columns>
  /**
   * Returns the same view but aliased, useful when embedding
   * queries inside others.
   *
   * @example
   * const post_titles = post_view
   *  .as('top_posts')
   *  .select({title: true})
   *
   * console.log(post_titles.sql)
   * # => SELECT "top_posts"."title" FROM "posts" AS "top_posts"
   */
  as(name: string | string[]): View<T>
}

/**
 *
 * @param name 'table_name', 'view_name' or ['schema', 'target']
 * @param schema Zod schema representing the target
 * @returns An object capable of building select queries
 *
 * @example
 *  const post_view = makeView(
 *    ['public', 'posts'],
 *    z.object({id: z.string(), title: z.string()})
 *  )
 *  const maybefirst = await slonik_pool.maybeOne(
 *    post_view.select({id: true, title: true})
 *  )
 */
export function makeView<T extends z.ZodRawShape>(
  name: string | string[],
  schema: z.ZodObject<T>
): View<T> {
  const identifier = sql.identifier(intoArray(name))

  return {
    identifier,
    select(columns) {
      return select(this.identifier, schema, columns, this.alias)
    },
    selectStar(): SlonikQueryWithSelection<T, T> {
      const selects: { [K in keyof T]?: true } = Object.keys(
        schema.shape
      ).reduce((acc, next) => Object.assign(acc, { [next]: true }), {})
      return this.select(selects)
    },
    as(name) {
      const alias = sql.identifier(intoArray(name))
      return {
        ...this,
        alias,
      }
    },
  }
}

export interface Table<T extends z.ZodRawShape> extends View<T> {
  /**
   * @param obj An object partially matching the table's schema
   * @returns An object matching the schema, i.e. RETURNING *
   * @example
   * const post = await slonik.one(
   *  posts_table.insert({
   *    id: "113c9b28-6993-4a44-a3d9-052ccb43fd31",
   *    title: "It inserts."
   *  })
   * )
   */
  // TODO: VSCode prettier breaks with this const (:
  //       Do I even want it tho
  insert</*const*/ Values extends { [k in keyof T]?: any }>(
    obj: Values
  ): SlonikQueryWithSelection<T, T>
  /**
   *
   * @param match An object partially matching the table's schema,
   *              representing the column & values to match on.
   *              i.e. WHERE column=value
   * @param values An object partially matching the tables schema,
   *               representing the values to update on the matching rows.
   *               i.e. SET column=value
   * @returns
   * @example
   * const result = await slonik.query(
   * )
   */
  update(
    match: ValueRecord<z.ZodObject<T>>,
    values: ValueRecord<z.ZodObject<T>>
  ): Readonly<{
    parser: z.ZodAny
    type: "SLONIK_TOKEN_QUERY"
    sql: string
    values: PrimitiveValueExpression[]
  }>
}

/**
 *
 * @param name 'table_name' or ['schema', 'table_name']
 * @param schema Zod Object reprenting the table
 * @returns An View that is also capable of building
 *          insert & update queries
 *
 * @example
 * const PostTableSchema = z.object({
 *   id: z.string().uuid(),
 *   title: z.string()
 * })
 * const posts_table = makeTable('posts', PostTableSchema)
 */
export function makeTable<T extends z.ZodRawShape>(
  name: string | string[],
  schema: z.ZodObject<T>
): Table<T> {
  const view = makeView(name, schema)

  return {
    ...view,
    insert<Values extends { [k in keyof T]?: any }>(
      obj: Values
    ): SlonikQueryWithSelection<T, T> {
      return insert(view.identifier, schema, obj)
    },
    update(where, set) {
      return update(view.identifier, schema, where, set)
    },
  }
}
