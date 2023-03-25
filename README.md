# qrslik 

qrslik is a set tools built upon [Slonik](https://github.com/gajus/slonik) and [zod](https://zod.dev) to reduce verbosity for common simple operations. Its lightweight abstractions offer quick ways to get to CRUD.

Some of its goals are:
- Type safety through Zod schemas
- Good interop with slonik itself
- The same safety guarantees that slonik offers
- Type inferrence on par with Zod


# Example
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


