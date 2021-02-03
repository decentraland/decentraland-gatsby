import { Model as BaseModel, SQLStatement } from "decentraland-server";

export class Model<T> extends BaseModel<T> {

  static async query<U = any>(query: SQLStatement): Promise<U[]> {
    try {
      return super.query(query.text, query.values)
    } catch (err) {
      err.query = query.text
      err.values = query.values
      throw err
    }
  }

  /**
   * Execute a query and returns the number of row affected
   */
  static async rowCount(query: SQLStatement): Promise<number> {
    try {
      const result = await this.db.client.query(query)
      return result.rowCount
    } catch (err) {
      err.query = query.text
      err.values = query.values
      throw err
    }
  }
}