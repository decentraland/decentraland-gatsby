/**
 * Integration tests for the Task model.
 *
 * Requires a running PostgreSQL instance. Start one with:
 *   docker compose up -d
 *
 * Then run:
 *   npm run test:integration
 *
 * Or with a custom connection string:
 *   CONNECTION_STRING=postgres://user:pass@host:port/db npx jest --testPathPattern=integration
 */

import { randomUUID } from 'crypto'

import { Client } from 'pg'

import TaskModel from './model'
import Task from './Task'
import { TaskAttributes, TaskStatus } from './types'
import Time from '../../utils/date/Time'

const CONNECTION_STRING =
  process.env.CONNECTION_STRING ||
  'postgres://postgres:postgres@localhost:5432/test_tasks'

async function insertTask(
  client: Client,
  overrides: Partial<TaskAttributes> = {}
): Promise<TaskAttributes> {
  const now = new Date()
  const task: TaskAttributes = {
    id: randomUUID(),
    name: 'test_task',
    status: TaskStatus.pending,
    runner: null,
    run_at: now,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
  await client.query(
    `INSERT INTO tasks (id, name, status, runner, run_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      task.id,
      task.name,
      task.status,
      task.runner,
      task.run_at,
      task.created_at,
      task.updated_at,
    ]
  )
  return task
}

async function getTasks(client: Client): Promise<TaskAttributes[]> {
  const result = await client.query('SELECT * FROM tasks ORDER BY created_at')
  return result.rows
}

async function getTasksByName(
  client: Client,
  name: string
): Promise<TaskAttributes[]> {
  const result = await client.query(
    'SELECT * FROM tasks WHERE name = $1 ORDER BY created_at',
    [name]
  )
  return result.rows
}

// beforeAll is used intentionally for database schema setup — recreating the
// schema in beforeEach would be prohibitively slow for integration tests.
describe('TaskModel integration', () => {
  let client: Client

  beforeAll(async () => {
    client = new Client({ connectionString: CONNECTION_STRING })
    await client.connect()

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE type_task_status AS ENUM ('pending', 'running');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        status type_task_status NOT NULL,
        payload TEXT NOT NULL DEFAULT '{}',
        runner VARCHAR(36),
        run_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL
      )
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS tasks_runner_status_name_run_at_idx
      ON tasks (runner, status, name, run_at)
    `)

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS task_unique_pending_name
      ON tasks (name) WHERE status = 'pending'
    `)

    TaskModel.setDb('postgres')
    TaskModel.db.client = client as any
  })

  afterEach(async () => {
    await client.query('DELETE FROM tasks')
  })

  afterAll(async () => {
    await client.query('DROP TABLE IF EXISTS tasks')
    await client.query('DROP TYPE IF EXISTS type_task_status')
    await client.end()
  })

  // ---- initialize ----

  describe('when calling initialize', () => {
    describe('and the task list is empty', () => {
      let result: number

      beforeEach(async () => {
        result = await TaskModel.initialize([])
      })

      it('should return 0 and not insert any rows', async () => {
        expect(result).toBe(0)
        const rows = await getTasks(client)
        expect(rows).toHaveLength(0)
      })
    })

    describe('and no task has a repeat schedule', () => {
      let result: number

      beforeEach(async () => {
        result = await TaskModel.initialize([
          new Task({ name: 'one_shot', task: async () => null }),
        ])
      })

      it('should return 0 and not insert any rows', async () => {
        expect(result).toBe(0)
        const rows = await getTasks(client)
        expect(rows).toHaveLength(0)
      })
    })

    describe('and a task has a repeat schedule', () => {
      describe('and no pending task with the same name exists', () => {
        let rows: TaskAttributes[]

        beforeEach(async () => {
          await TaskModel.initialize([
            new Task({
              name: 'hourly_task',
              repeat: Task.Repeat.Hourly,
              task: async () => null,
            }),
          ])
          rows = await getTasksByName(client, 'hourly_task')
        })

        it('should insert exactly one pending task with no runner', () => {
          expect(rows).toHaveLength(1)
          expect(rows[0].status).toBe(TaskStatus.pending)
          expect(rows[0].runner).toBeNull()
        })
      })

      describe('and a pending task with the same name already exists', () => {
        let existingTask: TaskAttributes

        beforeEach(async () => {
          existingTask = await insertTask(client, {
            name: 'my_task',
            status: TaskStatus.pending,
          })
          await TaskModel.initialize([
            new Task({
              name: 'my_task',
              repeat: Task.Repeat.Hourly,
              task: async () => null,
            }),
          ])
        })

        it('should not insert a duplicate and preserve the original task', async () => {
          const rows = await getTasksByName(client, 'my_task')
          expect(rows).toHaveLength(1)
          expect(rows[0].id).toBe(existingTask.id)
        })
      })

      describe('and initialize is called multiple times', () => {
        beforeEach(async () => {
          const tasks = [
            new Task({
              name: 'daily_task',
              repeat: Task.Repeat.Daily,
              task: async () => null,
            }),
          ]
          await TaskModel.initialize(tasks)
          await TaskModel.initialize(tasks)
          await TaskModel.initialize(tasks)
        })

        it('should remain idempotent and create only one pending task', async () => {
          const rows = await getTasksByName(client, 'daily_task')
          expect(rows).toHaveLength(1)
        })
      })
    })

    describe('and multiple tasks have repeat schedules', () => {
      beforeEach(async () => {
        await TaskModel.initialize([
          new Task({
            name: 'task_a',
            repeat: Task.Repeat.Hourly,
            task: async () => null,
          }),
          new Task({
            name: 'task_b',
            repeat: Task.Repeat.Daily,
            task: async () => null,
          }),
          new Task({
            name: 'task_c',
            repeat: Task.Repeat.Weekly,
            task: async () => null,
          }),
        ])
      })

      it('should insert one pending task per name', async () => {
        const all = await getTasks(client)
        expect(all).toHaveLength(3)
        const names = all.map((t) => t.name).sort()
        expect(names).toEqual(['task_a', 'task_b', 'task_c'])
      })
    })
  })

  // ---- lock ----

  describe('when calling lock', () => {
    describe('and no task names are provided', () => {
      it('should return an empty array', async () => {
        const locked = await TaskModel.lock({
          id: randomUUID(),
          taskNames: [],
        })
        expect(locked).toHaveLength(0)
      })
    })

    describe('and the limit is zero', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
      })

      it('should return an empty array', async () => {
        const locked = await TaskModel.lock({
          id: randomUUID(),
          taskNames: ['task_a'],
          limit: 0,
        })
        expect(locked).toHaveLength(0)
      })
    })

    describe('and a pending task exists with run_at in the past', () => {
      let runnerId: string

      beforeEach(async () => {
        runnerId = randomUUID()
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
      })

      it('should return the locked task and set it to running in the database', async () => {
        const locked = await TaskModel.lock({
          id: runnerId,
          taskNames: ['task_a'],
        })
        expect(locked).toHaveLength(1)
        expect(locked[0].name).toBe('task_a')

        const rows = await getTasksByName(client, 'task_a')
        expect(rows[0].status).toBe(TaskStatus.running)
        expect(rows[0].runner).toBe(runnerId)
      })
    })

    describe('and a pending task exists with run_at in the future', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'future_task',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() + 60_000),
        })
      })

      it('should return an empty array and leave the task as pending', async () => {
        const locked = await TaskModel.lock({
          id: randomUUID(),
          taskNames: ['future_task'],
        })
        expect(locked).toHaveLength(0)

        const rows = await getTasksByName(client, 'future_task')
        expect(rows[0].status).toBe(TaskStatus.pending)
      })
    })

    describe('and another task with the same name is already running', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
      })

      it('should not lock the pending task', async () => {
        const locked = await TaskModel.lock({
          id: randomUUID(),
          taskNames: ['task_a'],
        })
        expect(locked).toHaveLength(0)
      })
    })

    describe('and multiple pending tasks with different names exist', () => {
      let runnerId: string

      beforeEach(async () => {
        runnerId = randomUUID()
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
        await insertTask(client, {
          name: 'task_b',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
      })

      it('should lock one task per name', async () => {
        const locked = await TaskModel.lock({
          id: runnerId,
          taskNames: ['task_a', 'task_b'],
          limit: 10,
        })
        const names = locked.map((t) => t.name).sort()
        expect(names).toEqual(['task_a', 'task_b'])
      })
    })

    describe('and the limit is lower than the number of available tasks', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
        await insertTask(client, {
          name: 'task_b',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
        await insertTask(client, {
          name: 'task_c',
          status: TaskStatus.pending,
          run_at: new Date(Date.now() - 1000),
        })
      })

      it('should respect the limit', async () => {
        const locked = await TaskModel.lock({
          id: randomUUID(),
          taskNames: ['task_a', 'task_b', 'task_c'],
          limit: 2,
        })
        expect(locked).toHaveLength(2)
      })
    })
  })

  // ---- completeTasks ----

  describe('when calling completeTasks', () => {
    describe('and the task list is empty', () => {
      it('should return 0', async () => {
        const result = await TaskModel.completeTasks([])
        expect(result).toBe(0)
      })
    })

    describe('and tasks exist in the database', () => {
      let taskA: TaskAttributes
      let taskB: TaskAttributes

      beforeEach(async () => {
        taskA = await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
        taskB = await insertTask(client, {
          name: 'task_b',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
      })

      it('should delete the specified tasks', async () => {
        await TaskModel.completeTasks([taskA, taskB])
        const rows = await getTasks(client)
        expect(rows).toHaveLength(0)
      })

      it('should not delete unrelated tasks', async () => {
        const unrelated = await insertTask(client, {
          name: 'task_c',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
        await TaskModel.completeTasks([taskA])
        const rows = await getTasks(client)
        expect(rows).toHaveLength(2)
        expect(rows.map((r) => r.id)).toContain(unrelated.id)
        expect(rows.map((r) => r.id)).toContain(taskB.id)
      })
    })
  })

  // ---- schedule ----

  describe('when calling schedule', () => {
    describe('and the task list is empty', () => {
      it('should return 0', async () => {
        const result = await TaskModel.schedule([])
        expect(result).toBe(0)
      })
    })

    describe('and a new task is provided', () => {
      let rows: TaskAttributes[]

      beforeEach(async () => {
        await TaskModel.schedule([
          { name: 'new_task', run_at: new Date(Date.now() + 60_000) },
        ])
        rows = await getTasksByName(client, 'new_task')
      })

      it('should insert a pending task with no runner', () => {
        expect(rows).toHaveLength(1)
        expect(rows[0].status).toBe(TaskStatus.pending)
        expect(rows[0].runner).toBeNull()
      })
    })

    describe('and a pending task with the same name already exists', () => {
      let originalTask: TaskAttributes

      beforeEach(async () => {
        await TaskModel.schedule([{ name: 'dup_task', run_at: new Date() }])
        const rows = await getTasksByName(client, 'dup_task')
        originalTask = rows[0]
        await TaskModel.schedule([{ name: 'dup_task', run_at: new Date() }])
      })

      it('should not insert a duplicate and preserve the original task', async () => {
        const rows = await getTasksByName(client, 'dup_task')
        expect(rows).toHaveLength(1)
        expect(rows[0].id).toBe(originalTask.id)
      })
    })

    describe('and multiple tasks with different names are provided', () => {
      beforeEach(async () => {
        await TaskModel.schedule([
          { name: 'sched_a', run_at: new Date() },
          { name: 'sched_b', run_at: new Date() },
        ])
      })

      it('should insert all of them', async () => {
        const rows = await getTasks(client)
        expect(rows).toHaveLength(2)
        expect(rows.map((r) => r.name).sort()).toEqual(['sched_a', 'sched_b'])
      })
    })
  })

  // ---- completeAndSchedule ----

  describe('when calling completeAndSchedule', () => {
    describe('and both lists are empty', () => {
      it('should return 0', async () => {
        const result = await TaskModel.completeAndSchedule([], [], randomUUID())
        expect(result).toBe(0)
      })
    })

    describe('and only completed tasks are provided', () => {
      describe('and the runner matches', () => {
        let runnerId: string
        let task: TaskAttributes

        beforeEach(async () => {
          runnerId = randomUUID()
          task = await insertTask(client, {
            name: 'task_a',
            status: TaskStatus.running,
            runner: runnerId,
          })
          await TaskModel.completeAndSchedule([task], [], runnerId)
        })

        it('should delete the completed task', async () => {
          const rows = await getTasksByName(client, 'task_a')
          expect(rows).toHaveLength(0)
        })
      })

      describe('and the runner does not match', () => {
        let ownerRunner: string
        let wrongRunner: string
        let task: TaskAttributes

        beforeEach(async () => {
          ownerRunner = randomUUID()
          wrongRunner = randomUUID()
          task = await insertTask(client, {
            name: 'task_a',
            status: TaskStatus.running,
            runner: ownerRunner,
          })
          await TaskModel.completeAndSchedule([task], [], wrongRunner)
        })

        it('should not delete the task and keep the original runner assigned', async () => {
          const rows = await getTasksByName(client, 'task_a')
          expect(rows).toHaveLength(1)
          expect(rows[0].runner).toBe(ownerRunner)
        })
      })
    })

    describe('and only new tasks are provided', () => {
      beforeEach(async () => {
        await TaskModel.completeAndSchedule(
          [],
          [{ name: 'new_task', run_at: new Date() }],
          randomUUID()
        )
      })

      it('should insert a new pending task', async () => {
        const rows = await getTasksByName(client, 'new_task')
        expect(rows).toHaveLength(1)
        expect(rows[0].status).toBe(TaskStatus.pending)
      })
    })

    describe('and both completed and new tasks are provided', () => {
      describe('and the runner matches', () => {
        let runnerId: string
        let oldTask: TaskAttributes

        beforeEach(async () => {
          runnerId = randomUUID()
          oldTask = await insertTask(client, {
            name: 'task_a',
            status: TaskStatus.running,
            runner: runnerId,
          })
          await TaskModel.completeAndSchedule(
            [oldTask],
            [{ name: 'task_a', run_at: new Date(Date.now() + 60_000) }],
            runnerId
          )
        })

        it('should atomically delete the old task and insert a new pending one with no runner', async () => {
          const rows = await getTasksByName(client, 'task_a')
          expect(rows).toHaveLength(1)
          expect(rows[0].id).not.toBe(oldTask.id)
          expect(rows[0].status).toBe(TaskStatus.pending)
          expect(rows[0].runner).toBeNull()
        })
      })

      describe('and a pending task with the same name as the new task already exists', () => {
        let runnerId: string
        let runningTask: TaskAttributes
        let existingPending: TaskAttributes

        beforeEach(async () => {
          runnerId = randomUUID()
          runningTask = await insertTask(client, {
            name: 'task_a',
            status: TaskStatus.running,
            runner: runnerId,
          })
          existingPending = await insertTask(client, {
            name: 'task_b',
            status: TaskStatus.pending,
          })
          await TaskModel.completeAndSchedule(
            [runningTask],
            [{ name: 'task_b', run_at: new Date() }],
            runnerId
          )
        })

        it('should delete the completed task, skip the duplicate insert, and preserve the original pending task', async () => {
          const taskARows = await getTasksByName(client, 'task_a')
          expect(taskARows).toHaveLength(0)

          const taskBRows = await getTasksByName(client, 'task_b')
          expect(taskBRows).toHaveLength(1)
          expect(taskBRows[0].id).toBe(existingPending.id)
        })
      })
    })

    describe('and releaseTimeout already reset the task before the runner finishes', () => {
      let runnerId: string
      let originalTask: TaskAttributes
      let pendingFromTimeout: TaskAttributes

      beforeEach(async () => {
        runnerId = randomUUID()
        originalTask = await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: runnerId,
        })

        // Simulate releaseTimeout: delete the running row, insert a new pending row
        await client.query('DELETE FROM tasks WHERE id = $1', [originalTask.id])
        pendingFromTimeout = await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
        })

        // Runner finishes and tries to complete + reschedule
        await TaskModel.completeAndSchedule(
          [originalTask],
          [{ name: 'task_a', run_at: new Date() }],
          runnerId
        )
      })

      it('should result in exactly one pending task preserving the one from releaseTimeout', async () => {
        const rows = await getTasksByName(client, 'task_a')
        expect(rows).toHaveLength(1)
        expect(rows[0].status).toBe(TaskStatus.pending)
        expect(rows[0].id).toBe(pendingFromTimeout.id)
      })
    })

    describe('and multiple completed tasks and multiple new tasks are provided', () => {
      let runnerId: string
      let taskA: TaskAttributes
      let taskB: TaskAttributes

      beforeEach(async () => {
        runnerId = randomUUID()
        taskA = await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: runnerId,
        })
        taskB = await insertTask(client, {
          name: 'task_b',
          status: TaskStatus.running,
          runner: runnerId,
        })
        await TaskModel.completeAndSchedule(
          [taskA, taskB],
          [
            { name: 'task_a', run_at: new Date() },
            { name: 'task_b', run_at: new Date() },
          ],
          runnerId
        )
      })

      it('should delete all completed tasks and insert new pending ones for each name', async () => {
        const all = await getTasks(client)
        expect(all).toHaveLength(2)
        expect(all.map((t) => t.id)).not.toContain(taskA.id)
        expect(all.map((t) => t.id)).not.toContain(taskB.id)
        expect(all.every((t) => t.status === TaskStatus.pending)).toBe(true)
        expect(all.map((t) => t.name).sort()).toEqual(['task_a', 'task_b'])
      })
    })
  })

  // ---- releaseTimeout ----

  describe('when calling releaseTimeout', () => {
    describe('and a task has been running longer than 10 minutes', () => {
      let staleRunAt: Date
      let originalId: string

      beforeEach(async () => {
        staleRunAt = new Date(Date.now() - Time.Minute * 11)
        const task = await insertTask(client, {
          name: 'stale_task',
          status: TaskStatus.running,
          runner: randomUUID(),
          run_at: staleRunAt,
        })
        originalId = task.id
        await TaskModel.releaseTimeout()
      })

      it('should replace it with a new pending row with no runner and a different id', async () => {
        const rows = await getTasksByName(client, 'stale_task')
        expect(rows).toHaveLength(1)
        expect(rows[0].status).toBe(TaskStatus.pending)
        expect(rows[0].runner).toBeNull()
        expect(rows[0].id).not.toBe(originalId)
      })
    })

    describe('and a task has been running less than 10 minutes', () => {
      let runnerId: string

      beforeEach(async () => {
        runnerId = randomUUID()
        await insertTask(client, {
          name: 'fresh_task',
          status: TaskStatus.running,
          runner: runnerId,
          run_at: new Date(),
        })
        await TaskModel.releaseTimeout()
      })

      it('should leave the task as running with the runner still assigned', async () => {
        const rows = await getTasksByName(client, 'fresh_task')
        expect(rows[0].status).toBe(TaskStatus.running)
        expect(rows[0].runner).toBe(runnerId)
      })
    })

    describe('and the stale task already has a pending replacement', () => {
      let pendingTask: TaskAttributes

      beforeEach(async () => {
        const staleRunAt = new Date(Date.now() - Time.Minute * 11)
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: randomUUID(),
          run_at: staleRunAt,
        })
        pendingTask = await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
        })
        await TaskModel.releaseTimeout()
      })

      it('should delete the stale running task and preserve the original pending one', async () => {
        const rows = await getTasksByName(client, 'task_a')
        expect(rows).toHaveLength(1)
        expect(rows[0].status).toBe(TaskStatus.pending)
        expect(rows[0].id).toBe(pendingTask.id)
      })
    })

    describe('and multiple stale tasks exist with different names', () => {
      beforeEach(async () => {
        const staleRunAt = new Date(Date.now() - Time.Minute * 11)
        await insertTask(client, {
          name: 'stale_a',
          status: TaskStatus.running,
          runner: randomUUID(),
          run_at: staleRunAt,
        })
        await insertTask(client, {
          name: 'stale_b',
          status: TaskStatus.running,
          runner: randomUUID(),
          run_at: staleRunAt,
        })
        await TaskModel.releaseTimeout()
      })

      it('should reset all of them to pending with no runners', async () => {
        const all = await getTasks(client)
        expect(all).toHaveLength(2)
        expect(all.every((t) => t.status === TaskStatus.pending)).toBe(true)
        expect(all.every((t) => t.runner === null)).toBe(true)
      })
    })

    describe('and no tasks are running', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'pending_task',
          status: TaskStatus.pending,
        })
        await TaskModel.releaseTimeout()
      })

      it('should not create any new rows and leave existing pending tasks unchanged', async () => {
        const rows = await getTasks(client)
        expect(rows).toHaveLength(1)
        expect(rows[0].name).toBe('pending_task')
        expect(rows[0].status).toBe(TaskStatus.pending)
      })
    })
  })

  // ---- partial unique index ----

  describe('when testing the partial unique index constraint', () => {
    describe('and a running and a pending task share the same name', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
        })
      })

      it('should allow both to coexist', async () => {
        const rows = await getTasksByName(client, 'task_a')
        expect(rows).toHaveLength(2)
      })
    })

    describe('and two pending tasks share the same name', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.pending,
        })
      })

      it('should reject the second insert with a unique constraint violation', async () => {
        await expect(
          insertTask(client, { name: 'task_a', status: TaskStatus.pending })
        ).rejects.toThrow(/unique/)
      })
    })

    describe('and two running tasks share the same name', () => {
      beforeEach(async () => {
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
        await insertTask(client, {
          name: 'task_a',
          status: TaskStatus.running,
          runner: randomUUID(),
        })
      })

      it('should allow both to coexist', async () => {
        const rows = await getTasksByName(client, 'task_a')
        expect(rows).toHaveLength(2)
      })
    })
  })
})
