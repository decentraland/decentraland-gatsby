import React, { useMemo } from 'react'
import { ProviderType } from 'decentraland-connect/dist/types'
import {
  Loader as BaseLoader,
  LoaderProps as BaseLoaderProps,
} from 'decentraland-ui/dist/components/Loader/Loader'
import {
  getProviderOptionType,
  LoginModalOptionType,
} from '../Modal/WalletSelectorModal'
import './Loader.css'

const images = {
  [LoginModalOptionType.FORTMATIC]: require('decentraland-ui/src/components/LoginModal/images/fortmatic.png'),
  [LoginModalOptionType.DAPPER]: require('decentraland-ui/src/components/LoginModal/images/dapper.png'),
  [LoginModalOptionType.METAMASK]: require('decentraland-ui/src/components/LoginModal/images/metamask.svg'),
  [LoginModalOptionType.SAMSUNG]: require('decentraland-ui/src/components/LoginModal/images/samsung-blockchain-wallet.svg'),
  [LoginModalOptionType.WALLET_CONNECT]: require('decentraland-ui/src/components/LoginModal/images/wallet-connect.png'),
}

export type LoaderProps = BaseLoaderProps & {
  provider?: ProviderType
}

export default React.memo(function Loader({
  provider,
  ...props
}: BaseLoaderProps) {
  const backgroundImage = useMemo(
    () => provider && images[getProviderOptionType(provider)],
    [provider]
  )
  console.log(backgroundImage)
  const s = useMemo(
    () =>
      backgroundImage
        ? { ...props.style, backgroundImage: `url(${backgroundImage})` }
        : props.style,
    [backgroundImage, props.style]
  )
  return <BaseLoader {...props} style={s} />
})
