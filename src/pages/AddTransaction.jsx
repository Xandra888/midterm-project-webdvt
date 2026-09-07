import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../hooks/useTransactions.js'

const emptyForm = {
  type: 'Expense',
  description: '',
  category: CATEGORIES[0],
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
}

export function AddTransaction({ addTransaction }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.description.trim()) next.description = 'A description is required.'
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter an amount greater than zero.'
    if (!form.category) next.category = 'Choose a category.'
    if (!form.date) next.date = 'Choose a date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    addTransaction({
      type: form.type,
      description: form.description.trim(),
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      notes: form.notes.trim(),
    })

    navigate('/')
  }

  return (
    <div className="page page--narrow">
      <header className="page__header">
        <div>
          <h1>Add Transaction</h1>
          <p className="page__subtitle">Log an entry into the ledger.</p>
        </div>
      </header>

      <form className="form" onSubmit={handleSubmit} noValidate>
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
            {errors.category && <span className="field__error">{errors.category}</span>}
          </label>
        </div>

        <label className="field">
          <span>Description</span>
          <input
            type="text"
            placeholder="e.g. Groceries at the market"
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
              placeholder="0.00"
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
            placeholder="Anything worth remembering about this entry"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </label>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary">
            Save transaction
          </button>
        </div>
      </form>
    </div>
  )
}
