import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { formatCurrency, animateNumber } from '../utils/helpers'

const cardConfig = {
  balance: {
    label: 'Total Balance',
    icon: DollarSign,
    gradient: 'from-emerald-400 to-teal-500',
    bgGlow: 'shadow-emerald-200 dark:shadow-emerald-900/40',
    iconBg: 'bg-white/20',
    textColor: 'text-white',
  },
  income: {
    label: 'Total Income',
    icon: TrendingUp,
    gradient: 'from-blue-400 to-indigo-500',
    bgGlow: 'shadow-blue-200 dark:shadow-blue-900/40',
    iconBg: 'bg-white/20',
    textColor: 'text-white',
  },
  expense: {
    label: 'Total Expenses',
    icon: TrendingDown,
    gradient: 'from-rose-400 to-red-500',
    bgGlow: 'shadow-rose-200 dark:shadow-rose-900/40',
    iconBg: 'bg-white/20',
    textColor: 'text-white',
  },
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!started.current) {
      started.current = true
      animateNumber(0, value, 1200, (v) => setDisplay(v))
    }
  }, [value])

  return <span>{formatCurrency(display)}</span>
}

export default function SummaryCard({ type, value, percentChange }) {
  const config = cardConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} p-6 text-white shadow-xl ${config.bgGlow} cursor-pointer`}
    >
      {/* Background blur circles */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-white/10 blur-xl" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{config.label}</p>
          <div className="text-3xl font-bold tracking-tight">
            <AnimatedNumber value={value} />
          </div>
          {percentChange !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-xs text-white/75">
              {percentChange >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>
                {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}% vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`${config.iconBg} backdrop-blur-sm rounded-xl p-3`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}
