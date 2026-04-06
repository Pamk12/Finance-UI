import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye } from 'lucide-react'
import useStore from '../store/useStore'

export default function RoleSwitcher() {
  const role = useStore((s) => s.role)
  const setRole = useStore((s) => s.setRole)

  const isAdmin = role === 'admin'

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">Role:</span>
      <div className="relative flex items-center bg-gray-100 dark:bg-navy-700 rounded-xl p-1 gap-1">
        {['viewer', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors duration-200 ${
              role === r
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            id={`role-${r}`}
            aria-pressed={role === r}
          >
            {r === 'admin' ? <Shield size={12} /> : <Eye size={12} />}
            {r}
            {role === r && (
              <motion.div
                layoutId="role-pill"
                className={`absolute inset-0 rounded-lg -z-10 ${
                  r === 'admin'
                    ? 'bg-accent'
                    : 'bg-gray-500'
                }`}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={role}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`text-xs font-semibold px-2 py-0.5 rounded-full hidden md:inline-block ${
            isAdmin
              ? 'bg-blue-100 dark:bg-blue-900/30 text-accent'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {isAdmin ? 'Full Access' : 'Read Only'}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
