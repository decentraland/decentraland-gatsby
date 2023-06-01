import isUUID from 'validator/lib/isUUID'

import { Model } from '../../Database/model'
import { SQL, table } from '../../Database/utils'
import { JobAttributes } from '../types'

export default class Job extends Model<JobAttributes> {
  static tableName = 'jobs'

  static build(job: JobAttributes): JobAttributes {
    return {
      ...job,
      payload: JSON.parse((job.payload as any) || '{}'),
      run_at: new Date(job.run_at.toString()),
      created_at: new Date(job.created_at.toString()),
    }
  }

  static async getPending() {
    const query = SQL`SELECT * FROM ${table(
      this
    )} WHERE run_at <= ${new Date()}`
    try {
      const jobs = await this.namedQuery(`get_pending`, query)
      return jobs.map((job) => this.build(job))
    } catch (err) {
      throw Object.assign(new Error(err.message), { query: query.text })
    }
  }

  static async updatePayload(id: string, payload: Record<string, any> = {}) {
    if (!id) {
      return
    }

    const query = SQL`UPDATE ${table(this)} SET payload = ${JSON.stringify(
      payload
    )} WHERE id = ${id}`
    try {
      const result = await this.namedQuery(`update_payload`, query)
      return result
    } catch (err) {
      throw Object.assign(new Error(err.message), { query: query.text })
    }
  }

  static async schedule(
    id: string,
    name: string,
    date: Date,
    payload: Record<string, any> = {}
  ) {
    const job: JobAttributes = {
      id,
      name,
      payload: payload,
      run_at: date,
      created_at: new Date(),
    }

    const query = SQL`
      INSERT
        INTO ${table(this)} (id, name, payload, run_at, created_at)
        VALUES (${job.id}, ${job.name}, ${JSON.stringify(job.payload)}, ${
      job.run_at
    }, ${job.created_at})
    `

    try {
      await this.namedQuery('schedule', query)
      return job
    } catch (err) {
      throw Object.assign(new Error(err.message), { query: query.text })
    }
  }

  static async complete(id: string): Promise<boolean> {
    if (!isUUID(id)) {
      return false
    }

    const total = await this.namedRowCount(
      `complete`,
      SQL`DELETE FROM ${table(this)} WHERE "id" = ${id}`
    )
    return total > 0
  }
}
