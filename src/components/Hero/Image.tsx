import React from "react"
import { motion, MotionProps } from "framer-motion"
import classJoin from "~/utils/className"

import "./Image.css"

export type ImageProps = MotionProps & {
  className?: string
  src?: string
  background?: boolean
  backgroundSize?: number | string
  width?: number | string
  height?: number | string
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}

export default function Image({
  src,
  className,
  background,
  ...props
}: ImageProps) {
  return (
    <motion.div
      {...props}
      className={classJoin([
        background ? "HeroBackground" : "HeroImage",
        className,
      ])}
      style={{
        ...props.style,
        backgroundImage: `url("${src}")`,
      }}
    />
  )
}
