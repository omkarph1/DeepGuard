import { motion } from 'framer-motion'

export default function ModelCard({ model, index = 0 }) {
  const isFake = model.label === 'FAKE'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">{model.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{model.version} · {model.accuracy} accuracy</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold
          ${isFake 
            ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
          }`}
        >
          {model.label}
        </span>
      </div>

      {/* Score Bars */}
      <div className="space-y-3">
        {/* Fake probability */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">Fake</span>
            <span className="font-mono text-red-400">{(model.fake_prob * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${model.fake_prob * 100}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
            />
          </div>
        </div>

        {/* Real probability */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">Real</span>
            <span className="font-mono text-emerald-400">{(model.real_prob * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${model.real_prob * 100}%` }}
              transition={{ duration: 1, delay: index * 0.15 + 0.4, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
        {model.description}
      </p>
    </motion.div>
  )
}
