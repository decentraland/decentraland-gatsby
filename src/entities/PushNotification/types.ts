export type PushNotificationSenderOptions = {
  publicKey: string
  privateKey: string
}

export type Subscription = {
  user: string
  endpoint: string
  p256dh: string
  auth: string
}
