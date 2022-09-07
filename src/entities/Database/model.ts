import { createHash } from 'crypto'

import {
  Model as BaseModel,
  OnConflict,
  PrimaryKey,
  QueryPart,
  SQLStatement,
} from 'decentraland-server'

import { DatabaseMetricParams, withDatabaseMetrics } from './metrics'

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
  static getQueryNameLabel<U extends {} = any>(
    method: string,
    conditions?: PrimaryKey | Partial<U>,
    orderBy?: OrderBy<U>
  ): Partial<DatabaseMetricParams> {
    let queryNameLabel = `${this.tableName}_${method}`

    if (conditions) {
      queryNameLabel += `_${Object.keys(conditions).sort().join('_')}`
    }

    if (orderBy) {
      queryNameLabel += `_${Object.keys(orderBy).sort().join('_')}`
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
      this.getQueryNameLabel('find', conditions, orderBy)
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
      this.getQueryNameLabel('findOne', conditions)
    )
  }

  static async count<U extends QueryPart = any>(
    conditions: Partial<U>,
    extra?: string
  ): Promise<number> {
    return withDatabaseMetrics(
      () => super.count(conditions, extra),
      this.getQueryNameLabel('count', conditions)
    )
  }

  static async create<U extends QueryPart = any>(row: U): Promise<U> {
    return withDatabaseMetrics(
      () => super.create(row),
      this.getQueryNameLabel('create')
    )
  }

  static async upsert<U extends QueryPart = any>(
    row: U,
    onConflict?: OnConflict<U>
  ): Promise<U> {
    return withDatabaseMetrics(
      () => super.upsert(row, onConflict),
      this.getQueryNameLabel('upsert')
    )
  }

  static async update<U extends QueryPart = any, P extends QueryPart = any>(
    changes: Partial<U>,
    conditions: Partial<P>
  ): Promise<any> {
    return withDatabaseMetrics(
      () => super.update(changes, conditions),
      this.getQueryNameLabel('update', conditions)
    )
  }

  static async delete<U extends QueryPart = any>(
    conditions: Partial<U>
  ): Promise<any> {
    return withDatabaseMetrics(
      () => super.delete(conditions),
      this.getQueryNameLabel('delete', conditions)
    )
  }

  static async query<U extends {} = any>(query: SQLStatement): Promise<U[]> {
    return this.namedQuery(hash(query), query)
  }

  static async namedQuery<U extends {} = any>(
    name: string,
    query: SQLStatement
  ): Promise<U[]> {
    return withDatabaseMetrics(
      async () => {
        try {
          return super.query(query.text, query.values)
        } catch (err) {
          throw Object.assign(err, { text: query.text, values: query.values })
        }
      },
      {
        query: name,
      }
    )
  }

  /**
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
    return withDatabaseMetrics(
      async () => {
        try {
          const result = await this.db.client.query(query)
          return result.rowCount
        } catch (err) {
          throw Object.assign(err, { text: query.text, values: query.values })
        }
      },
      {
        query: name,
      }
    )
  }
}
