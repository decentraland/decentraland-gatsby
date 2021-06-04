import React from 'react'
import { extension } from './utils'

export type PreloadProps = {
  href?: string
  as?: string
  type?: string
  media?: string
}

export default function Preload(props: PreloadProps) {
  if (!props.href) {
    return null
  }

  return (
    <link
      rel="preload"
      href={props.href}
      as={props.as ?? preloadAs(props.href)}
      type={props.type ?? preloadType(props.href)}
      media={props.media}
    />
  )
}

export function preloadAs(href: string) {
  const ext = extension(href)

  switch (ext) {
    case 'aac':
    case 'flac':
    case 'm4a':
    case 'mp3':
    case 'oga':
    case 'wav':
      return 'audio'

    case 'ttf':
    case 'otf':
    case 'eot':
    case 'woff':
    case 'woff2':
      return 'font'

    case 'svg':
    case 'png':
    case 'gif':
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
    case 'tif':
    case 'tiff':
    case 'apng':
    case 'bmp':
    case 'ico':
    case 'cur':
    case 'webp':
      return 'image'

    case 'js':
      return 'script'

    case 'css':
      return 'style'

    case 'webm':
    case '3gp':
    case 'mp4':
    case 'ogg':
    case 'ogv':
    case 'mov':
      return 'video'

    default:
      return undefined
  }
}

export function preloadType(href: string) {
  const ext = extension(href)

  switch (ext) {
    case 'apng':
    case 'bmp':
    case 'gif':
    case 'png':
    case 'webp':
      return 'image/' + ext

    case 'ico':
    case 'cur':
      return 'image/x-icon'

    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
      return 'image/jpeg'

    case 'svg':
      return 'image/svg+xml'

    case 'tif':
    case 'tiff':
      return 'image/tiff'

    case 'ttf':
    case 'otf':
    case 'eot':
    case 'woff':
    case 'woff2':
      return 'font/' + ext

    case 'acc':
    case 'flac':
    case 'mp3':
    case 'wav':
      return 'audio/' + ext

    case 'm4a':
      return 'audio/mp4'

    case 'oga':
      return 'audio/ogg'

    case 'webm':
    case 'mp4':
    case 'ogg':
      return 'video/' + ext

    case 'mov':
      return 'video/quicktime'

    default:
      return undefined
  }
}
