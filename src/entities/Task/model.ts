import { randomUUID } from 'crypto'

import Task from './Task'
import { CreateTaskAttributes, TaskAttributes, TaskStatus } from './types'
import Time from '../../utils/date/Time'
import { Model } from '../Database/model'
import { SQL, SQLStatement, join, table } from '../Database/utils'

export default class TaskModel extends Model<TaskAttributes> {
  static tableName = 'tasks'

  static async namedInsertQuery(name: string, sql: SQLStatement) {
    return this.namedRowCount(
      name,
      SQL`
      INSERT
        INTO ${table(
          this
        )} ("id", "name", "status", "runner", "run_at", "created_at", "updated_at")
        ${sql}
    `
    )
  }

  static async initialize(tasks: Task[]) {
    tasks = tasks.filter((task) => task.repeateAt() !== null)

    if (!tasks.length) {
      return 0
    }

    const now = new Date()
    // Only insert tasks that are not already scheduled
    return this.namedRowCount(
      'initialize_tasks',
      SQL`
      INSERT INTO ${table(
        this
      )} ("id", "name", "status", "runner", "run_at", "created_at", "updated_at")
      SELECT * FROM (VALUES ${join(
        tasks.map(
          (task) => SQL`(
            ${randomUUID()}, 
            ${task.name}, 
            ${TaskStatus.pending}::type_task_status, 
            ${null}, 
            to_timestamp(${new Date(
              task.repeateAt()!.getTime()
            ).toJSON()}, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp(${now.toJSON()}, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp(${now.toJSON()}, 'YYYY-MM-DDTHH:MI:SS.MSZ')
          )`
        ),
        SQL`, `
      )}) AS new_tasks("id", "name", "status", "runner", "run_at", "created_at", "updated_at")
      WHERE NOT EXISTS (
        SELECT 1 FROM ${table(this)} 
        WHERE "name" = new_tasks."name" AND "status" = ${
          TaskStatus.pending
        }::type_task_status
      )
    `
    )
  }

  static async lock(options: {
    id: string
    taskNames: string[]
    limit?: number
  }): Promise<TaskAttributes[]> {
    const limit = options.limit ?? 1
    if (limit < 1) {
      return []
    }

    const names = options.taskNames ?? []
    if (names.length === 0) {
      return []
    }

    const now = new Date()

    // Locks and returns the tasks that are locked (only one task per name to avoid duplicates)
    // It only locks tasks that are not already running and are pending.
    // If there's a task left in a wrong running state, it will be released by the timeout query.
    const lockTasksResult = await this.namedQuery<TaskAttributes>(
      'lock_task',
      SQL`
      WITH locked_candidates AS (
        SELECT "id", "name", "status", "runner", "run_at", "created_at", "updated_at"
        FROM
          ${table(this)}
        WHERE
          "runner" IS NULL AND
          "status" = ${TaskStatus.pending}::type_task_status AND
          "name" IN (${join(
            names.map((name) => SQL`${name}`),
            SQL`, `
          )}) AND
          "run_at" <= ${now} AND
          NOT EXISTS (
            SELECT 1 FROM ${table(this)} t2 
            WHERE t2."name" = ${table(this)}."name" 
            AND t2."status" = ${TaskStatus.running}::type_task_status
          )
        FOR UPDATE SKIP LOCKED
      ),
      selected_tasks AS (
        SELECT DISTINCT ON ("name") "id", "name", "status", "runner", "run_at", "created_at", "updated_at"
        FROM locked_candidates
        ORDER BY "name", "run_at" ASC
        LIMIT ${limit}
      )
      UPDATE
        ${table(this)}
      SET
        "runner" = ${options.id},
        "status" = ${TaskStatus.running}::type_task_status,
        "updated_at" = ${now},
        "run_at" = ${now}
      FROM selected_tasks
      WHERE
        ${table(this)}."id" = selected_tasks."id"
      RETURNING *`
    )

    return lockTasksResult
  }

  static async completeTasks(tasks: TaskAttributes[]) {
    if (tasks.length === 0) {
      return 0
    }

    return this.namedRowCount(
      `complete_tasks`,
      SQL`
      DELETE
        FROM ${table(this)}
        WHERE "id" IN (${join(
          tasks.map((task) => SQL`${task.id}`),
          SQL`, `
        )})
    `
    )
  }

  static async schedule(tasks: CreateTaskAttributes[]) {
    if (tasks.length === 0) {
      return 0
    }

    const now = new Date()

    // Simple: Always schedule, let locking handle concurrency
    return this.namedRowCount(
      'schedule_tasks',
      SQL`
    INSERT INTO ${table(
      this
    )} ("id", "name", "status", "runner", "run_at", "created_at", "updated_at")
        VALUES ${join(
          tasks.map(
            (task) =>
              SQL`(${randomUUID()}, ${task.name}, ${
                TaskStatus.pending
              }::type_task_status, ${null}, ${task.run_at}, ${now}, ${now})`
          ),
          SQL`, `
        )}
    `
    )
  }

  static async releaseTimeout() {
    const now = new Date()
    const timeout = new Date(now.getTime() - Time.Minute * 10)
    return this.namedRowCount(
      `release_timeout`,
      SQL`
      DELETE FROM ${table(this)}
      WHERE
        "runner" IS NOT NULL AND
        "status" = ${TaskStatus.running}::type_task_status AND
        "run_at" < ${timeout}
    `
    )
  }
}
