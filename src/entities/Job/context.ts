import { ScheduleFunction } from "./types";

export default class JobContext<P extends object = {}> {
  constructor(
    public id: string,
    public name: string,
    public payload: P = {} as P,
    private _schedule: ScheduleFunction,
  ) { }

  log(...args: any[]) { console.log(`[${this.name}]`, ...args) }

  schedule(name: string, date: Date, payload: object = {}) {
    this._schedule(name, date, payload)
  }
}