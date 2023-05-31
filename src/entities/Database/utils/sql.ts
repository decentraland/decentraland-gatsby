import { Model, SQL, SQLStatement, raw } from 'decentraland-server'

import env from '../../../utils/env'
import { ServiceStartHandler } from '../../Server/types'
import database from '../database'
import { LimitOptions } from '../types'
import { ensureFieldNames } from './text'

export interface ModelConstructor {
  tableName: string
  new (): Model<any>
}

export { raw, SQL, SQLStatement }

export const databaseInitializer = (): ServiceStartHandler => {
  return async () => {
    if (env('DATABASE', 'true') === 'false') {
      return async () => {}
    }

    await database.connect()
    return async () => {
      await database.close()
    }
  }
}

export function table(model: ModelConstructor) {
  return raw('"' + model.tableName + '"')
}

export function conditional(condition: boolean, statement: SQLStatement) {
  if (condition) {
    return statement
  } else {
    return SQL``
  }
}

export function conditionValuesCompare<C>(keys: (keyof C)[], conditions: C) {
  ensureFieldNames(keys)
  return join(
    keys.map((field) => getCompareQuery(field, conditions[field])),
    SQL` AND `
  )
}

export function compareTableColumns(
  table1: SQLStatement,
  table2: SQLStatement,
  keys: (string | number | symbol)[]
) {
  ensureFieldNames(keys)
  return join(
    keys.map(
      (field: string) =>
        SQL`${table1}."${raw(field)}" = ${table2}."${raw(field)}"`
    ),
    SQL` AND `
  )
}

export function columns(names: string[]) {
  ensureFieldNames(names)
  const sql = SQL`(`
  sql.append(join(names.map((name) => SQL`"${raw(name)}"`)))
  sql.append(SQL`)`)
  return sql
}

export function columnsLabels(keys: string[]) {
  ensureFieldNames(keys)
  return SQL`(${join(keys.map((key) => SQL`"${raw(key)}"`))})`
}

export function setColumns<V>(keys: (keyof V)[], values: V) {
  ensureFieldNames(keys)
  return join(
    keys.map((field) => SQL`"${raw(String(field))}" = ${values[field]}`)
  )
}

export function values(list: any[]) {
  const sql = SQL`(`
  sql.append(join(list.map((item) => SQL`${item}`)))
  sql.append(SQL`)`)
  return sql
}

export function objectValues(names: string[], list: Record<string, any>[]) {
  ensureFieldNames(names)
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
    value = 0
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

export function getCompareQuery(field: string | number | symbol, value: any) {
  if (typeof field === 'symbol') {
    throw new Error('Unspected field of type symbol')
  }

  if (value === null || value === undefined) {
    return SQL`"${raw(field)}" IS NULL`
  }

  if (Array.isArray(value)) {
    return SQL`"${raw(field)}" IN ${values(value)}`
  }

  return SQL`"${raw(field)}" = ${value}`
}
