import type { ChainId } from '@dcl/schemas'
import { PersistedKeys } from '../loader'
import { Transaction } from './type'

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
      return transaction
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
    if (tx.chainId === chainId) {
      memoryTransasctions = injectTransaction(tx, memoryTransasctions)
      storageTransactions = injectTransaction(tx, storageTransactions)
    }
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
    const storedTransactions = JSON.parse(localStorage.getItem(key) || '[]')
    transactions.set(key, storedTransactions)
  }

  return transactions.get(key)!
}

export function clearTransactions(address: string, chainId: ChainId): void {
  const key = getKey(address, chainId)
  transactions.delete(key)
  localStorage.removeItem(key)
}
