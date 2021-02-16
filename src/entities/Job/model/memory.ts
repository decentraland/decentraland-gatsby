import { v4 as uuid } from 'uuid';
import { JobAttributes } from "../types";

export default class MemoryModel {
  static cache: Map<string, JobAttributes> = new Map()

  static async getPending() {
    const now = Date.now()
    return Array.from(this.cache.values()).filter(job => job.run_at.getTime() <= now)
  }

  static async schedule(name: string, date: Date, payload: object = {}) {
    const job: JobAttributes = {
      id: uuid(),
      name,
      run_at: date,
      payload,
      created_at: new Date()
    }

    this.cache.set(job.id, job)
    return job
  }

  static async updatePayload(id: string, payload: object = {}) {
    const prev = this.cache.get(id)
    if (prev) {
      this.cache.set(id, { ...prev, payload })
    }
  }

  static async complete(id: string): Promise<boolean> {
    return this.cache.delete(id)
  }
}