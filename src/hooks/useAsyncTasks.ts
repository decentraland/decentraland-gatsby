import { useState } from 'react'

export type AsyncTaskIdenfity = (id: string, ...extra: any[]) => Promise<any>

export default function useAsyncTasks<C extends AsyncTaskIdenfity = AsyncTaskIdenfity>(callback: C): readonly [ (string)[], C ] {
  const [tasks, setTasks] = useState<[string, Promise<any> | null][]>([])
  function addTask(id: string, ...extra: any[]) {
    if (tasks.find(([currentId]) => currentId === id)) {
      return
    }

    const task = Promise.resolve()
      .then(() => callback(id, ...extra))
      .then(() => {
        setTasks((current) => current.filter(([currentId]) => currentId !== id))
      })
      .catch((err) => {
        console.error(err)
        setTasks((current) => current.filter(([currentId]) => currentId !== id))
      })

    setTasks((current) => [...current, [id, task]])
  }

  return [
    tasks.map(([id]) => id),
    addTask as C
  ] as const
}
