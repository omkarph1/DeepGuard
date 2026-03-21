import { motion } from 'framer-motion'

export default function ConfidenceGauge({ fakeProb = 0 }) {
  const percentage = fakeProb * 100
  const isReal = percentage < 50
  const displayProb = isReal ? (1 - fakeProb) * 100 : percentage

  // SVG arc calculation
  const radius = 80
  const circumference = Math.PI * radius // semi-circle
  const offset = circumference - (displayProb / 100) * circumference

  const color = isReal ? '#34D399' : percentage > 75 ? '#F87171' : '#F59E0B'
  const label = isReal ? 'REAL' : 'FAKE'
  const tier = displayProb > 80 ? 'HIGH' : displayProb > 60 ? 'MODERATE' : 'BORDERLINE'

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Ensemble Confidence
      </h4>
      
      <div className="relative w-48 h-28">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Filled arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-3xl font-black"
            style={{ color }}
          >
            {displayProb.toFixed(1)}%
          </motion.span>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
          {tier} · {label}
        </span>
      </div>
    </div>
  )
}
