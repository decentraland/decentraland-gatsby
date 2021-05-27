import { getChainId } from '../context/Auth/utils'

export default function useChainId() {
  return getChainId()
}