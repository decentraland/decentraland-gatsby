import { format } from 'sql-formatter'
import { v4 as uuid } from 'uuid'
import isUUID from 'validator/lib/isUUID'

import { SQLStatement } from 'decentraland-server'

import TaskModel from './model'
import Task from './Task'
import { TaskStatus } from './types'

let query: jest.MockedFunction<any>
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
        "payload",
        "runner",
        "run_at",
        "created_at",
        "updated_at"
      ) (
        SELECT
          *
        FROM
          (
            (
              SELECT
                $1 as "id",
                $2 as "name",
                $3::type_task_status as "status",
                $4 as "payload",
                $5 as "runner",
                to_timestamp($6, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "run_at",
                to_timestamp($7, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "created_at",
                to_timestamp($8, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "updated_at"
            )
          ) as t
        WHERE
          "name" NOT IN (
            SELECT
              DISTINCT "name"
            FROM
              "tasks"
          )
        )
      `)
      )

      expect(isUUID(sql.values[0])).toBe(true)
      expect(sql.values[1]).toBe('test_task')
      expect(sql.values[2]).toBe(TaskStatus.pending)
      expect(sql.values[3]).toBe('{}')
      expect(sql.values[4]).toBe(null)
      expect(Number.isFinite(Date.parse(sql.values[5]))).toBe(true)
      expect(Number.isFinite(Date.parse(sql.values[6]))).toBe(true)
      expect(Number.isFinite(Date.parse(sql.values[7]))).toBe(true)
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
        "payload",
        "runner",
        "run_at",
        "created_at",
        "updated_at"
      ) (
        SELECT
          *
        FROM
          (
            (
              SELECT
                $1 as "id",
                $2 as "name",
                $3::type_task_status as "status",
                $4 as "payload",
                $5 as "runner",
                to_timestamp($6, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "run_at",
                to_timestamp($7, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "created_at",
                to_timestamp($8, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "updated_at"
            ) union
            (
              SELECT
                $9 as "id",
                $10 as "name",
                $11::type_task_status as "status",
                $12 as "payload",
                $13 as "runner",
                to_timestamp($14, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "run_at",
                to_timestamp($15, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "created_at",
                to_timestamp($16, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "updated_at"
            ) union
            (
              SELECT
                $17 as "id",
                $18 as "name",
                $19::type_task_status as "status",
                $20 as "payload",
                $21 as "runner",
                to_timestamp($22, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "run_at",
                to_timestamp($23, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "created_at",
                to_timestamp($24, 'YYYY-MM-DDTHH:MI:SS.MSZ') as "updated_at"
            )
          ) as t
        WHERE
          "name" NOT IN (
            SELECT
              DISTINCT "name"
            FROM
              "tasks"
          )
        )
      `)
      )
    })
  })

  describe(`lock`, () => {
    test(`should not run a query if limit is lower than one`, async () => {
      const initial = rawQuery.mock.calls.length
      await TaskModel.lock({ id: uuid(), taskNames: ['test_name'], limit: 0 })
      expect(rawQuery.mock.calls.length).toEqual(initial)
    })

    test(`should not run a query if there is no taskNames`, async () => {
      const initial = rawQuery.mock.calls.length
      await TaskModel.lock({ id: uuid(), taskNames: [] })
      expect(rawQuery.mock.calls.length).toEqual(initial)
    })

    test(`should not run a query if there is no taskNames`, async () => {
      const initial = rawQuery.mock.calls.length
      rawQuery.mockReturnValue({
        rows: [],
        fields: [],
        command: '',
        rowCount: 0,
      })

      await TaskModel.lock({ id: uuid(), taskNames: ['test_task'] })
      expect(rawQuery.mock.calls.length).toEqual(initial + 1)

      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
        UPDATE "tasks"
        SET
          "runner" = $1,
          "status" = $2::type_task_status,
          "updated_at" = $3,
          "run_at" = $4
        WHERE
          "id" IN (
            SELECT
              "id"
            FROM
              "tasks"
            WHERE
              "runner" IS NULL AND
              "status" = $5::type_task_status AND
              "name" IN ($6) AND
              "run_at" < $7
            ORDER BY
              "run_at" ASC
            LIMIT
              $8
          )
      `)
      )
    })

    test(`should not run a sencond query if there was any loked task`, async () => {
      const id = uuid()
      const initialQuery = query.mock.calls.length
      const initialLock = rawQuery.mock.calls.length
      query.mockReturnValueOnce([])
      rawQuery.mockReturnValueOnce({
        rows: [],
        fields: [],
        command: '',
        rowCount: 1,
      })

      await TaskModel.lock({ id, taskNames: ['test_task'] })
      expect(rawQuery.mock.calls.length).toEqual(initialLock + 1)
      expect(query.mock.calls.length).toEqual(initialQuery + 1)

      const [sqlLock] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sqlLock.text)).toEqual(
        sqlFormat(`
        UPDATE "tasks"
        SET
          "runner" = $1,
          "status" = $2::type_task_status,
          "updated_at" = $3,
          "run_at" = $4
        WHERE
          "id" IN (
            SELECT
              "id"
            FROM
              "tasks"
            WHERE
              "runner" IS NULL AND
              "status" = $5::type_task_status AND
              "name" IN ($6) AND
              "run_at" < $7
            ORDER BY
              "run_at" ASC
            LIMIT
              $8
          )
      `)
      )

      const [sqlFindLoked] = query.mock.calls[query.mock.calls.length - 1]
      expect(sqlFormat(sqlFindLoked)).toEqual(
        sqlFormat(`
        SELECT
          *
        FROM
          "tasks"
        WHERE
          "runner" = $1 AND
          "status" = $2::type_task_status
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

      await TaskModel.complete([])
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

      await TaskModel.complete([
        { id: uuid() } as any,
        { id: uuid() } as any,
        { id: uuid() } as any,
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
          payload: {},
          run_at: new Date(),
        },
        {
          name: 'test_task',
          payload: {},
          run_at: new Date(),
        },
      ])
      expect(rawQuery.mock.calls.length).toEqual(initial + 1)

      const [sql] = rawQuery.mock.calls[rawQuery.mock.calls.length - 1]
      expect(sqlFormat(sql.text)).toEqual(
        sqlFormat(`
        INSERT
          INTO "tasks"
            ("id", "name", "status", "payload", "runner", "run_at", "created_at", "updated_at")
        VALUES
          ($1, $2, $3::type_task_status, $4, $5, $6, $7, $8),
          ($9, $10, $11::type_task_status, $12, $13, $14, $15, $16)
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
          "runner" IS NULL,
          "status" = $1::type_task_status,
          "updated_at" = $2
        WHERE
          "runner" IS NOT NULL AND
          "status" = $3::type_task_status AND
          "run_at" < $4
      `)
      )
    })
  })
})
