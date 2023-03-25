import {
  pool,
  sql,
  PostTableSchema,
  JSONTableSchema,
  TextArrayTable,
  NumberArrayTable,
  BoolArrayTable,
} from "./pool"
import { makeTable } from "../src"

const posts_table = makeTable("posts", PostTableSchema)
const text_array_table = makeTable("text_array", TextArrayTable)
const number_array_table = makeTable("number_array", NumberArrayTable)
const bool_array_table = makeTable("bool_array", BoolArrayTable)
const json_table = makeTable("json_table", JSONTableSchema)

const primitive_input = {
  title: "Foo bar",
  author_name: "Emil",
  thumbs_up_count: 0,
  is_published: false,
}

const text_array_input = {
  text_array: ["hello", "world"],
}

const number_array_input = {
  number_array: [0, 1],
}

const bool_array_input = {
  bool_array: [true, false],
}

const json_table_input = {
  json_data: { this: { will: { be: "great!" } } },
}

describe("insert", () => {
  test("primitives", async () => {
    const res = await pool.one(posts_table.insert(primitive_input))
    expect(res).toMatchObject(primitive_input)
    expect(res.id).not.toBeNull()
  })

  test("z.array(z.string()) -> text[]", async () => {
    const res = await pool.one(text_array_table.insert(text_array_input))
    expect(res).toMatchObject(text_array_input)
  })

  test("z.array(z.number()) -> int4[]", async () => {
    const res = await pool.one(number_array_table.insert(number_array_input))
    expect(res).toMatchObject(number_array_input)
  })

  test("z.array(z.bool()) -> bool[]", async () => {
    const res = await pool.one(bool_array_table.insert(bool_array_input))
    expect(res).toMatchObject(bool_array_input)
  })

  test("z.any() -> json", async () => {
    const res = await pool.one(json_table.insert(json_table_input))
    expect(res).toMatchObject(json_table_input)
  })
})

describe("update", () => {
  test("primitives", async () => {
    const payload = {
      title: "BarFota",
      author_name: "Lemil",
      thumbs_up_count: 1337,
      is_published: false,
    }
    const res = await pool.one(posts_table.insert(primitive_input))
    const qry = posts_table.update({ id: res.id }, payload)
    await pool.query(qry)
  })

  test("z.array(z.string()) -> text[]", async () => {
    const payload = {
      text_array: ["goodbye", "cruel", "existence"],
    }
    const res = await pool.one(text_array_table.insert(text_array_input))
    await pool.query(text_array_table.update({ id: res.id }, payload))
  })

  test("z.array(z.number()) -> int4[]", async () => {
    const payload = {
      number_array: [1, 3, 3, 7],
    }
    const res = await pool.one(number_array_table.insert(number_array_input))
    await pool.query(number_array_table.update({ id: res.id }, payload))
  })

  test("z.array(z.bool()) -> bool[]", async () => {
    const payload = {
      bool_array: [true, false, false, true],
    }
    const res = await pool.one(bool_array_table.insert(bool_array_input))
    await pool.query(bool_array_table.update({ id: res.id }, payload))
  })

  test("z.any() -> json", async () => {
    const payload = {
      json_data: "now it's a string!",
    }
    const res = await pool.one(json_table.insert(json_table_input))
    await pool.query(json_table.update({ id: res.id }, payload))
  })
})
