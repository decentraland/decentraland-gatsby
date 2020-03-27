import { Model, raw, SQLStatement, SQL } from "decentraland-server";

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