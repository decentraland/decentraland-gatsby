import { PersistedKeys } from '../loader'
import { Transaction } from './type'

import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

const transactions = new Map<string, Transaction[]>()

function getKey(address: string, chainId: ChainId) {
  return [PersistedKeys.Transactions, address, chainId].join('.')
}

function injectTransaction(
  transaction: Transaction,
  transactions: Transaction[] = []
): Transaction[] {
  if (transactions.length === 0) {
    return [transaction]
  }

  let replaced = false
  transactions = transactions.map((tx) => {
    if (tx.hash === transaction.hash) {
      replaced = true
      return {
        ...transaction,
        chainId:
          typeof transaction.chainId === 'string'
            ? parseInt(transaction.chainId, 16)
            : transaction.chainId,
      }
    }

    return tx
  })

  return replaced ? transactions : [transaction, ...transactions]
}

export function storeTransactions(
  address: string,
  chainId: ChainId,
  txs: Transaction[]
) {
  const key = getKey(address, chainId)
  let memoryTransasctions: Transaction[] = transactions.get(key) || []
  let storageTransactions: Transaction[] = JSON.parse(
    localStorage.getItem(key) || '[]'
  )

  for (const tx of txs) {
    memoryTransasctions = injectTransaction(tx, memoryTransasctions)
    storageTransactions = injectTransaction(tx, storageTransactions)
  }

  const filteredMemoryTransasctions = memoryTransasctions.filter(
    (tx) => tx.chainId === chainId
  )
  if (memoryTransasctions.length !== filteredMemoryTransasctions.length) {
    memoryTransasctions = filteredMemoryTransasctions
  }

  transactions.set(key, memoryTransasctions)
  localStorage.setItem(key, JSON.stringify(storageTransactions))

  return memoryTransasctions
}

export function restoreTransactions(
  address: string,
  chainId: ChainId
): Transaction[] {
  const key = getKey(address, chainId)
  if (!transactions.has(key)) {
    const storedTransactions = JSON.parse(
      localStorage.getItem(key) || '[]'
    ) as Transaction[]
    transactions.set(key, storedTransactions)
  }

  return transactions.get(key)!.filter((tx) => tx.chainId === chainId)
}

export function clearTransactions(address: string, chainId: ChainId): void {
  const key = getKey(address, chainId)
  transactions.delete(key)
  localStorage.removeItem(key)
}
