import { createHash } from 'crypto'

import { Model as BaseModel } from 'decentraland-server'
import type { OnConflict, PrimaryKey, QueryPart } from 'decentraland-server'

import { DatabaseMetricParams, withDatabaseMetrics } from './metrics'
import {
  SQL,
  SQLStatement,
  columns,
  compareTableColumns,
  conditionValuesCompare,
  conditional,
  join,
  objectValues,
  raw,
  setColumns,
  table,
} from './utils/sql'

import type { QueryResult } from 'pg'

export type OrderBy<U extends Record<string, any> = {}> = Partial<
  Record<keyof U, 'asc' | 'desc'>
>

export const QUERY_HASHES = new Map<string, string>()
function hash(query: SQLStatement) {
  const hash = createHash('sha1').update(query.text).digest('hex')
  if (!QUERY_HASHES.has(hash)) {
    QUERY_HASHES.set(hash, query.text)
  }

  return hash
}

export class Model<T extends {}> extends BaseModel<T> {
  private static getLabels<U extends {} = any>(
    method: string,
    conditions?: PrimaryKey | Partial<U>,
    orderBy?: OrderBy<U>
  ): Partial<DatabaseMetricParams> {
    let queryNameLabel = `${this.tableName}_${method}`

    if (conditions) {
      queryNameLabel += `_by_${Object.keys(conditions).sort().join('_')}`
    }

    if (orderBy) {
      queryNameLabel += `_order_${Object.keys(orderBy).sort().join('_')}`
    }

    return {
      query: queryNameLabel,
    }
  }

  static async find<U extends {} = any>(
    conditions?: Partial<U>,
    orderBy?: OrderBy<U>,
    extra?: string
  ): Promise<U[]> {
    return withDatabaseMetrics(
      () => super.find(conditions, orderBy as any, extra),
      this.getLabels('find', conditions, orderBy)
    )
  }

  static findOne<U extends {} = any, P extends QueryPart = any>(
    primaryKey: PrimaryKey,
    orderBy?: OrderBy<P>
  ): Promise<U | undefined>
  static findOne<U extends QueryPart = any, P extends QueryPart = any>(
    conditions: Partial<U>,
    orderBy?: OrderBy<P>
  ): Promise<U | undefined>
  static async findOne<U extends QueryPart = any, P extends QueryPart = any>(
    conditions: PrimaryKey | Partial<U>,
    orderBy?: OrderBy<P>
  ): Promise<U | undefined> {
    return withDatabaseMetrics(
      () => super.findOne(conditions as PrimaryKey, orderBy as any),
      this.getLabels('findOne', conditions)
    )
  }

  static async count<U extends QueryPart = any>(
    conditions: Partial<U>,
    extra?: string
  ): Promise<number> {
    return withDatabaseMetrics(
      () => super.count(conditions, extra),
      this.getLabels('count', conditions)
    )
  }

  static async create<U extends QueryPart = any>(row: U): Promise<U> {
    return withDatabaseMetrics(
      () => super.create(row),
      this.getLabels('create')
    )
  }

  static async createOne<U extends QueryPart = any>(row: U): Promise<number> {
    return this.createMany([row])
  }

  static async createMany<U extends QueryPart = any>(
    rows: U[]
  ): Promise<number> {
    if (rows.length === 0) {
      return 0
    }

    const keys = Object.keys(rows[0])

    const sql = SQL`
      INSERT INTO ${table(this)}
        ${columns(keys)}
      VALUES
        ${objectValues(keys, rows)}
    `

    return this.namedRowCount(`${this.tableName}_create_many`, sql)
  }

  static async upsert<U extends QueryPart = any>(
    row: U,
    onConflict?: OnConflict<U>
  ): Promise<U> {
    return withDatabaseMetrics(
      () => super.upsert(row, onConflict),
      this.getLabels('upsert')
    )
  }

  static async update<U extends QueryPart = any, P extends QueryPart = any>(
    changes: Partial<U>,
    conditions: Partial<P>
  ): Promise<any> {
    return withDatabaseMetrics(
      () => super.update(changes, conditions),
      this.getLabels('update', conditions)
    )
  }

  static async updateTo<U extends QueryPart = any, P extends QueryPart = any>(
    changes: Partial<U>,
    conditions: Partial<P>
  ): Promise<number> {
    const updateKeys = Object.keys(changes) as string[]
    const conditionKeys = Object.keys(conditions) as string[]

    if (conditionKeys.length === 0) {
      throw new Error(
        `At least 1 confition is required to perform an update on "${this.tableName}"`
      )
    }

    if (updateKeys.length === 0) {
      return 0
    }

    if (
      conditionKeys.some(
        (field) =>
          Array.isArray(conditions[field]) && conditions[field]?.length === 0
      )
    ) {
      return 0
    }

    const sql = SQL`
      UPDATE ${table(this)}
        SET
          ${setColumns(updateKeys, changes)}
        WHERE
        ${conditionValuesCompare(conditionKeys, conditions)}
    `

    return this.namedRowCount(
      `${this.tableName}_update_to_by_${conditionKeys.join('_')}`,
      sql
    ) as any
  }

  static async updateMany<U extends Record<string, any> = Record<string, any>>(
    changes: Partial<U>[],
    keys: (keyof U)[],
    updates?: (keyof U)[]
  ): Promise<number> {
    if (changes.length === 0) {
      return 0
    }

    if (keys.length === 0) {
      throw new Error(
        `At least 1 key is required to perform an update on "${this.tableName}"`
      )
    }

    const updateFields = (updates ?? Object.keys(changes[0])).filter(
      (key) => !keys.includes(key)
    ) as string[]

    const allFields = [...keys, ...updateFields] as string[]

    const withTimestamps =
      !!this.withTimestamps && !updateFields.includes('updated_at')

    const sql = SQL`
      UPDATE ${table(this)}
        SET
          ${join(
            updateFields.map(
              (field) => SQL`"${raw(field)}" = "_tmp_"."${raw(field)}"`
            )
          )}
          ${conditional(withTimestamps, SQL`, "updated_at" = NOW()`)}
        FROM
          (values ${objectValues(allFields, changes)}) AS "_tmp_" ${columns(
      allFields
    )}
        WHERE
          ${compareTableColumns(table(this), raw('"_tmp_"'), keys)}
    `

    const name = `${this.tableName}_update_many_by_${keys.sort().join('_')}`
    return this.namedRowCount(name, sql)
  }

  static async delete<U extends QueryPart = any>(
    conditions: Partial<U>
  ): Promise<QueryResult<never>> {
    return withDatabaseMetrics(
      () => super.delete(conditions),
      this.getLabels('delete', conditions)
    )
  }

  /**
   * @deprecated use namedQuery instead
   * @returns
   */
  static async query<U extends {} = any>(query: SQLStatement): Promise<U[]> {
    return this.namedQuery(hash(query), query)
  }

  static async namedQuery<U extends {} = any>(
    name: string,
    query: SQLStatement
  ): Promise<U[]> {
    return withDatabaseMetrics(async () => {
      try {
        return super.query(query.text, query.values)
      } catch (err) {
        throw Object.assign(err, { text: query.text, values: query.values })
      }
    }, this.getLabels(name))
  }

  /**
   * @deprecated use namedRowCount instead
   * Execute a query and returns the number of row affected
   */
  static async rowCount(query: SQLStatement): Promise<number> {
    return this.namedRowCount(hash(query), query)
  }

  /**
   * Execute a query and returns the number of row affected
   */
  static async namedRowCount(
    name: string,
    query: SQLStatement
  ): Promise<number> {
    return withDatabaseMetrics(async () => {
      try {
        const result = await this.db.client.query(query)
        return result.rowCount
      } catch (err) {
        throw Object.assign(err, { text: query.text, values: query.values })
      }
    }, this.getLabels(name))
  }
}
