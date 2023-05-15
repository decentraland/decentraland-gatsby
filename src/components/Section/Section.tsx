import React from 'react'

import DividerComponent from '../../components/Text/Divider'
import TokenList from '../../utils/dom/TokenList'

import './Section.css'

export type SectionProps = React.HTMLProps<HTMLDivElement> & {
  highlight?: boolean
  maxHeight?: number | string
}

function Section({ highlight, maxHeight, ...props }: SectionProps) {
  return (
    <div
      {...props}
      style={{ maxHeight: maxHeight, ...props.style }}
      className={TokenList.join([
        'section',
        highlight && 'section--highlight',
        props.className,
      ])}
    />
  )
}

export type IconProps = Omit<React.HTMLProps<HTMLDivElement>, 'children'> & {
  src?: string
  width?: string | number
  height?: string | number
  center?: boolean
}

function Icon({ src, width, height, center, ...props }: IconProps) {
  return (
    <div
      {...props}
      className={TokenList.join([
        'section__icon',
        center && 'section__icon--center',
        props.className,
      ])}
    >
      {!!src && <img src={src} width={width ?? 16} height={height ?? 16} />}
    </div>
  )
}

export type DetailProps = React.HTMLProps<HTMLDivElement> & {
  maxHeight?: number | string
}

function Detail(props: DetailProps) {
  return (
    <div
      {...props}
      style={{ maxHeight: props.maxHeight, ...props.style }}
      className={TokenList.join(['section__detail', props.className])}
    />
  )
}

export type ActionProps = React.HTMLProps<HTMLDivElement>

function Action(props: ActionProps) {
  return <div {...props} className={props.className} />
}

function Divider() {
  return <DividerComponent line className="section__divider" />
}

export default Object.assign(Section, { Icon, Detail, Action, Divider })
