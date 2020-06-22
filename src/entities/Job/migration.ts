/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder } from 'node-pg-migrate';
import Model from './model'

export async function up(pgm: MigrationBuilder): Promise<void> {

  pgm.createTable(Model.tableName, {
    id: {
      type: 'UUID',
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    payload: {
      type: 'JSON',
      notNull: true
    },
    run_at: {
      type: 'TIMESTAMP',
      notNull: true
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: 'now()'
    }
  })

  pgm.createIndex(Model.tableName, ['run_at'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Model.tableName)
}
