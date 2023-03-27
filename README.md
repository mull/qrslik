# qrslik 

qrslik is a set tools built upon [Slonik](https://github.com/gajus/slonik) and [zod](https://zod.dev) to reduce verbosity for common simple operations. Its lightweight abstractions offer quick ways to get to CRUD.

Some of its goals are:
- Type safety through Zod schemas
- Good interop with slonik itself
- The same safety guarantees that slonik offers
- Type inferrence on par with Zod

It's main tool is the npm package qrslik, installable like so:
```
npm i qrslik
```

## Example
Given this table:

```sql
CREATE TABLE posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author_name TEXT
)
```

We can define a zod schema and a qrslik table:
```ts
const PostsTableSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  author_name: z.string().nullable().optional(),
})

import { makeTable } from 'qrslik'
const PostsTable = makeTable('posts', PostsTableSchema)


const all_post_titles = await slonik.any(
  PostsTable.select({title: true})
)
// Array<{title: true}>

const new_post = await slonik.one(
  PostsTable.insert({
    id: "113c9b28-6993-4a44-a3d9-052ccb43fd31",
    title: "My new post",
  })
)
// {id: string, title: string}

await slonik.query(
  PostsTable.update(
    {id: new_post.id},
    {title: "Kasper is a good boy"}
  )
)
```

## Schema generation
qrslik-code-gen provides a way to map your Postgres tables into zod schemas.

```
POSTGRES_URL=postgresql://@localhost/qrslik npx qrslik-code-gen ./schemas.ts
[qrslik-code-gen]
  output_path: /Users/emil/query-builder-idea/schemas.ts

All done!
```

That file can then be used to provide functions like `createTable` with a schema, without having to write it by hand.

Note that Postgres constraints and/or checks are not translated into constraints on the Zod schemas, though that may be at least partially implemented in the future.

```ts
import { makeTable } from 'qrslik'
import { PostsTableSchema } from './schema'

const PostsTable = makeTable("posts", PostsTableSchema)
```
