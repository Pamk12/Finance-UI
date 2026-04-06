import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Lightbulb, BarChart2 } from 'lucide-react'
import useStore from '../store/useStore'
import { formatCurrency } from '../utils/helpers'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: 'easeOut' },
  }),
}

function InsightCard({ icon: Icon, title, value, subtitle, color, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="card flex items-start gap-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{title}</p>
        <p className="text-base font-bold text-gray-800 dark:text-gray-100 truncate">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}

export default function Insights() {
  const getInsights = useStore((s) => s.getInsights)
  const insights = getInsights()

  const momPositive = parseFloat(insights.momChange) >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <InsightCard
        index={0}
        icon={BarChart2}
        title="Highest Spending Category"
        value={insights.topCategory}
        subtitle={`$${insights.topCategoryAmount} total`}
        color="#8B5CF6"
      />
      <InsightCard
        index={1}
        icon={momPositive ? TrendingUp : TrendingDown}
        title="Month-over-Month Change"
        value={`${momPositive ? '+' : ''}${insights.momChange}%`}
        subtitle={momPositive ? 'Spending increased vs last month' : 'Spending decreased vs last month'}
        color={momPositive ? '#EF4444' : '#10B981'}
      />
      <InsightCard
        index={2}
        icon={Lightbulb}
        title="Quick Insight"
        value={`Transport ${insights.transportSavings}`}
        subtitle="You spent less on transport this month. Keep it up!"
        color="#F59E0B"
      />
    </div>
  )
}
