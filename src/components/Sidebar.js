import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  Settings,
  TrendingUp,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react'
import useStore from '../store/useStore'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function NavItem({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white/90'
      }`}
      aria-current={active ? 'page' : undefined}
      id={`nav-${item.id}`}
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full"
        />
      )}
      <Icon size={18} className={active ? 'text-accent' : ''} />
      <span>{item.label}</span>
      {active && <ChevronRight size={14} className="ml-auto text-white/40" />}
    </button>
  )
}

export default function Sidebar() {
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">FinFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            onClick={(id) => {
              setActiveTab(id)
              setMobileOpen(false)
            }}
          />
        ))}
      </nav>

      {/* User card */}
      <div className="p-4 mx-2 mb-4 rounded-xl bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            U
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">User</p>
            <p className="text-xs text-white/50 truncate">user@finflow.app</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-navy-900 p-2 rounded-xl text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-navy-900 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 z-50 w-60 h-full bg-navy-900 lg:hidden shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-white/60 hover:text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
