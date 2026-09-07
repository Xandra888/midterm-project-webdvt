import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ledger-transactions'

const SEED_DATA = [
  {
    id: crypto.randomUUID(),
    type: 'Income',
    description: 'Freelance web project',
    category: 'Freelance',
    amount: 15000,
    date: '2026-08-02',
    notes: 'Paid via bank transfer.',
  },
  {
    id: crypto.randomUUID(),
    type: 'Expense',
    description: 'Groceries',
    category: 'Food',
    amount: 1850,
    date: '2026-08-05',
    notes: '',
  },
  {
    id: crypto.randomUUID(),
    type: 'Expense',
    description: 'Electric bill',
    category: 'Utilities',
    amount: 2200,
    date: '2026-08-10',
    notes: '',
  },
  {
    id: crypto.randomUUID(),
    type: 'Income',
    description: 'Monthly salary',
    category: 'Salary',
    amount: 28000,
    date: '2026-08-15',
    notes: '',
  },
]

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_DATA
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : SEED_DATA
  } catch {
    return SEED_DATA
  }
}

function writeToStorage(transactions) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

/**
 * useTransactions
 *
 * A single, reusable data-access hook that owns reading and writing
 * transaction records to persistent storage (localStorage). Any component
 * that needs transactions calls this hook instead of touching
 * localStorage or duplicating CRUD logic itself.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(readFromStorage)

  // Keep storage in sync whenever the in-memory list changes.
  useEffect(() => {
    writeToStorage(transactions)
  }, [transactions])

  const addTransaction = useCallback((transaction) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() }
    setTransactions((prev) => [newTransaction, ...prev])
    return newTransaction
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTransaction = useCallback(
    (id) => transactions.find((t) => t.id === id),
    [transactions]
  )

  return { transactions, addTransaction, updateTransaction, deleteTransaction, getTransaction }
}

export const CATEGORIES = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
]
