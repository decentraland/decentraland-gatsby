import { createHash } from 'crypto'

import {
  Model as BaseModel,
  OnConflict,
  PrimaryKey,
  QueryPart,
  SQLStatement,
} from 'decentraland-server'

import { DatabaseMetricParams, withDatabaseMetrics } from './metrics'

export const QUERY_HASHES = new Map<string, string>()
function hash(query: SQLStatement) {
  const hash = createHash('sha1').update(query.text).digest('hex')
  if (!QUERY_HASHES.has(hash)) {
    QUERY_HASHES.set(hash, query.text)
  }

  return hash
}

export class Model<T extends {}> extends BaseModel<T> {
  static async find<U extends {} = any>(
    conditions?: Partial<U>,
    orderBy?: Partial<U>,
    extra?: string
  ): Promise<U[]> {
    const params: Partial<DatabaseMetricParams> = {
      table: this.tableName,
      method: 'find',
    }

    if (conditions) {
      params.conditions = Object.keys(conditions).sort().join(',')
    }

    if (orderBy) {
      params.orderBy = Object.keys(orderBy).sort().join(',')
    }

    return withDatabaseMetrics(
      () => super.find(conditions, orderBy, extra),
      params
    )
  }

  static findOne<U extends {} = any, P extends QueryPart = any>(
    primaryKey: PrimaryKey,
    orderBy?: Partial<P>
  ): Promise<U | undefined>
  static findOne<U extends QueryPart = any, P extends QueryPart = any>(
    conditions: Partial<U>,
    orderBy?: Partial<P>
  ): Promise<U | undefined>
  static async findOne<U extends QueryPart = any, P extends QueryPart = any>(
    conditions: PrimaryKey | Partial<U>,
    orderBy?: Partial<P>
  ): Promise<U | undefined> {
    const params: Partial<DatabaseMetricParams> = {
      table: this.tableName,
      method: 'findOne',
    }

    if (conditions) {
      params.conditions = Object.keys(conditions).sort().join(',')
    }

    if (orderBy) {
      params.orderBy = Object.keys(orderBy).sort().join(',')
    }

    return withDatabaseMetrics(
      () => super.findOne(conditions as PrimaryKey, orderBy),
      params
    )
  }

  static async count<U extends QueryPart = any>(
    conditions: Partial<U>,
    extra?: string
  ): Promise<number> {
    const params: Partial<DatabaseMetricParams> = {
      table: this.tableName,
      method: 'count',
    }

    if (conditions) {
      params.conditions = Object.keys(conditions).sort().join(',')
    }

    return withDatabaseMetrics(() => super.count(conditions, extra), params)
  }

  static async create<U extends QueryPart = any>(row: U): Promise<U> {
    return withDatabaseMetrics(() => super.create(row), {
      table: this.tableName,
      method: 'create',
      rows: Object.keys(row).sort().join(','),
    })
  }

  static async upsert<U extends QueryPart = any>(
    row: U,
    onConflict?: OnConflict<U>
  ): Promise<U> {
    return withDatabaseMetrics(() => super.upsert(row, onConflict), {
      table: this.tableName,
      method: 'upsert',
      rows: Object.keys(row).sort().join(','),
    })
  }

  static async update<U extends QueryPart = any, P extends QueryPart = any>(
    changes: Partial<U>,
    conditions: Partial<P>
  ): Promise<any> {
    const params: Partial<DatabaseMetricParams> = {
      table: this.tableName,
      method: 'update',
    }

    if (changes) {
      params.updates = Object.keys(changes).sort().join(',')
    }

    if (conditions) {
      params.conditions = Object.keys(conditions).sort().join(',')
    }

    return withDatabaseMetrics(() => super.update(changes, conditions), params)
  }

  static async delete<U extends QueryPart = any>(
    conditions: Partial<U>
  ): Promise<any> {
    return withDatabaseMetrics(() => super.delete(conditions), {
      table: this.tableName,
      method: 'delete',
      conditions: Object.keys(conditions).sort().join(','),
    })
  }

  static async query<U extends {} = any>(query: SQLStatement): Promise<U[]> {
    return withDatabaseMetrics(() => super.query(query.text, query.values), {
      table: this.tableName,
      method: 'query',
      hash: hash(query),
    })
  }

  /**
   * Execute a query and returns the number of row affected
   */
  static async rowCount(query: SQLStatement): Promise<number> {
    return withDatabaseMetrics(
      async () => {
        const result = await this.db.client.query(query)
        return result.rowCount
      },
      {
        table: this.tableName,
        method: 'rowCount',
        hash: hash(query),
      }
    )
  }
}
