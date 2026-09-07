import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TransactionRow } from '../components/TransactionRow.jsx'
import { CATEGORIES } from '../hooks/useTransactions.js'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

const pendingRows = [
  ['◷', 'Pending approvals', 'violet'],
  ['✦', 'New trips registered', 'cyan'],
  ['▣', 'Unreported expenses', 'blue'],
  ['↯', 'Upcoming expenses', 'pink'],
  ['⟳', 'Unreported advances', 'teal'],
]

export function Dashboard({ transactions }) {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = useMemo(() => transactions
    .filter((t) => categoryFilter === 'All' || t.category === categoryFilter)
    .filter((t) => typeFilter === 'All' || t.type === typeFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [transactions, categoryFilter, typeFilter])

  const expenses = useMemo(() => transactions.filter((t) => t.type === 'Expense').sort((a, b) => new Date(b.date) - new Date(a.date)), [transactions])
  const income = useMemo(() => transactions.filter((t) => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0), [transactions])
  const expenseTotal = useMemo(() => expenses.reduce((sum, t) => sum + t.amount, 0), [expenses])
  const balance = income - expenseTotal
  const categoryTotals = useMemo(() => {
    const totals = {}
    expenses.forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.amount })
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [expenses])
  const maxCategory = Math.max(categoryTotals[0]?.[1] || 1, 1)
  const dayBars = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
    const matching = expenses.filter((t) => new Date(t.date + 'T00:00:00').getDay() === (index + 1) % 7)
    const amount = matching.reduce((sum, t) => sum + t.amount, 0)
    return { day, height: Math.min(100, Math.max(12, (amount / Math.max(expenseTotal, 1)) * 560)) }
  })

  return (
    <div className="page page--dashboard">
      <header className="dashboard-topbar">
        <div className="profile"><div className="profile__avatar">LL</div><div className="profile__copy"><strong>Leo Line</strong><span>Good evening</span></div></div>
        <button className="pro-badge" type="button">Pro</button>
      </header>

      <section className="dashboard-intro">
        <div><p className="eyebrow">PERSONAL FINANCE COMMAND CENTER</p><h1>Welcome back, Leo.</h1><p className="page__subtitle">A clear view of what moved, what is pending, and what comes next.</p></div>
        <Link to="/add" className="btn btn--primary btn--add"><span>+</span> New expense</Link>
      </section>

      <section className="dashboard-grid dashboard-grid--top">
        <article className="panel panel--pending"><div className="panel__heading"><h2>Pending tasks</h2><span className="panel__kicker">THIS WEEK</span></div><div className="pending-list">
          {pendingRows.map(([icon, label, color], index) => <div className="pending-row" key={label}><span className={`pending-icon pending-icon--${color}`}>{icon}</span><span>{label}</span><strong>{index === 0 ? expenses.length : index === 1 ? 1 : index === 2 ? Math.max(0, expenses.length - 1) : index === 3 ? 0 : '₱0.00'}</strong></div>)}
        </div></article>

        <article className="panel panel--expenses"><div className="panel__heading"><h2>Recent expenses</h2><Link to="/summary" className="panel__link">View report ↗</Link></div><div className="expense-table"><div className="expense-table__head"><span>Subject</span><span>Category</span><span>Amount</span></div>
          {expenses.slice(0, 5).map((t, index) => <Link to={`/transaction/${t.id}`} className="expense-table__row" key={t.id}><span><strong>{t.description}</strong><small>{index % 2 ? 'Personal' : 'Operations'}</small></span><span className={`tag tag--${index % 3}`}>{t.category}</span><strong>{formatCurrency(t.amount)}</strong></Link>)}
          {expenses.length === 0 && <div className="table-empty">No expenses yet. Add your first one.</div>}
        </div></article>
      </section>

      <section className="panel quick-access"><div className="panel__heading"><h2>Quick access</h2><span className="panel__kicker">SHORTCUTS</span></div><div className="quick-access__items">
        <Link to="/add" className="quick-card"><span className="quick-card__icon quick-card__icon--pink">▤</span><span>New expense</span><b>＋</b></Link>
        <Link to="/add" className="quick-card"><span className="quick-card__icon quick-card__icon--blue">▥</span><span>Add receipt</span><b>＋</b></Link>
        <Link to="/summary" className="quick-card"><span className="quick-card__icon quick-card__icon--cyan">▤</span><span>Create report</span><b>↗</b></Link>
        <Link to="/add" className="quick-card"><span className="quick-card__icon quick-card__icon--red">＋</span><span>Create trip</span><b>＋</b></Link>
      </div></section>

      <section className="panel report-panel"><div className="panel__heading"><h2>Monthly report</h2><span className="report-month">AUG 2026 <span>⌄</span></span></div><div className="report-grid">
        <div className="chart-block"><div className="chart-block__title"><span>Cash flow overview</span><strong>{formatCurrency(balance)}</strong></div><div className="bar-chart"><div className="bar-chart__grid"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="bar-chart__bars">{dayBars.map(({ day, height }, index) => <div className="bar-chart__item" key={`${day}-${index}`}><span className={`bar bar--${index % 3}`} style={{ height: `${height}%` }} /><small>{day}</small></div>)}</div></div></div>
        <div className="chart-block"><div className="chart-block__title"><span>Spending by category</span><strong>{formatCurrency(expenseTotal)}</strong></div><div className="category-chart">{categoryTotals.length === 0 && <p className="chart-empty">Add expenses to see the breakdown.</p>}{categoryTotals.map(([category, amount], index) => <div className="category-row" key={category}><span className={`category-dot category-dot--${index % 4}`} /><span>{category}</span><div className="category-row__track"><i style={{ width: `${(amount / maxCategory) * 100}%` }} /></div><strong>{formatCurrency(amount)}</strong></div>)}</div></div>
      </div></section>

      <section className="panel ledger-panel"><div className="panel__heading"><div><h2>All activity</h2><span className="panel__subheading">Your latest entries, ready to inspect.</span></div><div className="filters"><label className="filter"><span>Type</span><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option>All</option><option>Income</option><option>Expense</option></select></label><label className="filter"><span>Category</span><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label></div></div><div className="ledger">{filtered.length === 0 ? <div className="empty-state"><p>No transactions match these filters yet.</p><Link to="/add" className="btn btn--ghost">Log one now</Link></div> : filtered.map((t) => <TransactionRow key={t.id} transaction={t} />)}</div></section>

      <footer className="dashboard-footer"><span>Net income this month: <strong>{formatCurrency(balance)}</strong></span><span>Local storage enabled · Updates instantly</span></footer>
    </div>
  )
}
