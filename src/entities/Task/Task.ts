import { randomUUID } from 'crypto'

import Time from '../../utils/date/Time'
import globalLogger, { Logger } from '../Development/logger'
import {
  task_manager_duration_seconds,
  task_manager_pool_size,
} from './metrics'
import { CreateTaskAttributes, TaskTimmer } from './types'

export type TaskOptions = {
  name: string
  task: TaskHandler
  repeat?: TaskTimmer
}

export type TaskRunOptions<P extends {} = {}> = {
  id: string
  runner: string
  payload: P
  logger: Logger
}

export type TaskRunContext<P extends {} = {}> = {
  id: string
  name: string
  runner: string
  payload: P
  logger: Logger
  schedule<T extends {} = {}>(task: Task<T>, payload?: T): void
}

export type TaskHandler = (context: TaskRunContext) => Promise<any>

export default class Task<P extends {} = {}> {
  static Repeat = {
    Never: () => null,
    Immediately: () => Time.from(),
    Minutely: () => Time.from().startOf('minute').add(1, 'minute'),
    Hourly: () => Time.from().startOf('hour').add(1, 'hour'),
    Daily: () => Time.from().startOf('day').add(1, 'day'),
    Weekly: () => Time.from().startOf('week').add(1, 'week'),
    Monthly: () => Time.from().startOf('month').add(1, 'month'),
    Yearly: () => Time.from().startOf('year').add(1, 'year'),
    Each10Seconds: () => Time.from().startOf('second').add(10, 'seconds'),
    Each15Seconds: () => Time.from().startOf('second').add(15, 'seconds'),
    Each30Seconds: () => Time.from().startOf('second').add(30, 'seconds'),
    EachMinute: () => Time.from().startOf('minute').add(1, 'minute'),
    Each10Minutes: () => Time.from().startOf('minute').add(10, 'minutes'),
    Each15Minutes: () => Time.from().startOf('minute').add(15, 'minutes'),
    Each30Minutes: () => Time.from().startOf('minute').add(30, 'minutes'),
    EachHour: () => Time.from().startOf('hour').add(1, 'hour'),
    EachDay: () => Time.from().startOf('day').add(1, 'day'),
  }

  constructor(private options: TaskOptions) {}

  get name() {
    return this.options.name
  }

  repeateAt() {
    if (this.options.repeat) {
      return this.options.repeat()
    }

    return null
  }

  async run(options: Partial<TaskRunOptions<P>> = {}) {
    const id = options.id ?? randomUUID()
    const payload = options.payload ?? ({} as P)
    const runner = options.runner ?? 'unkown'
    const data = { id, runner, name: this.name }
    const newTasks: CreateTaskAttributes[] = []
    const logger = (options.logger ?? globalLogger).extend(data)
    const schedule = <T extends {} = {}>(task: Task<T>, payload?: T) => {
      newTasks.push({
        name: task.name,
        run_at: Task.Repeat.Immediately().toDate(),
        payload: payload || {},
      })
    }

    let error = 0
    const label = { task: this.name, runner }
    task_manager_pool_size.inc(label)
    const stopTimer = task_manager_duration_seconds.startTimer(label)

    try {
      await this.options.task({ ...data, payload, logger, schedule })
    } catch (err) {
      error = 1
      logger.error(
        'Error executing task' +
          (err instanceof Error ? ': ' + err.message : ''),
        err
      )
    }

    task_manager_pool_size.dec(label)
    stopTimer({ error })

    return newTasks
  }
}
