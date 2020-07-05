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

export function columns(names: string[]) {
  const sql = SQL`(`
  names.forEach((name, i) => {
    if (i !== 0) {
      sql.append(SQL`, `)
    }

    sql.append(SQL`"${raw(name)}"`)
  })
  sql.append(SQL`)`)
  return sql
}

export function values(names: string[], list: Record<string, any>[]) {
  const sql = SQL`(`
  list.forEach((_, i) => {
    if (i !== 0) {
      sql.append(SQL`), (`)
    }

    names.forEach((value, i) => {
      if (i !== 0) {
        sql.append(SQL`, `)
      }

      sql.append(SQL`${value}`)
    })
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