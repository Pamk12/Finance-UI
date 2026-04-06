/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to a human-readable format
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Category color map – consistent across the entire app
 */
export const CATEGORY_COLORS = {
  Food: '#10B981',
  Transport: '#3B82F6',
  Entertainment: '#8B5CF6',
  Health: '#F59E0B',
  Utilities: '#6B7280',
  Education: '#EC4899',
  Income: '#0EA5E9',
  Other: '#94A3B8',
}

/**
 * Get a color for a category
 * @param {string} category
 * @returns {string}
 */
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#94A3B8'
}

/**
 * Export transactions to a CSV file
 * @param {Array} transactions
 */
export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type']
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.amount.toFixed(2),
    t.type,
  ])
  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `finflow_transactions_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Animate a number from 0 to target using requestAnimationFrame
 */
export const animateNumber = (from, to, duration, onUpdate) => {
  const startTime = performance.now()
  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    onUpdate(from + (to - from) * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
