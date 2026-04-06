import { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import useStore from './store/useStore'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-navy-900 theme-transition">
      <Sidebar />
      <Dashboard />
    </div>
  )
}
