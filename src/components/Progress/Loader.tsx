import React, { useMemo } from 'react'
import { ProviderType } from 'decentraland-connect/dist/types'
import { toModalOptionType } from 'decentraland-dapps/dist/containers/LoginModal/utils'
import {
  default as BaseLoader,
  LoaderProps as BaseLoaderProps,
} from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader'
import { LoginModalOptionType } from '../Modal/WalletSelectorModal'
import 'decentraland-ui/dist/components/Loader/Loader.css'
import './Loader.css'

const images = {
  [LoginModalOptionType.FORTMATIC]: require('decentraland-ui/src/components/LoginModal/images/fortmatic.png'),
  [LoginModalOptionType.DAPPER]: require('decentraland-ui/src/components/LoginModal/images/dapper.png'),
  [LoginModalOptionType.COINBASE]: require('decentraland-ui/src/components/LoginModal/images/coinbase.svg'),
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
    () => provider && images[toModalOptionType(provider)!],
    [provider]
  )

  const s = useMemo(
    () =>
      backgroundImage
        ? { ...props.style, backgroundImage: `url(${backgroundImage})` }
        : props.style,
    [backgroundImage, props.style]
  )
  return <BaseLoader {...props} style={s} />
})
