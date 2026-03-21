import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Detect from './pages/Detect'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('deepguard-theme')
    return saved ? saved === 'dark' : true // default dark
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('deepguard-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleDark = () => setDarkMode(prev => !prev)

  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <ScrollToTop />
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
