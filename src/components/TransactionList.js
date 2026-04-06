import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Trash2, SearchX } from 'lucide-react'
import useStore from '../store/useStore'
import { formatCurrency, formatDate, getCategoryColor } from '../utils/helpers'

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl">
      <div className="skeleton w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-32 rounded" />
        <div className="skeleton h-2.5 w-20 rounded" />
      </div>
      <div className="skeleton h-3.5 w-16 rounded ml-auto" />
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>
  )
}

function EmptyState({ hasSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <div className="w-16 h-16 bg-gray-100 dark:bg-navy-700 rounded-2xl flex items-center justify-center">
        <SearchX size={28} className="text-gray-400 dark:text-gray-500" />
      </div>
      <div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
          {hasSearch ? 'No matching transactions' : 'No transactions yet'}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {hasSearch ? 'Try a different search term or filter.' : 'Add your first transaction to get started.'}
        </p>
      </div>
    </motion.div>
  )
}

function TransactionRow({ transaction, canDelete, onDelete }) {
  const isIncome = transaction.type === 'income'
  const categoryColor = getCategoryColor(transaction.category)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-all duration-150 cursor-default"
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${categoryColor}22` }}
      >
        {isIncome ? (
          <ArrowUpRight size={18} className="text-income" />
        ) : (
          <ArrowDownRight size={18} className="text-expense" />
        )}
      </div>

      {/* Description + Date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {formatDate(transaction.date)}
        </p>
      </div>

      {/* Category badge */}
      <div className="hidden sm:flex flex-shrink-0">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            background: `${categoryColor}22`,
            color: categoryColor,
          }}
        >
          {transaction.category}
        </span>
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <p
          className={`text-sm font-bold ${
            isIncome ? 'text-income' : 'text-expense'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-0.5">{transaction.type}</p>
      </div>

      {/* Delete (Admin only) */}
      {canDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-expense transition-all duration-200"
          onClick={() => onDelete(transaction.id)}
          title="Delete transaction"
          aria-label={`Delete ${transaction.description}`}
        >
          <Trash2 size={14} />
        </motion.button>
      )}
    </motion.div>
  )
}

export default function TransactionList() {
  const getFilteredTransactions = useStore((s) => s.getFilteredTransactions)
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  const role = useStore((s) => s.role)
  const loading = useStore((s) => s.loading)
  const searchQuery = useStore((s) => s.searchQuery)
  
  // Subscribe to state dependencies so the component re-renders when they change
  useStore((s) => s.transactions)
  useStore((s) => s.filters)
  useStore((s) => s.sortBy)
  useStore((s) => s.sortOrder)

  const transactions = getFilteredTransactions()
  const isAdmin = role === 'admin'

  if (loading) {
    return (
      <div className="flex flex-col gap-1 py-2">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  if (transactions.length === 0) {
    return <EmptyState hasSearch={!!searchQuery.trim()} />
  }

  return (
    <div className="flex flex-col gap-0.5">
      <AnimatePresence mode="popLayout">
        {transactions.map((t) => (
          <TransactionRow
            key={t.id}
            transaction={t}
            canDelete={isAdmin}
            onDelete={deleteTransaction}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
