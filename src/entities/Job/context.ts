import { ScheduleFunction } from "./types";

export default class JobContext<P extends object = {}> {
  constructor(
    public id: string | null,
    public name: string | null,
    public payload: P = {} as P,
    private _schedule: ScheduleFunction,
  ) { }

  log(...args: any[]) { console.log(`[${this.name}]`, ...args) }

  schedule(name: string | null, date: Date, payload: object = {}) {
    if (name) {
      this._schedule(name, date, payload)
    }
  }
}