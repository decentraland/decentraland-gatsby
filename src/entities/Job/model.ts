
import { Model, SQL, raw } from 'decentraland-server'
import { JobAttributes } from './types'
import isUUID from 'validator/lib/isUUID'
import { v4 as uuid } from 'uuid'

export default class Job extends Model<JobAttributes> {
  static tableName = 'jobs'

  static build(job: JobAttributes): JobAttributes {
    return {
      ...job,
      payload: JSON.parse(job.payload as any || '{}'),
      run_at: new Date(job.run_at.toString()),
      created_at: new Date(job.created_at.toString())
    }
  }

  static async getPending() {
    const jobs = await this.query(SQL`SELECT * FROM ${raw(Job.tableName)} WHERE run_at <= ${new Date()}`)
    return jobs.map(job => this.build(job))
  }

  static async schedule(name: string, date: Date, payload: object = {}) {
    const job: JobAttributes = {
      id: uuid(),
      name,
      payload: payload,
      run_at: date,
      created_at: new Date()
    }

    const query = SQL`
      INSERT
        INTO ${raw(Job.tableName)} (id, name, payload, run_at, created_at)
        VALUES (${job.id}, ${job.name}, ${JSON.stringify(job.payload)}, ${job.run_at}, ${job.created_at})
    `

    await Job.query(query)
    return job;
  }

  static async complete(id: string): Promise<boolean> {
    if (!isUUID(id)) {
      return false
    }

    return this.delete({ id })
  }
}