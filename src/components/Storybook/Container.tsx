import React from 'react'
import './Container.css'

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return <div className="StorybookContainer" {...props} />
}
