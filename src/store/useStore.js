import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_TRANSACTIONS = [
  { id: '1', date: '2024-01-15', description: 'Salary', category: 'Income', amount: 5000, type: 'income' },
  { id: '2', date: '2024-01-16', description: 'Grocery Store', category: 'Food', amount: 120.5, type: 'expense' },
  { id: '3', date: '2024-01-18', description: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense' },
  { id: '4', date: '2024-01-19', description: 'Uber', category: 'Transport', amount: 24.0, type: 'expense' },
  { id: '5', date: '2024-01-20', description: 'Freelance Project', category: 'Income', amount: 1200, type: 'income' },
  { id: '6', date: '2024-01-21', description: 'Electricity Bill', category: 'Utilities', amount: 85.0, type: 'expense' },
  { id: '7', date: '2024-01-22', description: 'Restaurant', category: 'Food', amount: 67.3, type: 'expense' },
  { id: '8', date: '2024-01-23', description: 'Gym Membership', category: 'Health', amount: 49.99, type: 'expense' },
  { id: '9', date: '2024-01-24', description: 'Movie Tickets', category: 'Entertainment', amount: 32.0, type: 'expense' },
  { id: '10', date: '2024-01-25', description: 'Dividend Income', category: 'Income', amount: 250.0, type: 'income' },
  { id: '11', date: '2024-01-26', description: 'Pharmacy', category: 'Health', amount: 38.5, type: 'expense' },
  { id: '12', date: '2024-01-27', description: 'Metro Card', category: 'Transport', amount: 45.0, type: 'expense' },
  { id: '13', date: '2024-01-28', description: 'Online Course', category: 'Education', amount: 79.0, type: 'expense' },
  { id: '14', date: '2024-01-29', description: 'Rental Income', category: 'Income', amount: 2000, type: 'income' },
  { id: '15', date: '2024-01-30', description: 'Supermarket', category: 'Food', amount: 95.2, type: 'expense' },
  { id: '16', date: '2024-02-01', description: 'Spotify', category: 'Entertainment', amount: 9.99, type: 'expense' },
  { id: '17', date: '2024-02-02', description: 'Doctor Visit', category: 'Health', amount: 120.0, type: 'expense' },
  { id: '18', date: '2024-02-03', description: 'Fuel', category: 'Transport', amount: 55.0, type: 'expense' },
  { id: '19', date: '2024-02-04', description: 'Salary Bonus', category: 'Income', amount: 800, type: 'income' },
  { id: '20', date: '2024-02-05', description: 'Internet Bill', category: 'Utilities', amount: 60.0, type: 'expense' },
]

const useStore = create(
  persist(
    (set, get) => ({
      transactions: INITIAL_TRANSACTIONS,
      filters: { category: 'All', type: 'All' },
      sortBy: 'date',
      sortOrder: 'desc',
      searchQuery: '',
      role: 'admin',
      darkMode: false,
      loading: false,
      timeFilter: 'monthly',
      activeTab: 'dashboard',

      setActiveTab: (tab) => set({ activeTab: tab }),
      setRole: (role) => set({ role }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setLoading: (loading) => set({ loading }),
      setTimeFilter: (timeFilter) => set({ timeFilter }),
      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: Date.now().toString() },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getFilteredTransactions: () => {
        const { transactions, filters, searchQuery, sortBy, sortOrder } = get()
        let result = [...transactions]

        if (filters.category !== 'All') {
          result = result.filter((t) => t.category === filters.category)
        }
        if (filters.type !== 'All') {
          result = result.filter((t) => t.type === filters.type)
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          result = result.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          )
        }

        result.sort((a, b) => {
          let valA = sortBy === 'date' ? new Date(a.date) : a.amount
          let valB = sortBy === 'date' ? new Date(b.date) : b.amount
          return sortOrder === 'asc' ? valA - valB : valB - valA
        })

        return result
      },

      getSummary: () => {
        const { transactions } = get()
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        const totalExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
        return {
          totalBalance: totalIncome - totalExpenses,
          totalIncome,
          totalExpenses,
        }
      },

      getCategories: () => {
        const { transactions } = get()
        const cats = [...new Set(transactions.map((t) => t.category))]
        return cats
      },

      getSpendingByCategory: () => {
        const { transactions } = get()
        const expenses = transactions.filter((t) => t.type === 'expense')
        const categoryMap = {}
        expenses.forEach((t) => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
        })
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      },

      getTrendData: (type = 'monthly') => {
        const { transactions } = get()
        if (type === 'weekly') {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          return days.map((day, i) => ({
            name: day,
            balance: Math.round(18000 + Math.sin(i) * 3000 + Math.random() * 1500),
            income: Math.round(3000 + Math.random() * 2000),
            expense: Math.round(1000 + Math.random() * 1500),
          }))
        }
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months.map((month, i) => ({
          name: month,
          balance: Math.round(15000 + i * 800 + Math.sin(i * 0.8) * 2000),
          income: Math.round(6000 + Math.random() * 3000),
          expense: Math.round(2000 + Math.random() * 2000),
        }))
      },

      getInsights: () => {
        const { transactions } = get()
        const spending = {}
        transactions.filter((t) => t.type === 'expense').forEach((t) => {
          spending[t.category] = (spending[t.category] || 0) + t.amount
        })
        const topCategory = Object.entries(spending).sort((a, b) => b[1] - a[1])[0]
        const currentMonth = transactions.filter((t) => t.date.startsWith('2024-02'))
        const prevMonth = transactions.filter((t) => t.date.startsWith('2024-01'))
        const currentSpend = currentMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        const prevSpend = prevMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        const momChange = prevSpend ? ((currentSpend - prevSpend) / prevSpend) * 100 : 0
        return {
          topCategory: topCategory ? topCategory[0] : 'N/A',
          topCategoryAmount: topCategory ? topCategory[1].toFixed(2) : '0.00',
          momChange: momChange.toFixed(1),
          transportSavings: '-15%',
        }
      },
    }),
    {
      name: 'finflow-storage',
      partialState: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
        role: state.role,
      }),
    }
  )
)

export default useStore
