export type TaskAttributes<P extends {} = {}> = {
  id: string
  name: string
  status: TaskStatus
  payload: P

  runner: string | null
  run_at: Date

  created_at: Date
  updated_at: Date
}

export type CreateTaskAttributes<P extends {} = {}> = Pick<
  TaskAttributes<P>,
  'name' | 'payload' | 'run_at'
>

export type TaskTimmer = () => Pick<Date, 'getTime'> | number | null

export enum TaskStatus {
  pending = 'pending',
  running = 'runnig',
}
