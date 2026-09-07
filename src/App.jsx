import { Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { AddTransaction } from './pages/AddTransaction.jsx'
import { TransactionDetail } from './pages/TransactionDetail.jsx'
import { Summary } from './pages/Summary.jsx'
import { useTransactions } from './hooks/useTransactions.js'

export default function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, getTransaction } =
    useTransactions()

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} />} />
          <Route
            path="/add"
            element={<AddTransaction addTransaction={addTransaction} />}
          />
          <Route
            path="/transaction/:id"
            element={
              <TransactionDetail
                getTransaction={getTransaction}
                updateTransaction={updateTransaction}
                deleteTransaction={deleteTransaction}
              />
            }
          />
          <Route path="/summary" element={<Summary transactions={transactions} />} />
        </Routes>
      </main>
    </div>
  )
}
