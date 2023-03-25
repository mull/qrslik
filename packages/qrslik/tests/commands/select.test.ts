import { sql } from "slonik"
import { select } from "../../src/commands/select"
import { z } from "zod"

it("qualifies column name", () => {
  const query = select(
    sql.identifier(["table"]),
    z.object({
      foo: z.string(),
    }),
    { foo: true }
  )

  expect(query.sql).toMatchInlineSnapshot(`
"
    SELECT "table"."foo" 
    FROM "table" 
  "
`)
})
