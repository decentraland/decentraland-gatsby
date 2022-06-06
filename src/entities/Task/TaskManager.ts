import { v4 as uuid } from 'uuid'

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

export type TaskRunContext<P extends {} = {}> = {
  id: string
  name: string
  runner: string
  payload: P
  logger: Logger
}

export default class TaskManager {
  private _id = uuid()
  private _running = false
  private _concurrency = 5
  private _tasks = new Map<string, Task>()
  private _nextCycle: ReturnType<typeof setTimeout> | null
  private _nextTimeoutRelease: ReturnType<typeof setInterval> | null
  private _intervalTime = Time.Second * 15
  private _logger: Logger

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

  use(task: Task) {
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

        const tasks = Array.from(this._tasks.values())
        await TaskModel.initialize(tasks)
        this.runTasksCycle()
      }, random(0, this._intervalTime))

      // run task timeout
      setTimeout(async () => {
        this._nextTimeoutRelease = setInterval(async () => {
          await this.runTackTimeout()
        }, Time.Minute * 10)
      }, random(Time.Minute, Time.Minute * 1000))
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
    }
  }

  async runTackTimeout() {
    await TaskModel.releaseTimeout()
  }

  async runTasksCycle() {
    if (!this._running) {
      return
    }

    const start = Date.now()
    await this.runTasks()

    const nextCycle = this._intervalTime - (Date.now() - start)
    this._nextCycle = setTimeout(
      () => this.runTasksCycle(),
      Math.max(nextCycle, 100)
    )
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

    const results = await Promise.all(
      tasks.map((task) =>
        this.runTask(task).catch((err: Error) => {
          this.logger.error(`Error runngin task "${task.id}": ${err.message}`, {
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
    await TaskModel.complete(tasks)
  }

  async runTask(task: TaskAttributes) {
    if (!this._running) {
      return []
    }

    const handle = this._tasks.get(task.name)!
    const reschedules = await handle.run({
      id: task.id,
      payload: task.payload,
      runner: this._id,
      logger: this._logger,
    })

    const repeat = handle.repeateAt()
    if (repeat !== null) {
      const timestamp = typeof repeat === 'number' ? repeat : repeat.getTime()
      reschedules.push({
        name: handle.name,
        payload: {},
        run_at: new Date(timestamp),
      })
    }

    return reschedules
  }
}
