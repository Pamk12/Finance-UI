import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Bell, PlusCircle } from 'lucide-react'
import useStore from '../store/useStore'
import SummaryCard from '../components/SummaryCard'
import { TrendChart, SpendingChart, CategoryBarChart } from '../components/Charts'
import TransactionList from '../components/TransactionList'
import Filters from '../components/Filters'
import RoleSwitcher from '../components/RoleSwitcher'
import Insights from '../components/Insights'
import AddTransactionModal from '../components/AddTransactionModal'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const darkMode = useStore((s) => s.darkMode)
  const setDarkMode = useStore((s) => s.setDarkMode)
  const role = useStore((s) => s.role)
  const activeTab = useStore((s) => s.activeTab)
  const getSummary = useStore((s) => s.getSummary)
  const summary = getSummary()
  const [showModal, setShowModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Unusual spending detected', desc: 'Entertainment expenses are up by 20% this week.', time: '2 hours ago' },
    { id: 2, title: 'Salary received', desc: '+$5,000.00 has been credited to your account.', time: 'Yesterday' }
  ])
  const isAdmin = role === 'admin'

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="flex-1 min-h-screen flex flex-col max-w-[1400px] w-full mx-auto"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-gray-50/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-navy-700/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto min-w-0">
            {/* Spacer for mobile hamburger */}
            <div className="w-10 lg:w-0 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pl-14 md:pl-0">
            <RoleSwitcher />

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
              aria-label="Toggle dark mode"
              id="dark-mode-toggle"
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notification */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors relative hidden sm:block"
                aria-label="Notifications"
                id="notifications-btn"
              >
                <Bell size={18} />
                {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-gray-100 dark:border-navy-700 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-navy-700 bg-gray-50/50 dark:bg-navy-900/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.length > 0 && <span className="text-xs bg-accent/10 text-accent font-medium px-2 py-0.5 rounded-full">{notifications.length} New</span>}
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-navy-700 max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                          You're all caught up!
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors cursor-pointer text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{n.desc}</p>
                            <p className="text-xs text-accent mt-2 font-medium">{n.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100 dark:border-navy-700 bg-gray-50/50 dark:bg-navy-900/50 text-center">
                        <button onClick={() => setNotifications([])} className="text-sm text-accent font-medium hover:underline">Mark all as read</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Transaction (Admin only) */}
            <AnimatePresence>
              {isAdmin && (
                <motion.button
                  key="add-tx-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => setShowModal(true)}
                  className="btn-primary text-sm !px-3 sm:!px-4 ml-auto md:ml-0 shadow-md sm:shadow-none"
                  id="add-transaction-btn"
                  aria-label="Add Transaction"
                >
                  <PlusCircle size={16} />
                  <span className="hidden sm:inline">Add Transaction</span>
                  <span className="sm:hidden font-medium">Add</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 relative">
        <AnimatePresence mode="wait">
          
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <section aria-label="Financial Summary">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SummaryCard type="balance" value={summary.totalBalance} percentChange={4.2} />
                  <SummaryCard type="income" value={summary.totalIncome} percentChange={8.1} />
                  <SummaryCard type="expense" value={summary.totalExpenses} percentChange={-2.3} />
                </div>
              </section>

              <section aria-label="Insights">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Quick Insights
                </h2>
                <Insights />
              </section>

              <section aria-label="Charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <TrendChart />
                </div>
                <div>
                  <SpendingChart />
                </div>
              </section>
            </motion.div>
          )}

          {/* Transactions View */}
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="card h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    All Transactions
                  </h2>
                </div>
                <div className="mb-4">
                  <Filters />
                </div>
                <div className="flex-1">
                  <TransactionList />
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <section aria-label="Insights">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Deep Insights
                </h2>
                <Insights />
              </section>

              <section aria-label="Detailed Charts" className="space-y-6">
                <TrendChart />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SpendingChart />
                  <CategoryBarChart />
                </div>
              </section>
            </motion.div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card text-center py-24 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-navy-700 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl text-gray-400 dark:text-gray-500">⚙️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Preferences</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  Settings flow is currently in development. Configuration options will appear here in the next release.
                </p>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>

      {/* Add Transaction Modal */}
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </motion.div>
  )
}
