import { MigrationBuilder } from 'node-pg-migrate'

const INDEX_NAME = 'task_unique_pending_name'

/**
 * Adds a partial unique index on (name) for pending tasks, ensuring that at
 * most one pending task per name can exist at any time. This prevents race
 * conditions where concurrent schedule/initialize calls could insert duplicate
 * pending rows for the same task name.
 *
 * Before creating the index, any pre-existing duplicates are cleaned up by
 * keeping the oldest pending task per name (by created_at) and removing the rest.
 */
export async function up(pgm: MigrationBuilder): Promise<void> {
  // Remove duplicate pending tasks that may have been created by the old code,
  // which had no protection against concurrent inserts. For each name, keep
  // only the oldest pending row (by created_at) so the index can be created.
  pgm.sql(`
    DELETE FROM tasks
    WHERE status = 'pending'
      AND id NOT IN (
        SELECT DISTINCT ON (name) id
        FROM tasks
        WHERE status = 'pending'
        ORDER BY name, created_at ASC
      )
  `)

  // The partial unique index only applies to pending tasks, so running tasks
  // are unconstrained — multiple runners can hold the same task name without
  // conflict. All INSERT paths now use ON CONFLICT DO NOTHING to gracefully
  // handle races against this constraint.
  pgm.sql(
    `CREATE UNIQUE INDEX ${INDEX_NAME} ON tasks (name) WHERE status = 'pending'`
  )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP INDEX ${INDEX_NAME}`)
}
