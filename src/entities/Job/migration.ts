/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder } from 'node-pg-migrate';
import Model from './model'

export async function up(pgm: MigrationBuilder): Promise<void> {

  pgm.createTable(Model.tableName, {
    id: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    payload: {
      type: 'TEXT',
      notNull: true
    },
    run_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: 'now()'
    }
  })

  pgm.createIndex(Model.tableName, ['run_at'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Model.tableName)
}
