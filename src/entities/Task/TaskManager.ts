import { randomUUID } from 'crypto'

import Time from '../../utils/date/Time'
import random from '../../utils/number/random'
import globalLogger, { Logger } from '../Development/logger'
import TaskModel from './model'
import Task from './Task'
import { CreateTaskAttributes, TaskAttributes } from './types'

type TaskManagerOptions = {
  concurrency: number
  interval: number
}

export type TaskRunContext = {
  id: string
  name: string
  runner: string
  logger: Logger
}

export default class TaskManager {
  private _id = randomUUID()
  private _running = false
  private _concurrency = 5
  private _tasks = new Map<string, Task>()
  private _nextCycle: ReturnType<typeof setTimeout> | null
  private _nextTimeoutRelease: ReturnType<typeof setInterval> | null
  private _intervalTime = Time.Second * 15
  private _logger: Logger
  private _promiseOfRunningTasksCycle: Promise<void> = Promise.resolve()

  constructor() {
    this._logger = globalLogger.extend({ runner: this._id })
  }

  get id() {
    return this._id
  }

  get running() {
    return this._running
  }

  get logger() {
    return this._logger
  }

  set<K extends keyof TaskManagerOptions>(
    option: K,
    value: TaskManagerOptions[K]
  ) {
    switch (option) {
      case 'concurrency':
        this._concurrency = value
        break
      case 'interval':
        this._intervalTime = value
        break
    }

    return this
  }

  use(task: Task | null) {
    if (!task) {
      return this
    }
    if (this._tasks.has(task.name) && this._tasks.get(task.name) !== task) {
      throw new Error(`Duplicated task name "${task.name}"`)
    }

    this._tasks.set(task.name, task)
    return this
  }

  async start() {
    if (!this._running) {
      this._running = true

      // run task cycle
      setTimeout(async () => {
        if (!this._running) {
          return
        }

        try {
          await this.runTaskTimeout()
        } catch (err) {
          this._logger.error(`error releasing old tasks: ${err.message}`, {
            stack: err.stack,
            ...err,
          })
        }

        const tasks = Array.from(this._tasks.values())
        try {
          await TaskModel.initialize(tasks)
        } catch (err) {
          this._logger.error(`error initializing tasks: ${err.message}`, {
            stack: err.stack,
            ...err,
            tasks,
          })
        }

        this._promiseOfRunningTasksCycle = this.runTasksCycle()
      }, random(0, this._intervalTime))

      // run task timeout
      this._nextTimeoutRelease = setInterval(async () => {
        await this.runTaskTimeout()
      }, Time.Minute * 10)
    }
  }

  async stop() {
    if (this._running) {
      this._running = false

      if (this._nextCycle) {
        clearInterval(this._nextCycle)
      }

      if (this._nextTimeoutRelease) {
        clearInterval(this._nextTimeoutRelease)
      }

      // Wait for the running tasks to finish
      await this._promiseOfRunningTasksCycle
    }
  }

  async runTaskTimeout() {
    try {
      await TaskModel.releaseTimeout()
    } catch (err) {
      this._logger.error(`error releasing timeout: ${err.message}`, err)
    }
  }

  async runTasksCycle() {
    if (!this._running) {
      return
    }

    const start = Date.now()

    try {
      await this.runTasks()
    } catch (err) {
      this._logger.error(`error running tasks cycle`, err)
    }

    const nextCycle = this._intervalTime - (Date.now() - start)
    this._nextCycle = setTimeout(() => {
      this._promiseOfRunningTasksCycle = this.runTasksCycle()
    }, Math.max(nextCycle, 100))
  }

  async runTasks() {
    if (!this._running) {
      return
    }

    const tasks = await TaskModel.lock({
      id: this.id,
      taskNames: Array.from(this._tasks.keys()),
      limit: this._concurrency,
    })

    if (tasks.length === 0) {
      return
    }

    const results = await Promise.all(
      tasks.map((task) =>
        this.runTask(task).catch((err: Error) => {
          this.logger.error(`error runngin task "${task.id}": ${err.message}`, {
            ...err,
            stack: err.stack,
            id: task.id,
            ruuner: this.id,
          })

          return []
        })
      )
    )

    let newTasks: CreateTaskAttributes[] = []
    for (const result of results) {
      newTasks = [...newTasks, ...result]
    }

    await TaskModel.schedule(newTasks)
    await TaskModel.completeTasks(tasks)
  }

  async runTask(task: TaskAttributes) {
    if (!this._running) {
      return []
    }

    const handle = this._tasks.get(task.name)!
    const reschedules = await handle.run({
      id: task.id,
      runner: this._id,
      logger: this._logger,
    })

    const repeat = handle.repeateAt()
    if (repeat !== null) {
      const timestamp = typeof repeat === 'number' ? repeat : repeat.getTime()
      reschedules.push({
        name: handle.name,
        run_at: new Date(timestamp),
      })
    }

    return reschedules
  }
}
