import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export function Summary({ transactions }) {
  const { theme, toggleTheme } = useTheme()

  const { byCategory, totalIncome, totalExpense } = useMemo(() => {
    const totals = {}
    let income = 0
    let expense = 0

    for (const t of transactions) {
      if (t.type === 'Expense') {
        totals[t.category] = (totals[t.category] || 0) + t.amount
        expense += t.amount
      } else {
        income += t.amount
      }
    }

    const rows = Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)

    return { byCategory: rows, totalIncome: income, totalExpense: expense }
  }, [transactions])

  const maxAmount = byCategory[0]?.amount || 1

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Summary</h1>
          <p className="page__subtitle">Where the money is actually going.</p>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-toggle__dot" data-theme={theme} />
          {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
        </button>
      </header>

      <section className="totals-row">
        <div className="totals-row__item">
          <span>Total income</span>
          <strong className="is-income">{formatCurrency(totalIncome)}</strong>
        </div>
        <div className="totals-row__item">
          <span>Total expenses</span>
          <strong className="is-expense">{formatCurrency(totalExpense)}</strong>
        </div>
      </section>

      <section className="breakdown">
        <h2>Spending by category</h2>
        {byCategory.length === 0 ? (
          <p className="page__subtitle">No expenses logged yet.</p>
        ) : (
          <ul className="breakdown__list">
            {byCategory.map((row) => (
              <li key={row.category} className="breakdown__row">
                <div className="breakdown__labels">
                  <span>{row.category}</span>
                  <span>{formatCurrency(row.amount)}</span>
                </div>
                <div className="breakdown__track">
                  <div
                    className="breakdown__fill"
                    style={{ width: `${(row.amount / maxAmount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
