import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Sun, Moon, Menu } from 'lucide-react'
import MobileSidebar from './MobileSidebar'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/detect', label: 'Detect' },
]

export default function Navbar({ darkMode, toggleDark }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300
                      bg-surface-light/70 dark:bg-bg-dark/80 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Shield className="w-7 h-7 text-primary-light dark:text-primary transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                Deep<span className="gradient-text">Guard</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.path
                      ? 'text-primary-light dark:text-primary bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary-light dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: theme toggle + mobile menu */}
            <div className="flex items-center gap-2">
              {/* Dark/Light Toggle (desktop) */}
              <button
                onClick={toggleDark}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg
                          text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                          transition-all duration-200"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg
                          text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                          transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        toggleDark={toggleDark}
        navLinks={navLinks}
      />
    </>
  )
}
