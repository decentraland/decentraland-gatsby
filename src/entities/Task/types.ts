export type TaskAttributes = {
  id: string
  name: string
  status: TaskStatus

  runner: string | null
  run_at: Date

  created_at: Date
  updated_at: Date
}

export type CreateTaskAttributes = Pick<TaskAttributes, 'name' | 'run_at'>

export type TaskTimmer = () => Pick<Date, 'getTime'> | null

export enum TaskStatus {
  pending = 'pending',
  running = 'running',
}
