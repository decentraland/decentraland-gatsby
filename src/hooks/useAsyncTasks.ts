import { DependencyList, useCallback, useMemo, useState } from 'react'

import rollbar from '../utils/development/rollbar'
import segment from '../utils/development/segment'

export type AsyncTaskIdenfity = (id: string, ...extra: any[]) => Promise<any>

export default function useAsyncTasks<
  C extends AsyncTaskIdenfity = AsyncTaskIdenfity
>(callback: C, deps: DependencyList): readonly [string[], C] {
  const [tasks, setTasks] = useState<[string, Promise<any> | null][]>([])
  const tasksIds = useMemo(() => tasks.map(([id]) => id), [tasks])

  const addTask = useCallback(
    (id: string, ...extra: any[]) => {
      if (tasks.find(([currentId]) => currentId === id)) {
        return
      }

      const task = Promise.resolve()
        .then(() => callback(id, ...extra))
        .then(() => {
          setTasks((current) =>
            current.filter(([currentId]) => currentId !== id)
          )
        })
        .catch((err) => {
          console.error(err)
          rollbar((rollbar) => rollbar.error(err))
          segment((analytics) =>
            analytics.track('error', {
              ...err,
              id,
              params: extra,
              message: err.message,
              stack: err.stack,
            })
          )
          setTasks((current) =>
            current.filter(([currentId]) => currentId !== id)
          )
        })

      setTasks((current) => [...current, [id, task]])
    },
    [tasks, ...deps]
  )

  return [tasksIds, addTask as C] as const
}
