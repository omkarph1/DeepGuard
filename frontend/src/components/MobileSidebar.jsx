import { Link, useLocation } from 'react-router-dom'
import { X, Sun, Moon, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileSidebar({ isOpen, onClose, darkMode, toggleDark, navLinks }) {
  const location = useLocation()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-72 shadow-2xl
                       bg-surface-light dark:bg-surface-dark border-l border-slate-200 dark:border-slate-700"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary-light dark:text-primary" />
                  <span className="text-lg font-bold text-slate-800 dark:text-white">
                    Deep<span className="gradient-text">Guard</span>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${location.pathname === link.path
                          ? 'text-primary-light dark:text-primary bg-primary/10'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom: Theme Toggle */}
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={toggleDark}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
                            text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50
                            transition-all duration-200"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
