import { makeView } from "../src"
import { PostTableSchema } from "./pool"

const view = makeView(["public", "posts"], PostTableSchema)

test("selectStar()", () => {
  const query = view.selectStar()
  expect(query.sql).toMatchInlineSnapshot(`
"
    SELECT "public"."posts"."id", "public"."posts"."title", "public"."posts"."author_name", "public"."posts"."thumbs_up_count", "public"."posts"."is_published" 
    FROM "public"."posts" 
  "
`)
})

describe("as() aliasing", () => {
  const query = view.as("foobar").selectStar()

  test("it aliases the table & uses alias in column selection", () => {
    expect(query.sql).toMatchInlineSnapshot(`
"
    SELECT "foobar"."id", "foobar"."title", "foobar"."author_name", "foobar"."thumbs_up_count", "foobar"."is_published" 
    FROM "public"."posts" AS "foobar"
  "
`)
  })
})
