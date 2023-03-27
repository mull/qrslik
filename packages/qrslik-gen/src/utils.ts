export function pascalCaseTableName(table_name: string) {
  return table_name
    .split("_")
    .map((part) => part.slice(0, 1).toLocaleUpperCase().concat(part.slice(1)))
    .join("")
}
