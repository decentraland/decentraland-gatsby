import { useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import Time from '../utils/date/Time'
import {
  clearTransactions,
  restoreTransactions,
  storeTransactions,
} from '../utils/tx/storage'
import { Transaction } from '../utils/tx/type'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/txUtils'
import rollbar from '../utils/development/rollbar'
import segment from '../utils/development/segment'

type TransactionState = Transaction<any>[]

const initialState: TransactionState = []

export default function useTransaction(
  address?: string | null,
  chainId?: ChainId | null
) {
  const [transactions, setTransactions] = useState<TransactionState>(
    initialState
  )

  // re-store tranasctions
  useEffect(() => {
    if (address && chainId) {
      setTransactions(restoreTransactions(address, chainId))
    }
  }, [address, chainId])

  // track transactions
  useEffect(() => {
    let closed = false
    let timer: number | null = null

    async function updateTransactions() {
      if (!address || !chainId) {
        return
      }

      let txs = transactions || []
      const updatedTransactions: Transaction[] = []
      for (const tx of txs) {
        if (isPending(tx.status)) {
          const updatedTransaction = await getTransaction(
            address,
            tx.chainId,
            tx.hash
          )

          if (updatedTransaction) {
            const hasChanges = Object.keys(updatedTransaction).some(
              (key) =>
                tx[key] !== updatedTransaction[key] &&
                String(tx[key]) !== String(updatedTransaction[key])
            )

            if (hasChanges) {
              updatedTransactions.push({
                ...tx,
                ...updatedTransaction,
              })
            }
          }
        }
      }

      if (updatedTransactions.length > 0 && !closed) {
        txs = storeTransactions(address, chainId, updatedTransactions)
        setTransactions(txs)
      }

      const pendingTransactions = txs.filter((tx) => isPending(tx.status))
      if (pendingTransactions.length > 0 && !closed) {
        timer = setTimeout(updateTransactions, Time.Second * 2) as any
      }
    }

    updateTransactions()

    return () => {
      closed = true
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [transactions])

  function add(hash: string, payload: Record<string, any> = {}) {
    if (address && chainId) {
      getTransaction(address, chainId, hash)
        .then((tx) => {
          if (!tx) {
            return
          }

          const newTransaction: Transaction = {
            ...tx,
            timestamp: Date.now(),
            chainId,
            payload,
          }

          const txs = storeTransactions(address, chainId, [newTransaction])
          setTransactions(txs)
        })
        .catch((err) => {
          console.error(err)
          rollbar((rollbar) => rollbar.error(err))
          segment((analytics) =>
            analytics.track('error', {
              ...err,
              message: err.message,
              stack: err.stack,
            })
          )
        })
    }
  }

  function clear() {
    if (!address || !chainId) {
      return
    }

    setTransactions(initialState)
    clearTransactions(address, chainId)
  }

  return [transactions, { add, clear }] as const
}
