import { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

declare global {
  interface Window {
    Intercom?: (...args: any[]) => void
  }
}

/**
 * EnhancedIntercom is a client-side only component that syncs user authentication data with Intercom.
 * 
 * This component should be used in conjunction with the base Intercom component which handles the initial script setup.
 * While the base Intercom component is added via gatsby-ssr.js, this component is included in the layout component
 * to handle user data updates.
 * 
 * Features:
 * - Updates Intercom when user authentication changes
 * - Syncs wallet address and provider type
 * - Safely handles SSR environments
 * 
 * Usage:
 * ```tsx
 * // In your layout or main component
 * import EnhancedIntercom from './Development/EnhancedIntercom'
 * 
 * function Layout({ children }) {
 *   return (
 *     <>
 *       {children}
 *       <EnhancedIntercom />
 *     </>
 *   )
 * }
 * ```
 * 
 * @returns null - This component doesn't render anything in the DOM
 */
export default function EnhancedIntercom() {
  const [account, { providerType }] = useAuth()

  useEffect(() => {
    if (!account || typeof window === 'undefined') return

    const updateIntercom = () => {
      if (window.Intercom) {
        const enhancedData: { Wallet?: string; 'Wallet type'?: string } = {}

        if (account) {
          enhancedData['Wallet'] = account.toLowerCase()
        }
        
        if (providerType) {
          enhancedData['Wallet type'] = providerType
        }

        window.Intercom('update', enhancedData)
      }
    }

    updateIntercom()
  }, [account, providerType])

  return null
}
