import { useEffect, useState } from "react"
import { ChainId } from "@dcl/schemas"
import Time from "../utils/date/Time"
import { clearTransactions, restoreTransactions, storeTransactions } from "../utils/tx/storage"
import { Transaction } from "../utils/tx/type"
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/txUtils'

type TransactionState = Transaction<any>[] | null

export default function useTransaction(address?: string | null, chainId?: ChainId | null) {
  const [ transactions, setTransactions ] = useState<TransactionState>(null)

  // re-store tranasctions
  useEffect(() => {
    if (!address || !chainId) {
      setTransactions([])
    } else {
      setTransactions(restoreTransactions(address, chainId))
    }
  }, [ address ])

  // track transactions
  useEffect(() => {
    let closed = false
    let timer: number | null = null

    async function updateTransactions() {
      if(!address || !chainId) {
        return
      }

      let txs = transactions || []
      const updatedTransactions: Transaction[] = []
      for (const tx of txs) {
        if (isPending(tx.status)) {
          const updatedTransaction = await getTransaction(address, tx.chainId, tx.hash)
          updatedTransactions.push({
            ...tx,
            ...updatedTransaction
          })
        }
      }

      if (updatedTransactions.length > 0 && !closed) {
        txs = storeTransactions(address, chainId, updatedTransactions)
        setTransactions(txs)
      }

      const pendingTransactions = txs.filter(tx => isPending(tx.status))
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
  }, [ transactions ])

  function add(hash: string, payload: Record<string, any> = {}) {
    if(address && chainId) {
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

          const txs = storeTransactions(address, chainId, [ newTransaction ])
          setTransactions(txs)
        })
        .catch((err) => console.error(err))
    }
  }

  function clear() {
    if (!address || !chainId) {
      return
    }

    setTransactions([])
    clearTransactions(address, chainId)
  }

  return [ transactions, { add, clear } ]
}