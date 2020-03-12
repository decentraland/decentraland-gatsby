import React from 'react'
import ConnectButton from "./ConnectButton";
import { storiesOf } from "@storybook/react";
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';

const actions = () => ({
  // onClick: action('onClick'),
  onClick: action('onClick', { depth: 1 }),
  onConnect: action('onConnect'),
  onDisconnect: action('onDisconnect'),
  onFail: action('onFail'),
})

storiesOf('ConnectButton', module)
  .addDecorator(centered)
  .add('default', () => (
    <ConnectButton basic size="small" {...actions()} />
  ))
  .add('loading', () => (
    <ConnectButton basic size="small" loading={true} {...actions()} />
  ))
  .add('prevent default', () => (
    <ConnectButton basic size="small" {...actions()} onClick={(e) => { e.preventDefault() }} />
  ))
  .add('i18n', () => (<>
    <ConnectButton basic size="small" {...actions()} i18n={{
      connect: 'Connect your wallet',
      disconnect: 'Disconnect your wallet'
    }} />
    <ConnectButton basic size="small" {...actions()} i18n={{
      connect: 'Conecta tu billetera',
      disconnect: 'Desconecta tu billetera'
    }} />
    <ConnectButton basic size="small" {...actions()} i18n={{
      connect: '连接你的钱包',
      disconnect: '断开钱包'
    }} />
  </>
  ))