import { Model, raw, SQLStatement, SQL } from "decentraland-server";
import { LimitOptions } from "./types";

export interface ModelConstructor {
  tableName: string
  new(): Model<any>
}

export function table(model: ModelConstructor) {
  return raw(model.tableName)
}

export function conditional(condition: boolean, statement: SQLStatement) {
  if (condition) {
    return statement
  } else {
    return SQL``
  }
}

export function join(statements: (SQLStatement | string)[] = [], glue: SQLStatement | string = SQL`, `) {
  const result = SQL``
  statements.forEach((statement, i) => {
    if (i === 0) {
      result.append(glue)
    }

    result.append(statement)
  })

  return result
}

export function keys(item: Record<string, any>) {
  const sql = SQL`(`
  Object.keys(item).forEach((k, i) => {
    if (i !== 0) {
      sql.append(SQL`, `)
    }

    sql.append(SQL`"${raw(k)}"`)
  })
  sql.append(SQL`)`)
  return sql
}

export function values(list: any[]) {
  const sql = SQL`(`
  list.forEach((item, i) => {
    if (i !== 0) {
      sql.append(SQL`, `)
    }

    sql.append(SQL`${item}`)
  })

  sql.append(SQL`)`)
  return sql
}

export function offset(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return SQL``
  }

  return SQL` OFFSET ${value}`
}

export function limit(value: number | null | undefined, options: Partial<LimitOptions> = {}) {
  const min = options.min ?? 1
  const max = options.max ?? 100
  const defaultValue = options.defaultValue ?? 100

  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    value = defaultValue
  }

  if (value === null) {
    return SQL``
  }

  value = Math.max(Math.min(value, max), min)

  return SQL` LIMIT ${value}`
}