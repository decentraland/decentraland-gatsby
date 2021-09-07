import { useEffect, useState } from 'react'
import SingletonListener from '../utils/dom/SingletonListener'

export default function useFileDrop(callback: (event: DragEvent) => void) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    let canceled = false
    const listener = SingletonListener.from(document)
    function onDragStart(event: DragEvent) {
      event.preventDefault()
      setDragging(true)
    }

    function onDragEnd(event: DragEvent) {
      event.preventDefault()
      setDragging(false)
    }

    function onDragOver(event: DragEvent) {
      event.preventDefault()
    }

    function onDrop(event: DragEvent) {
      event.preventDefault()
      if (!canceled) {
        callback(event)
      }
    }

    listener.addEventListener('dragstart', onDragStart)
    listener.addEventListener('dragend', onDragEnd)
    listener.addEventListener('dragover', onDragOver)
    listener.addEventListener('drop', onDrop)

    return () => {
      canceled = true
      listener.removeEventListener('dragstart', onDragStart)
      listener.removeEventListener('dragend', onDragEnd)
      listener.removeEventListener('dragover', onDragOver)
      listener.removeEventListener('drop', onDrop)
    }
  }, [])

  return dragging
}
