/**
 * Inspired by the awesome Sequel gem by Jeremy Evans.
 */
// import { IdentifierSqlToken, SqlFragment, sql } from "slonik"
// import { createPool } from "slonik"

// interface QrslikSource {
//   kind: "QrslikSource"
//   identifier: IdentifierSqlToken
// }

// interface QrslikSelect {
//   kind: "QrslikSelect"
//   source: QrslikSource
//   alias?: IdentifierSqlToken

//   constraint?: SqlFragment
//   selections: SqlFragment
// }

// function select(
//   from: IdentifierSqlToken,
//   selections: SqlFragment
// ): QrslikSelect {
//   return {
//     kind: "QrslikSelect",
//     source: {
//       kind: "QrslikSource",
//       identifier: from,
//     },
//     selections,
//   }
// }

// function where(selection: QrslikSelect) {
//   return {
//     ...selection,
//     constraint: sql.fragment`WHERE 1 = 1`,
//   }
// }

// async function main() {
//   const pool = await createPool("postgresql://@localhost/qrslik")

//   try {
//   } finally {
//     await pool.end()
//   }
// }

// main().catch(console.error)
