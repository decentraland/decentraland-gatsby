import React from 'react'

import Input, {
  InputProps,
} from 'semantic-ui-react/dist/commonjs/elements/Input'

import TokenList from '../../utils/dom/TokenList'

import './SearchInput.css'

export default function SearchInput(props: InputProps) {
  return (
    <Input
      {...props}
      icon="search"
      iconPosition="left"
      placeholder={props.placeholder || 'Search...'}
      className={TokenList.join(['SearchInput', props.className])}
    />
  )
}
