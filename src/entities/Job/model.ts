
import { Model, SQL } from 'decentraland-server'
import { JobAttributes } from './types'
import isUUID from 'validator/lib/isUUID'
import { v4 as uuid } from 'uuid'

export default class Job extends Model<JobAttributes> {
  static tableName = 'jobs'

  static build(job: JobAttributes): JobAttributes {
    return {
      ...job,
      run_at: new Date(job.run_at.toString()),
      created_at: new Date(job.created_at.toString())
    }
  }

  static async getPending() {
    const jobs = await Job.query(SQL`SELECT * FROM jobs WHERE run_at >= now()`)
    return jobs.map(job => Job.build(job))
  }

  static async schedule(name: string, date: Date, payload: object = {}) {
    const job: JobAttributes = {
      id: uuid(),
      name,
      payload,
      run_at: date,
      created_at: new Date()
    }

    return Job.build(await Job.create(job))
  }

  static async complete(id: string): Promise<boolean> {
    if (!isUUID(id)) {
      return false
    }

    return Job.delete({ id })
  }
}