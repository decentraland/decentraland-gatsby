import { useMediaQuery } from 'react-responsive'

export default function useBigDesktopMediaQuery(): boolean {
  return useMediaQuery({ minWidth: 1920 })
}
