
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
    const query = SQL`SELECT * FROM ${raw(Job.tableName)} WHERE run_at <= ${new Date()}`
    try {
      const jobs = await this.query(query)
      return jobs.map(job => this.build(job))
    } catch (err) {
      throw Object.assign(new Error(err.message), { query: query.text })
    }
  }

  static async updatePayload(id: string, payload: object = {}) {
    if (!id) {
      return
    }

    const query = SQL`UPDATE ${raw(Job.tableName)} SET payload = '${JSON.stringify(payload)}' WHERE id = '${id}'`
    try {
      const result = await Job.query(query)
      return result
    } catch (err) {
      throw Object.assign(new Error(err.message), { query: query.text })
    }
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

    try {
      await Job.query(query)
      return job;
    } catch (err) {
      throw Object.assign(new Error(err.message), { query: query.text })
    }
  }

  static async complete(id: string): Promise<boolean> {
    if (!isUUID(id)) {
      return false
    }

    return this.delete({ id })
  }
}