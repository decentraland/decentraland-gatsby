import { useEffect, useState } from "react"
import { useMotionValue } from "framer-motion"
import SingletonListener from "./SingletonListener"

let WINDOW_LISTENER: SingletonListener<typeof window>

export default function useWindowScroll() {
  const scrollX = useMotionValue(0)
  const scrollY = useMotionValue(0)
  const height = useMotionValue(1)
  const width = useMotionValue(1)
  const [state, setState] = useState({
    scrollX,
    scrollY,
    height,
    width,
  })

  useEffect(() => {
    const updateScrollValues = () => {
      scrollX.set(window.scrollX)
      scrollY.set(window.scrollY)
      height.set(window.innerHeight)
      width.set(window.innerWidth)
      setState((current) => ({
        ...current,
        scrollX,
        scrollY,
        height,
        width
      }))
    }

    if (!WINDOW_LISTENER) {
      WINDOW_LISTENER = new SingletonListener(window)
    }

    WINDOW_LISTENER.addEventListener("resize", updateScrollValues)
    WINDOW_LISTENER.addEventListener("scroll", updateScrollValues)

    return () => {
      WINDOW_LISTENER.removeEventListener("resize", updateScrollValues)
      WINDOW_LISTENER.removeEventListener("scroll", updateScrollValues)
    }
  })

  return state
}
