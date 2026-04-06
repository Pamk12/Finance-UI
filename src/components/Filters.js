import { useCallback, useEffect, useRef } from 'react'
import { Search, Filter, ArrowUpDown, Download } from 'lucide-react'
import useStore from '../store/useStore'
import { debounce, exportToCSV } from '../utils/helpers'

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Income']
const TYPES = ['All', 'income', 'expense']
const SORT_OPTIONS = ['date', 'amount']

export default function Filters() {
  const searchQuery = useStore((s) => s.searchQuery)
  const setSearchQuery = useStore((s) => s.setSearchQuery)
  const filters = useStore((s) => s.filters)
  const setFilter = useStore((s) => s.setFilter)
  const sortBy = useStore((s) => s.sortBy)
  const setSortBy = useStore((s) => s.setSortBy)
  const sortOrder = useStore((s) => s.sortOrder)
  const setSortOrder = useStore((s) => s.setSortOrder)
  const getFilteredTransactions = useStore((s) => s.getFilteredTransactions)

  const inputRef = useRef()

  const debouncedSearch = useCallback(
    debounce((val) => setSearchQuery(val), 300),
    []
  )

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value)
  }

  const handleExport = () => {
    const transactions = getFilteredTransactions()
    exportToCSV(transactions)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search transactions..."
          onChange={handleSearchChange}
          className="input-field pl-9"
          id="search-transactions"
          aria-label="Search transactions"
        />
      </div>

      {/* Category filter */}
      <div className="relative">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className="select-field pl-8 pr-8 appearance-none"
          id="filter-category"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
      </div>

      {/* Type filter */}
      <div className="flex gap-1 bg-gray-100 dark:bg-navy-700 rounded-xl p-1">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter('type', t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
              filters.type === t
                ? t === 'income'
                  ? 'bg-emerald-500 text-white'
                  : t === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-navy-600 text-gray-700 dark:text-gray-200 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            aria-pressed={filters.type === t}
          >
            {t === 'All' ? 'All' : t}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-1 items-center">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-field pr-8 appearance-none text-sm"
          id="sort-by"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o} value={o}>Sort: {o.charAt(0).toUpperCase() + o.slice(1)}</option>
          ))}
        </select>
        <button
          onClick={toggleSortOrder}
          className="btn-secondary !px-2.5 !py-2"
          title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          aria-label="Toggle sort order"
        >
          <ArrowUpDown size={14} className={`transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Export */}
      <button
        onClick={handleExport}
        className="btn-secondary"
        id="export-csv"
        aria-label="Export CSV"
        title="Export to CSV"
      >
        <Download size={14} />
        <span className="hidden sm:inline text-sm">Export</span>
      </button>
    </div>
  )
}
