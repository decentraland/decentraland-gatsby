// TODO(2fd): add Docs
import { useEffect, useState } from 'react'

const features = {
  Crypto: () => 'crypto' in window,
  File: () =>
    'File' in window && 'FileList' in window && 'FileReader' in window,
  FileSystem: () => 'requestFileSystem' in window,
  Notification: () => 'Notification' in window && 'permission' in Notification,
  PushManager: () => 'PushManager' in window,
  ServiceWorker: () => 'serviceWorker' in navigator,
  Share: () => 'share' in navigator,
}

const cache = new Map<keyof typeof features, boolean>()
export default function useFeatureSupported(feature: keyof typeof features) {
  const [isSupported, setSupported] = useState(cache.get(feature) || false)

  useEffect(() => {
    if (!cache.has(feature) && features[feature]) {
      cache.set(feature, features[feature]())
    }

    if (isSupported !== cache.get(feature)) {
      setSupported(isSupported)
    }
  }, [])

  return isSupported
}

export function useCryptoSupported() {
  return useFeatureSupported('Crypto')
}

export function useFileSupported() {
  return useFeatureSupported('File')
}

export function useFileSystemSupported() {
  return useFeatureSupported('FileSystem')
}

export function useNotificationSupported() {
  return useFeatureSupported('Notification')
}

export function usePushManagerSupported() {
  return useFeatureSupported('PushManager')
}

export function useServiceWorkerSupported() {
  return useFeatureSupported('ServiceWorker')
}

export function useShareSupported() {
  return useFeatureSupported('Share')
}
