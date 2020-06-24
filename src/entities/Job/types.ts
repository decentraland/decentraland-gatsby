export type JobAttributes<P extends object = {}> = {
  id: string,
  name: string,
  payload: P,
  run_at: Date,
  created_at: Date,
}

export type JobSettings = {
  concurrency: number,
  memory: boolean,
}

export type NextFunction = () => Promise<void>

export type ScheduleFunction = (jobName: string, date: Date, payload?: object) => void