import { Model, raw, SQLStatement, SQL } from 'decentraland-server'
import { LimitOptions } from './types'

export interface ModelConstructor {
  tableName: string
  new (): Model<any>
}

export { raw, SQL, SQLStatement }

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
  sql.append(join(names.map((name) => SQL`"${raw(name)}"`)))
  sql.append(SQL`)`)
  return sql
}

export function values(list: any[]) {
  const sql = SQL`(`
  sql.append(join(list.map((item) => SQL`${item}`)))
  sql.append(SQL`)`)
  return sql
}

export function objectValues(names: string[], list: Record<string, any>[]) {
  return join(list.map((item) => values(names.map((name) => item[name]))))
}

export function join(statements: SQLStatement[], glue: SQLStatement = SQL`, `) {
  const sql = SQL``

  statements.forEach((statement, i) => {
    if (i !== 0) {
      sql.append(glue)
    }

    sql.append(statement)
  })

  return sql
}

export function offset(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return SQL``
  }

  return SQL` OFFSET ${value}`
}

export function limit(
  value: number | null | undefined,
  options: Partial<LimitOptions> = {}
) {
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
