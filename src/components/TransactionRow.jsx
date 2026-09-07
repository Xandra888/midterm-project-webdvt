import { memo } from 'react'
import { Link } from 'react-router-dom'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Performance note:
 * Dashboard re-renders every time the search/filter state changes, but most
 * individual rows do not change between those renders. Wrapping this row in
 * React.memo means a row only re-renders when its own `transaction` prop
 * (or `onDelete` identity) actually changes, instead of every row
 * re-rendering on every keystroke/filter change in the parent.
 */
function TransactionRowBase({ transaction }) {
  const isIncome = transaction.type === 'Income'
  return (
    <Link to={`/transaction/${transaction.id}`} className="ledger-row">
      <span className="ledger-row__date">{formatDate(transaction.date)}</span>
      <span className="ledger-row__desc">
        {transaction.description}
        <span className="ledger-row__category">{transaction.category}</span>
      </span>
      <span className={`ledger-row__amount ${isIncome ? 'is-income' : 'is-expense'}`}>
        {isIncome ? '+' : '−'} {formatCurrency(Math.abs(transaction.amount))}
      </span>
    </Link>
  )
}

export const TransactionRow = memo(TransactionRowBase)
