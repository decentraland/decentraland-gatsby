import { useEffect, useState } from "react"
import { useMotionValue } from "framer-motion"
import SingletonListener from "../utils/dom/SingletonListener"

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

    const listener = SingletonListener.from(window)

    listener.addEventListener("resize", updateScrollValues)
    listener.addEventListener("scroll", updateScrollValues)

    return () => {
      listener.removeEventListener("resize", updateScrollValues)
      listener.removeEventListener("scroll", updateScrollValues)
    }
  })

  return state
}
