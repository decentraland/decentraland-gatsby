import { createHash } from 'crypto'
import {
  Model as BaseModel,
  OnConflict,
  PrimaryKey,
  QueryPart,
  SQLStatement,
} from 'decentraland-server'
import { withDatabaseMetrics } from './metrics'


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
    let props: string[] = []
    if (conditions) {
      props.push('conditions=' + Object.keys(conditions).sort().join(','))
    }

    if (orderBy) {
      props.push('orderBy=' + Object.keys(orderBy).sort().join(','))
    }

    return withDatabaseMetrics(() => super.find(conditions, orderBy, extra), {
      table: this.tableName,
      method: 'find',
      props: props.join('; ')
    })
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
    let props: string[] = []
    if (conditions) {
      props.push('conditions=' + Object.keys(conditions).sort().join(','))
    }

    if (orderBy) {
      props.push('orderBy=' + Object.keys(orderBy).sort().join(','))
    }

    return withDatabaseMetrics(
      () => super.findOne(conditions as PrimaryKey, orderBy),
      {
        table: this.tableName,
        method: 'findOne',
        props: props.join('; ')
      }
    )
  }

  static async count<U extends QueryPart = any>(
    conditions: Partial<U>,
    extra?: string
  ): Promise<number> {
    let props: string[] = []
    if (conditions) {
      props.push('conditions=' + Object.keys(conditions).sort().join(','))
    }

    return withDatabaseMetrics(
      () => super.count(conditions, extra),
      {
        table: this.tableName,
        method: 'count',
        props: props.join('; ')
      }
    )
  }

  static async create<U extends QueryPart = any>(row: U): Promise<U> {
    return withDatabaseMetrics(
      () => super.create(row),
      {
        table: this.tableName,
        method: 'create',
        props: 'row=' + Object.keys(row).sort().join(',')
      }
    )
  }

  static async upsert<U extends QueryPart = any>(
    row: U,
    onConflict?: OnConflict<U>
  ): Promise<U> {
    return withDatabaseMetrics(
      () => super.upsert(row, onConflict),
      {
        table: this.tableName,
        method: 'upsert',
        props: 'row=' + Object.keys(row).sort().join(',')
      }
    )
  }

  static async update<U extends QueryPart = any, P extends QueryPart = any>(
    changes: Partial<U>,
    conditions: Partial<P>
  ): Promise<any> {
    let props: string[] = []
    if (changes) {
      props.push('changes=' + Object.keys(changes).sort().join(','))
    }

    if (conditions) {
      props.push('conditions=' + Object.keys(conditions).sort().join(','))
    }

    return withDatabaseMetrics(
      () => super.update(changes, conditions),
      {
        table: this.tableName,
        method: 'update',
        props: props.join('; ')
      }
    )
  }

  static async delete<U extends QueryPart = any>(
    conditions: Partial<U>
  ): Promise<any> {
    return withDatabaseMetrics(
      () => super.delete(conditions),
      {
        table: this.tableName,
        method: 'delete',
        props: 'conditions=' + Object.keys(conditions).sort().join(',')
      }
    )
  }

  static async query<U extends {} = any>(query: SQLStatement): Promise<U[]> {
    return withDatabaseMetrics(
      () => super.query(query.text, query.values),
      {
        table: this.tableName,
        method: 'query',
        props: `hash=` + hash(query)
      }
    )
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
        props: `hash=` + hash(query)
      }
    )
  }
}
