/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder } from 'node-pg-migrate'
import Model from './model'
import { TaskStatus } from './types'

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('type_tast_status', [TaskStatus.pending, TaskStatus.running])

  pgm.createTable(Model.tableName, {
    id: {
      type: 'VARCHAR(36)',
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(64)',
      notNull: true,
    },
    status: {
      type: 'type_tast_status',
      notNull: true,
    },
    payload: {
      type: 'TEXT',
      notNull: true,
      default: '{}',
    },
    runner: {
      type: 'VARCHAR(36)',
    },
    run_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: 'now()',
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
  })

  pgm.createIndex(Model.tableName, ['runner', 'status', 'name', 'run_at'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Model.tableName, { cascade: true })
  pgm.dropType('type_tast_status')
}
