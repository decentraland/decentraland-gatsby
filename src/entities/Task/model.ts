import { v4 as uuid } from 'uuid'
import Time from '../../utils/date/Time'
import { Model } from '../Database/model'
import { join, SQL, SQLStatement, table } from '../Database/utils'
import { Task } from './Task'
import { CreateTaskAttributes, TaskAttributes, TaskStatus } from './types'

export default class TaskModel extends Model<TaskAttributes> {
  static tableName = 'tasks'

  static async insertQuery(sql: SQLStatement) {
    return this.rowCount(SQL`
      INSERT
        INTO ${table(
          this
        )} ("id", "name", "status", "payload", "runner", "run_at", "created_at", "updated_at")
        VALUES ${sql}
    `)
  }

  static async initialize(tasks: Task[]) {
    tasks = tasks.filter((task) => task.repeateAt() !== null)

    if (tasks.length) {
      return 0
    }

    const now = new Date()
    const alreadyInitializedTasks = SQL`SELECT DISTINCT "name" FROM ${table(
      this
    )}`
    const newTasks = join(
      tasks
        .filter((task) => task.repeateAt() !== null)
        .map(
          (task) => SQL`(SELECT
            ${uuid()} as "id",
            ${task.name} as "name",
            ${TaskStatus.pending} as "status",
            ${JSON.stringify({})} as "payload",
            ${null} as "runner",
            ${task.repeateAt()} as "run_at",
            ${now} as "created_at",
            ${now} as "updated_at"
          )`
        ),
      SQL` union `
    )

    const missingInitializedTasks = SQL`(
      SELECT * FROM (${newTasks}) as t WHERE "name" NOT IN (${alreadyInitializedTasks})
    )`

    return this.insertQuery(missingInitializedTasks)
  }

  static async lock(options: {
    id: string
    names: string[]
    limit?: number
  }): Promise<TaskAttributes[]> {
    const limit = options.limit ?? 1
    if (limit < 1) {
      return []
    }

    const names = options.names
    if (names.length === 0) {
      return []
    }

    const now = new Date()
    const locked = await this.rowCount(SQL`
      UPDATE ${table(this)}
      SET
        "runner" = ${options.id},
        "status" = ${TaskStatus.running},
        "updated_at" = ${now}
      WHERE
        "runner" IS NULL AND
        "status" = ${TaskStatus.pending},
        "name" IN (${join(
          names.map((name) => SQL`${name}`),
          SQL`, `
        )})
        "run_at" < ${now}
      ORDER BY
        "run_at" ASC
      LIMIT
        ${limit}
    `)

    if (locked === 0) {
      return []
    }

    const tasks: TaskAttributes<any>[] = await this.query(SQL`
      SELECT * FROM ${table(this)}
      WHERE
        "runner" = ${options.id},
        "status" = ${TaskStatus.running}
    `)

    return tasks.map((task) => ({
      ...task,
      payload: task.payload ? JSON.parse(task.payload) : {},
    }))
  }

  static async complete(tasks: TaskAttributes[]) {
    return this.rowCount(SQL`
      DELETE
        FROM ${table(this)}
        WHERE "id" IN (${join(
          tasks.map((task) => SQL`${task.id}`),
          SQL`, `
        )})
    `)
  }

  static async schedule(tasks: CreateTaskAttributes[]) {
    const now = new Date()
    return this.insertQuery(
      join(
        tasks.map(
          (task) =>
            SQL`(${uuid()}, ${task.name}, ${
              TaskStatus.pending
            }, ${JSON.stringify(task.payload)}, ${null}, ${
              task.run_at
            }, ${now}, ${now})`
        ),
        SQL`, `
      )
    )
  }

  static async releaseTimeout() {
    const now = new Date()
    const timeout = new Date(now.getTime() - Time.Minute * 30)
    return this.rowCount(SQL`
      UPDATE ${table(this)}
      SET
        "runner" IS NULL,
        "status" = ${TaskStatus.pending},
        "updated_at" = ${now}
      WHERE
        "runner" IS NOT NULL,
        "status" = ${TaskStatus.running},
        "updated_at" < ${timeout}
    `)
  }
}
