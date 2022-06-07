import React, { useEffect, useMemo } from 'react'

import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import TokenList from '../../utils/dom/TokenList'
import ImgFixed, { ImgFixedProps } from '../Image/ImgFixed'

import './ImageInput.css'

export type ImageInputProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  'value'
> & {
  onFileChange?: (file: File) => void
  value?: string
  label?: string
  message?: React.ReactNode
  error?: boolean
  loading?: boolean
  dimension?: ImgFixedProps['dimension']
}

export default function ImageInput({
  value,
  error,
  loading,
  label,
  message,
  dimension,
  className,
  ...props
}: ImageInputProps) {
  const hasDocument = typeof document !== 'undefined'
  const input = useMemo(() => {
    if (document) {
      const el = document.createElement('input')
      el.type = 'file'
      el.name = 'poster'
      el.accept = 'image/png, image/jpeg'
      return el
    } else {
      return null
    }
  }, [hasDocument])

  function handleClick() {
    if (input && !loading && !props.disabled) {
      input.click()
    }
  }

  useEffect(() => {
    if (!input) {
      return () => null
    }

    function handleChange() {
      if (input && input.files && input.files[0] && props.onFileChange) {
        props.onFileChange(input.files[0])
      }
    }

    input.addEventListener('change', handleChange)

    return () => {
      input.removeEventListener('change', handleChange)
    }
  }, [input])

  return (
    <div
      className={TokenList.join([
        'ImageInput',
        error && 'ImageInput--error',
        loading && 'ImageInput--loading',
        value && 'ImageInput--with-value',
        className,
      ])}
    >
      <div className="ImageInput__Label">{label}</div>
      <div className="ImageInput__Value">
        <ImgFixed dimension={dimension || 'wide'} src={value} />
        <div className="ImageInput__Background" />
        {loading && <Loader size="medium" active />}
        {!loading && (
          <div className="ImageInput__Content" onClick={handleClick}>
            {props.children}
          </div>
        )}
      </div>
      <div className="ImageInput__Message">{message}</div>
    </div>
  )
}
