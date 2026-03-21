import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

export default function ProgressTerminal({ logs = [] }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="rounded-2xl overflow-hidden border transition-colors
                    bg-slate-900 border-slate-700">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">deepguard-inference</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="p-4 h-64 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed"
      >
        {logs.length === 0 ? (
          <p className="text-slate-500">Waiting for analysis to begin...</p>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2"
            >
              <span className="text-slate-500 select-none">$</span>
              <span className={`
                ${log.includes('✓') || log.includes('REAL') ? 'text-emerald-400' : ''}
                ${log.includes('FAKE') || log.includes('Error') ? 'text-red-400' : ''}
                ${log.includes('[Stage') ? 'text-cyan-400' : ''}
                ${log.includes('confidence') ? 'text-yellow-400' : ''}
                ${!log.includes('✓') && !log.includes('FAKE') && !log.includes('REAL') && !log.includes('[Stage') && !log.includes('confidence') ? 'text-slate-300' : ''}
              `}>
                {log}
              </span>
            </motion.div>
          ))
        )}
        {/* Blinking cursor */}
        {logs.length > 0 && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-5 mt-1" />
        )}
      </div>
    </div>
  )
}
