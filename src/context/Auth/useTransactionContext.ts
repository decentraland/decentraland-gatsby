import { useContext } from 'react'
import { TransactionContext } from './AuthProvider'

export default function useTransactionContext() {
  return useContext(TransactionContext)
}
