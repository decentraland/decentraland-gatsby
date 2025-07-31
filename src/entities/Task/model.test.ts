import { randomUUID } from 'crypto'

import { format } from 'sql-formatter'
import isUUID from 'validator/lib/isUUID'

import { SQLStatement } from 'decentraland-server'

import TaskModel from './model'
import Task from './Task'
import { TaskStatus } from './types'

let query: jest.MockedFunction<any>
let namedQuery: jest.SpyInstance
const rawQueryResults = {
  rows: [],
  fields: [],
  command: '',
  rowCount: 0,
}

const rawQuery = jest.fn((sql: SQLStatement) => sql && rawQueryResults)

const sqlFormat = (sql: string) =>
  format(sql)
    .trim()
    .split(`\n`)
    .map((line) => line.trim())
    .join('\n')

describe(`src/entities/Task/model`, () => {
  beforeEach(() => {
    TaskModel.setDb('postgres')
    query = jest.spyOn(TaskModel.db, 'query')
    query.mockReturnValue([])
    namedQuery = jest.spyOn(TaskModel, 'namedQuery')
    namedQuery.mockResolvedValue([])

    TaskModel.db.client = { query: rawQuery } as any
  })

  describe(`initialize`, () => {
    test(`should skip the initialization if there is not any task`, async () => {
      const initial = rawQuery.mock.calls.length
      const initialized = await TaskModel.initialize([])
      expect(rawQuery.mock.calls.length).toEqual(initial)
      expect(initialized).toEqual(0)
    })
    test(`should skip if ther is no recursive task`, async () => {
      const initial = rawQuery.mock.calls.length
      const initialized = await TaskModel.initialize([
        new Task({
          name: 'test_task',
          task: async () => null,
        }),
      ])
      expect(rawQuery.mock.calls.length).toEqual(initial)
      expect(initialized).toEqual(0)
    })

    test(`should initialize if there is at least one recursive task`, async () => {
      const initial = rawQuery.mock.calls.length
      await TaskModel.initialize([
        new Task({
          name: 'test_task',
          repeat: Task.Repeat.Yearly,
          task: async () => null,
        }),
      ])

      expect(rawQuery.mock.calls.length).toEqual(initial + 1)
      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
      INSERT INTO
      "tasks" (
        "id",
        "name",
        "status",
        "runner",
        "run_at",
        "created_at",
        "updated_at"
      )
      SELECT
        *
      FROM
        (
          VALUES
          (
            $1,
            $2,
            $3::type_task_status,
            $4,
            to_timestamp($5, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($6, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($7, 'YYYY-MM-DDTHH:MI:SS.MSZ')
          )
        ) AS new_tasks(
          "id",
          "name",
          "status",
          "runner",
          "run_at",
          "created_at",
          "updated_at"
        )
      WHERE
        NOT EXISTS (
          SELECT
            1
          FROM
            "tasks"
          WHERE
            "name" = new_tasks."name"
            AND "status" = $8::type_task_status
        )
      `)
      )

      expect(isUUID(sql.values[0])).toBe(true)
      expect(sql.values[1]).toBe('test_task')
      expect(sql.values[2]).toBe(TaskStatus.pending)
      expect(sql.values[3]).toBe(null)
      expect(Number.isFinite(Date.parse(sql.values[4]))).toBe(true)
      expect(Number.isFinite(Date.parse(sql.values[5]))).toBe(true)
      expect(Number.isFinite(Date.parse(sql.values[6]))).toBe(true)
      expect(sql.values[7]).toBe(TaskStatus.pending)
    })

    test(`should initialize if there is more than one recursive task`, async () => {
      const initial = rawQuery.mock.calls.length
      await TaskModel.initialize([
        new Task({
          name: 'test_task_1',
          repeat: Task.Repeat.Yearly,
          task: async () => null,
        }),
        new Task({
          name: 'test_task_2',
          repeat: Task.Repeat.Yearly,
          task: async () => null,
        }),
        new Task({
          name: 'test_task_3',
          repeat: Task.Repeat.Yearly,
          task: async () => null,
        }),
      ])

      expect(rawQuery.mock.calls.length).toEqual(initial + 1)
      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
      INSERT INTO
      "tasks" (
        "id",
        "name",
        "status",
        "runner",
        "run_at",
        "created_at",
        "updated_at"
      )
      SELECT
        *
      FROM
        (
          VALUES
          (
            $1,
            $2,
            $3::type_task_status,
            $4,
            to_timestamp($5, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($6, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($7, 'YYYY-MM-DDTHH:MI:SS.MSZ')
          ),
          (
            $8,
            $9,
            $10::type_task_status,
            $11,
            to_timestamp($12, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($13, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($14, 'YYYY-MM-DDTHH:MI:SS.MSZ')
          ),
          (
            $15,
            $16,
            $17::type_task_status,
            $18,
            to_timestamp($19, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($20, 'YYYY-MM-DDTHH:MI:SS.MSZ'),
            to_timestamp($21, 'YYYY-MM-DDTHH:MI:SS.MSZ')
          )
        ) AS new_tasks(
          "id",
          "name",
          "status",
          "runner",
          "run_at",
          "created_at",
          "updated_at"
        )
      WHERE
        NOT EXISTS (
          SELECT
            1
          FROM
            "tasks"
          WHERE
            "name" = new_tasks."name"
            AND "status" = $22::type_task_status
        )
      `)
      )
    })
  })

  describe(`lock`, () => {
    test(`should not run a query if limit is lower than one`, async () => {
      const initial = namedQuery.mock.calls.length
      await TaskModel.lock({
        id: randomUUID(),
        taskNames: ['test_name'],
        limit: 0,
      })
      expect(namedQuery.mock.calls.length).toEqual(initial)
    })

    test(`should not run a query if there is no taskNames`, async () => {
      const initial = namedQuery.mock.calls.length
      await TaskModel.lock({ id: randomUUID(), taskNames: [] })
      expect(namedQuery.mock.calls.length).toEqual(initial)
    })

    test(`should run a query when taskNames are provided`, async () => {
      const initial = namedQuery.mock.calls.length
      namedQuery.mockResolvedValueOnce([])

      await TaskModel.lock({ id: randomUUID(), taskNames: ['test_task'] })
      expect(namedQuery.mock.calls.length).toEqual(initial + 1)

      const [name, sql] =
        namedQuery.mock.calls[namedQuery.mock.calls.length - 1]
      expect(name).toBe('lock_task')
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
        WITH locked_candidates AS (
          SELECT "id", "name", "status", "runner", "run_at", "created_at", "updated_at"
          FROM
            "tasks"
          WHERE
            "runner" IS NULL AND
            "status" = $1::type_task_status AND
            "name" IN ($2) AND
            "run_at" <= $3::timestamptz
          FOR UPDATE SKIP LOCKED
        ),
        selected_tasks AS (
          SELECT DISTINCT ON ("name") "id", "name", "status", "runner", "run_at", "created_at", "updated_at"
          FROM locked_candidates
          ORDER BY "name", "run_at" ASC
          LIMIT $4
        )
        UPDATE
          "tasks"
        SET
          "runner" = $5,
          "status" = $6::type_task_status,
          "updated_at" = $7::timestamptz,
          "run_at" = $8::timestamptz
        FROM selected_tasks
        WHERE
          "tasks"."id" = selected_tasks."id"
        RETURNING *
      `)
      )
    })

    test(`should run only one query with CTE to lock and return tasks`, async () => {
      const id = randomUUID()
      const initialLock = namedQuery.mock.calls.length
      namedQuery.mockResolvedValueOnce([
        {
          id: 'task-id',
          name: 'test_task',
          status: TaskStatus.running,
          runner: id,
          run_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])

      const result = await TaskModel.lock({ id, taskNames: ['test_task'] })
      expect(namedQuery.mock.calls.length).toEqual(initialLock + 1)
      expect(result).toHaveLength(1)
      expect(result[0].runner).toBe(id)

      const [name, sqlLock] =
        namedQuery.mock.calls[namedQuery.mock.calls.length - 1]
      expect(name).toBe('lock_task')
      expect(sqlFormat(sqlLock.text)).toEqual(
        sqlFormat(`
        WITH locked_candidates AS (
          SELECT "id", "name", "status", "runner", "run_at", "created_at", "updated_at"
          FROM
            "tasks"
          WHERE
            "runner" IS NULL AND
            "status" = $1::type_task_status AND
            "name" IN ($2) AND
            "run_at" <= $3::timestamptz
          FOR UPDATE SKIP LOCKED
        ),
        selected_tasks AS (
          SELECT DISTINCT ON ("name") "id", "name", "status", "runner", "run_at", "created_at", "updated_at"
          FROM locked_candidates
          ORDER BY "name", "run_at" ASC
          LIMIT $4
        )
        UPDATE
          "tasks"
        SET
          "runner" = $5,
          "status" = $6::type_task_status,
          "updated_at" = $7::timestamptz,
          "run_at" = $8::timestamptz
        FROM selected_tasks
        WHERE
          "tasks"."id" = selected_tasks."id"
        RETURNING *
      `)
      )
    })
  })

  describe(`complete`, () => {
    test(`should not run a query if there is no task to complete`, async () => {
      const initial = rawQuery.mock.calls.length
      rawQuery.mockReturnValue({
        rows: [],
        fields: [],
        command: '',
        rowCount: 0,
      })

      await TaskModel.completeTasks([])
      expect(rawQuery.mock.calls.length).toEqual(initial)
    })

    test(`should not run a query if there is more than one task to complete`, async () => {
      const initial = rawQuery.mock.calls.length
      rawQuery.mockReturnValue({
        rows: [],
        fields: [],
        command: '',
        rowCount: 0,
      })

      await TaskModel.completeTasks([
        { id: randomUUID() } as any,
        { id: randomUUID() } as any,
        { id: randomUUID() } as any,
      ])
      expect(rawQuery.mock.calls.length).toEqual(initial + 1)

      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
        DELETE
          FROM "tasks"
          WHERE "id" IN ($1, $2, $3)
      `)
      )
    })
  })

  describe(`schedule`, () => {
    test(`should not run a query if there is no task to schedule`, async () => {
      const initial = rawQuery.mock.calls.length
      rawQuery.mockReturnValue({
        rows: [],
        fields: [],
        command: '',
        rowCount: 0,
      })

      await TaskModel.schedule([])
      expect(rawQuery.mock.calls.length).toEqual(initial)
    })

    test(`should run a query if there at least one task to schedule`, async () => {
      const initial = rawQuery.mock.calls.length
      rawQuery.mockReturnValue({
        rows: [],
        fields: [],
        command: '',
        rowCount: 0,
      })

      await TaskModel.schedule([
        {
          name: 'test_task',
          run_at: new Date(),
        },
        {
          name: 'test_task',
          run_at: new Date(),
        },
      ])
      expect(rawQuery.mock.calls.length).toEqual(initial + 1)

      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
        INSERT
          INTO "tasks"
            ("id", "name", "status", "runner", "run_at", "created_at", "updated_at")
        VALUES
          ($1, $2, $3::type_task_status, $4, $5, $6, $7),
          ($8, $9, $10::type_task_status, $11, $12, $13, $14)
      `)
      )
    })
  })

  describe(`releaseTimeout`, () => {
    test(`should a query to release timeouted tasks`, async () => {
      const initial = rawQuery.mock.calls.length
      rawQuery.mockReturnValue({
        rows: [],
        fields: [],
        command: '',
        rowCount: 0,
      })

      await TaskModel.releaseTimeout()
      expect(rawQuery.mock.calls.length).toEqual(initial + 1)

      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
        UPDATE "tasks"
        SET
          "runner" = NULL,
          "status" = $1::type_task_status,
          "updated_at" = $2
        WHERE
          "runner" IS NOT NULL AND
          "status" = $3::type_task_status AND
          "run_at" < $4
          AND NOT EXISTS (
            SELECT
              1
            FROM
              "tasks"
            WHERE
              "name" = "tasks"."name"
              AND "status" = $5::type_task_status
          )
      `)
      )
    })
  })
})
