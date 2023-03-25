import { DatabasePool, createPool, sql } from "slonik"
import { z } from "zod"

export let pool: DatabasePool
export { sql }

beforeAll(async () => {
  pool = await createPool("postresql://@localhost/qrslik")

  await pool.query(sql.unsafe`

    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS json_table;
    DROP TABLE IF EXISTS text_array;
    DROP TABLE IF EXISTS number_array;
    DROP TABLE IF EXISTS bool_array;
    CREATE TABLE posts (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      author_name TEXT NOT NULL,
      thumbs_up_count INTEGER NOT NULL DEFAULT 0,
      is_published BOOLEAN NOT NULL
    );

    CREATE TABLE json_table (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      json_data JSON NOT NULL
    );

    CREATE TABLE text_array (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      text_array TEXT[] NOT NULL
    );

    CREATE TABLE number_array (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      number_array INTEGER[] NOT NULL
    );

    CREATE TABLE bool_array (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      bool_array BOOLEAN[] NOT NULL
    );
  `)
})

afterAll(async () => {
  await pool.end()
})

export const PostTableSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  author_name: z.string().optional(),
  thumbs_up_count: z.number(),
  is_published: z.boolean(),
})

export const JSONTableSchema = z.object({
  id: z.string().uuid(),
  json_data: z.any(),
})

export const NumberArrayTable = z.object({
  id: z.string().uuid(),
  number_array: z.array(z.number()),
})

export const TextArrayTable = z.object({
  id: z.string().uuid(),
  text_array: z.array(z.string()),
})

export const BoolArrayTable = z.object({
  id: z.string().uuid(),
  bool_array: z.array(z.boolean()),
})
