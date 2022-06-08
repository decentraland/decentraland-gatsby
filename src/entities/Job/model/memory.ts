import { JobAttributes } from '../types'

export default class MemoryModel {
  static cache: Map<string, JobAttributes> = new Map()

  static async getPending() {
    const now = Date.now()
    return Array.from(this.cache.values()).filter(
      (job) => job.run_at.getTime() <= now
    )
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
      run_at: date,
      payload,
      created_at: new Date(),
    }

    this.cache.set(job.id, job)
    return job
  }

  static async updatePayload(id: string, payload: Record<string, any> = {}) {
    const prev = this.cache.get(id)
    if (prev) {
      this.cache.set(id, { ...prev, payload })
    }
  }

  static async complete(id: string): Promise<boolean> {
    return this.cache.delete(id)
  }
}
