import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, PlusCircle } from 'lucide-react'
import useStore from '../store/useStore'

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Income', 'Other']
const INITIAL_FORM = {
  description: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modal = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } },
}

export default function AddTransactionModal({ onClose }) {
  const addTransaction = useStore((s) => s.addTransaction)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount'
    if (!form.date) e.date = 'Date is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    addTransaction({
      ...form,
      amount: parseFloat(form.amount),
    })
    onClose()
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-navy-700"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PlusCircle size={20} className="text-accent" />
              <h2 id="modal-title" className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Add Transaction
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Description */}
            <div>
              <label htmlFor="tx-description" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Description
              </label>
              <input
                id="tx-description"
                type="text"
                placeholder="e.g. Grocery shopping"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`input-field ${errors.description ? 'ring-2 ring-red-500 border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-expense mt-1">{errors.description}</p>
              )}
            </div>

            {/* Amount + Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="tx-amount" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Amount ($)
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`input-field ${errors.amount ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                />
                {errors.amount && (
                  <p className="text-xs text-expense mt-1">{errors.amount}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Type
                </label>
                <div className="flex gap-1 bg-gray-100 dark:bg-navy-700 p-1 rounded-xl h-[42px] items-center">
                  {['expense', 'income'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleChange('type', t)}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                        form.type === t
                          ? t === 'income'
                            ? 'bg-income text-white'
                            : 'bg-expense text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="tx-category" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Category
                </label>
                <select
                  id="tx-category"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="select-field"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tx-date" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Date
                </label>
                <input
                  id="tx-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`input-field ${errors.date ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 justify-center">
                <PlusCircle size={15} />
                Add Transaction
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
