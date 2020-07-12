import { useState, useEffect } from 'react'

export type Detector = () => boolean
const detectors = {
  Crypto: () => 'crypto' in window,
  File: () => 'File' in window && 'FileList' in window && 'FileReader' in window,
  FileSystem: () => 'requestFileSystem' in window,
  PushManager: () => 'PushManager' in window,
  Share: () => 'share' in navigator,
  ServiceWorker: () => 'serviceWorker' in navigator,
  Notification: () => 'Notification' in window && 'permission' in Notification
}

export type Feature = keyof typeof detectors
export const features = Object.keys(detectors) as Feature[]

const detected = new Map<Feature, boolean>()

export default function useFeatureDetection(feature: Feature) {
  const [featureSupported, setFeatureSupported] = useState(detected.get(feature) || false)

  useEffect(() => {
    if (!detected.has(feature)) {
      const isSupported = detectors[feature]()
      detected.set(feature, isSupported)
      setFeatureSupported(isSupported)
    }
  }, [])

  return featureSupported
}