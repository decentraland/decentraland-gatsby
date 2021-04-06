import { Model as BaseModel, OnConflict, PrimaryKey, QueryPart, SQLStatement } from "decentraland-server";
import { database_duration_seconds, database_pool_size } from './metrics';

async function messureWithParams<T>(exec: () => Promise<T>, params: { queryId: string, [key: string]: any }): Promise<T> {
  database_pool_size.inc({ query: params.queryId })
  const complete = database_duration_seconds.startTimer({ query: params.queryId })
  try {
    const result = await exec()
    database_pool_size.dec({ query: params.queryId })
    complete({ error: 0 })
    return result
  } catch (err) {
    database_pool_size.dec({ query: params.queryId })
    complete({ error: 1 })
    Object.assign(err, params)
    throw err
  }
}

function getQueryId(methodName: string, table: string) {
  return (
    methodName[0] +
    (methodName.match(/[A-Z]/g) || [] ).join('') +
    table.split('_').map(word => word[0]).join('')
  ).toLowerCase()
}

export class Model<T extends {}> extends BaseModel<T> {

  static async find<U extends {} = any>(conditions?: Partial<U>, orderBy?: Partial<U>, extra?: string): Promise<U[]> {
    const queryId = getQueryId('find', this.tableName)
    return messureWithParams(
      () => super.find(conditions, orderBy, extra),
      { queryId, conditions, orderBy, extra }
    )
  }

  static findOne<U extends {} = any, P extends QueryPart = any>(primaryKey: PrimaryKey, orderBy?: Partial<P>): Promise<U | undefined>;
  static findOne<U extends QueryPart = any, P extends QueryPart = any>(conditions: Partial<U>, orderBy?: Partial<P>): Promise<U | undefined>;
  static async findOne<U extends QueryPart = any, P extends QueryPart = any>(conditions: PrimaryKey | Partial<U>, orderBy?: Partial<P>): Promise<U | undefined> {
    const queryId = getQueryId('findOne', this.tableName)
    return messureWithParams(
      () => super.findOne(conditions as PrimaryKey, orderBy),
      { queryId, conditions, orderBy }
    )
  }

  static async count<U extends QueryPart = any>(conditions: Partial<U>, extra?: string): Promise<number> {
    const queryId = getQueryId(
      'count',
      this.tableName
    )

    return messureWithParams(
      () => super.count(conditions, extra),
      { queryId, conditions, extra }
    )
  }

  static async create<U extends QueryPart = any>(row: U): Promise<U> {
    const queryId = getQueryId('create', this.tableName)
    return messureWithParams(
      () => super.create(row),
      { queryId, row }
    )
  }

  static async upsert<U extends QueryPart = any>(row: U, onConflict?: OnConflict<U>): Promise<U> {
    const queryId = getQueryId('upsert', this.tableName)
    return messureWithParams(
      () => super.upsert(row),
      { queryId, row, onConflict }
    )
  }


  static async update<U extends QueryPart = any, P extends QueryPart = any>(changes: Partial<U>, conditions: Partial<P>): Promise<any> {
    const queryId = getQueryId(
      'update',
      this.tableName
    )

    return messureWithParams(
      () => super.update(changes, conditions),
      { queryId, changes, conditions }
    )
  }

  static async delete<U extends QueryPart = any>(conditions: Partial<U>): Promise<any> {
    const queryId = getQueryId(
      'update',
      this.tableName
    )

    return messureWithParams(
      () => super.delete(conditions),
      { queryId, conditions }
    )
  }

  static async query<U extends {}= any>(query: SQLStatement): Promise<U[]> {
    const queryId = getQueryId('query', this.tableName)
    return messureWithParams(
      () => super.query(query.text, query.values),
      { queryId, query: query.text, values: query.values }
    )
  }

  /**
   * Execute a query and returns the number of row affected
   */
  static async rowCount(query: SQLStatement): Promise<number> {
    const queryId = getQueryId('rowCount', this.tableName)
    return messureWithParams(
      async () => {
        const result = await this.db.client.query(query)
        return result.rowCount
      },
      { queryId, query: query.text, values: query.values }
    )
  }
}