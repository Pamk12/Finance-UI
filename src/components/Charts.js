import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import { formatCurrency, CATEGORY_COLORS } from '../utils/helpers'

const DONUT_COLORS = Object.values(CATEGORY_COLORS)

// Custom tooltip for line chart
function CustomLineTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500 dark:text-gray-400 capitalize">{p.dataKey}:</span>
            <span className="font-medium" style={{ color: p.color }}>
              {formatCurrency(p.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Custom tooltip for pie chart
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200">{payload[0].name}</p>
        <p className="text-gray-500 dark:text-gray-400">{formatCurrency(payload[0].value)}</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">{payload[0].payload.percent}%</p>
      </div>
    )
  }
  return null
}

// Custom legend for pie chart with hover state
function CustomPieLegend({ data, activeIndex, setActiveIndex }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex flex-col gap-2 mt-4">
      {data.map((entry, index) => (
        <div
          key={entry.name}
          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
            activeIndex === index ? 'bg-gray-100 dark:bg-navy-700' : 'hover:bg-gray-50 dark:hover:bg-navy-700/50'
          }`}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: DONUT_COLORS[index % DONUT_COLORS.length] }} />
            <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {((entry.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TrendChart() {
  const timeFilter = useStore((s) => s.timeFilter)
  const setTimeFilter = useStore((s) => s.setTimeFilter)
  const getTrendData = useStore((s) => s.getTrendData)
  const darkMode = useStore((s) => s.darkMode)
  const data = getTrendData(timeFilter)

  const gridColor = darkMode ? '#334155' : '#F1F5F9'
  const axisColor = darkMode ? '#64748B' : '#94A3B8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Balance Trend</h2>
        <div className="flex gap-1 bg-gray-100 dark:bg-navy-700 p-1 rounded-lg">
          {['weekly', 'monthly'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all duration-200 ${
                timeFilter === f
                  ? 'bg-white dark:bg-navy-600 text-accent shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#3B82F6' }}
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 4"
            activeDot={{ r: 5, fill: '#10B981' }}
            animationDuration={1400}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 4"
            activeDot={{ r: 5, fill: '#EF4444' }}
            animationDuration={1600}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 justify-center text-xs text-gray-500 dark:text-gray-400">
        {[
          { color: '#3B82F6', label: 'Balance' },
          { color: '#10B981', label: 'Income' },
          { color: '#EF4444', label: 'Expense' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function SpendingChart() {
  const getSpendingByCategory = useStore((s) => s.getSpendingByCategory)
  const data = getSpendingByCategory()
  const [activeIndex, setActiveIndex] = useState(null)
  const total = data.reduce((s, d) => s + d.value, 0)

  const enriched = data.map((d) => ({
    ...d,
    percent: total ? ((d.value / total) * 100).toFixed(0) : 0,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card h-full"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Spending Breakdown</h2>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {enriched.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomPieLegend data={enriched} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </motion.div>
  )
}

export function CategoryBarChart() {
  const getSpendingByCategory = useStore((s) => s.getSpendingByCategory)
  const data = getSpendingByCategory()
  const darkMode = useStore((s) => s.darkMode)

  const gridColor = darkMode ? '#334155' : '#F1F5F9'
  const axisColor = darkMode ? '#64748B' : '#94A3B8'

  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card h-full"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Expenses by Category</h2>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sortedData} margin={{ top: 5, right: 10, bottom: 35, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: axisColor, fontSize: 11 }} 
            axisLine={false} 
            tickLine={false}
            angle={-45}
            textAnchor="end"
            dy={15}
            dx={-5}
          />
          <YAxis 
            tick={{ fill: axisColor, fontSize: 11 }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={45}
          />
          <Tooltip 
            cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 rounded-xl p-3 shadow-xl text-sm">
                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{payload[0].payload.name}</p>
                    <p className="font-medium text-expense">
                      {formatCurrency(payload[0].value)}
                    </p>
                  </div>
                )
              }
              return null;
            }} 
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            maxBarSize={40}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#3B82F6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
