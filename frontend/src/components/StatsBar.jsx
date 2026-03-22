import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function Counter({ end, suffix = '', prefix = '', duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const countRef = useRef(null)

  useEffect(() => {
    if (!isInView || !countRef.current) return
    
    let startTime = null
    const startValue = 0
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = startValue + (end - startValue) * eased
      
      if (countRef.current) {
        if (end >= 1000) {
          countRef.current.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`
        } else if (end < 10) {
          countRef.current.textContent = `${prefix}${Math.floor(current)}${suffix}`
        } else {
          countRef.current.textContent = `${prefix}${current.toFixed(2)}${suffix}`
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, end, suffix, prefix, duration])

  return (
    <span ref={(el) => { ref.current = el; countRef.current = el }} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  )
}

const stats = [
  { value: 96.01, suffix: '%', label: 'Accuracy', prefix: '' },
  { value: 288184, suffix: '+', label: 'Training Images', prefix: '' },
  { value: 3, suffix: '', label: 'AI Models', prefix: '' },
  { value: 17, suffix: '', label: 'Data Sources', prefix: '' },
]

export default function StatsBar() {
  return (
    <section className="relative py-12 border-y transition-colors duration-300
                        bg-white/50 dark:bg-surface-dark/50 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                <Counter
                  end={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  duration={2.5}
                />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
