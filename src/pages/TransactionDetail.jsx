import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES } from '../hooks/useTransactions.js'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export function TransactionDetail({ getTransaction, updateTransaction, deleteTransaction }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const transaction = getTransaction(id)

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(transaction ?? null)
  const [errors, setErrors] = useState({})

  if (!transaction) {
    return (
      <div className="page page--narrow">
        <div className="empty-state">
          <p>This transaction doesn't exist (maybe it was already deleted).</p>
          <Link to="/" className="btn btn--ghost">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function startEdit() {
    setForm(transaction)
    setIsEditing(true)
  }

  function validate() {
    const next = {}
    if (!form.description.trim()) next.description = 'A description is required.'
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter an amount greater than zero.'
    if (!form.date) next.date = 'Choose a date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave(e) {
    e.preventDefault()
    if (!validate()) return
    updateTransaction(transaction.id, {
      ...form,
      amount: Number(form.amount),
      description: form.description.trim(),
    })
    setIsEditing(false)
  }

  function handleDelete() {
    if (window.confirm('Delete this transaction? This cannot be undone.')) {
      deleteTransaction(transaction.id)
      navigate('/')
    }
  }

  const isIncome = transaction.type === 'Income'

  return (
    <div className="page page--narrow">
      <header className="page__header">
        <div>
          <h1>Transaction Detail</h1>
          <p className="page__subtitle">
            <Link to="/">← Back to dashboard</Link>
          </p>
        </div>
      </header>

      {!isEditing ? (
        <section className="detail-card">
          <div className="detail-card__top">
            <span className={`pill ${isIncome ? 'is-income' : 'is-expense'}`}>
              {transaction.type}
            </span>
            <span className={`detail-card__amount ${isIncome ? 'is-income' : 'is-expense'}`}>
              {isIncome ? '+' : '−'} {formatCurrency(Math.abs(transaction.amount))}
            </span>
          </div>

          <dl className="detail-list">
            <div>
              <dt>Description</dt>
              <dd>{transaction.description}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{transaction.category}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{transaction.date}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{transaction.notes || '—'}</dd>
            </div>
          </dl>

          <div className="form__actions">
            <button className="btn btn--primary" onClick={startEdit}>
              Edit
            </button>
            <button className="btn btn--danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </section>
      ) : (
        <form className="form" onSubmit={handleSave} noValidate>
          <div className="form__row form__row--split">
            <label className="field">
              <span>Type</span>
              <select value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                <option>Expense</option>
                <option>Income</option>
              </select>
            </label>
            <label className="field">
              <span>Category</span>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Description</span>
            <input
              type="text"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            {errors.description && <span className="field__error">{errors.description}</span>}
          </label>

          <div className="form__row form__row--split">
            <label className="field">
              <span>Amount (₱)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => updateField('amount', e.target.value)}
              />
              {errors.amount && <span className="field__error">{errors.amount}</span>}
            </label>
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
              {errors.date && <span className="field__error">{errors.date}</span>}
            </label>
          </div>

          <label className="field">
            <span>Notes (optional)</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </label>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary">
              Save changes
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
