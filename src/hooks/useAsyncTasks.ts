import { useState } from 'react'

export default function useAsyncTasks<ID extends string | number = string | number>(callback: (id: ID) => Promise<any>) {
  const [ tasks, setTasks ] = useState<[ ID, Promise<any> | null ][]>([])
  function addTask(id: ID) {
    if (tasks.find(([ currentId ]) => currentId === id )) {
      return
    }

    const task = Promise.resolve()
      .then(() => callback(id))
      .then(() => {
        setTasks(current => current.filter(([currentId]) => currentId === id))
      })
      .catch(err => {
        console.error(err)
        setTasks(current => current.filter(([currentId]) => currentId === id))
      })

    setTasks((current) => [ ...current, [ id, task ] ])
  }

  return [ tasks.map(([ id ]) => id), addTask ] as const
}
