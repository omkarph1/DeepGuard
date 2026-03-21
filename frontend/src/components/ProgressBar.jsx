import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const stages = ['Received', 'Extracting', 'Inferring', 'Voting', 'Done']

export default function ProgressBar({ currentStage = 0 }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage} className="flex items-center flex-1 last:flex-0">
            {/* Step circle */}
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index <= currentStage ? 1 : 0.8,
                  backgroundColor: index < currentStage
                    ? '#00D4E8'
                    : index === currentStage
                      ? '#7B61FF'
                      : 'transparent',
                }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${index < currentStage
                    ? 'border-primary text-white'
                    : index === currentStage
                      ? 'border-accent text-white animate-pulse-glow'
                      : 'border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                  }`}
              >
                {index < currentStage ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <span className={`text-[10px] sm:text-xs mt-2 font-medium whitespace-nowrap
                ${index <= currentStage
                  ? 'text-primary-light dark:text-primary'
                  : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage}
              </span>
            </div>

            {/* Connector line */}
            {index < stages.length - 1 && (
              <div className="flex-1 mx-1 sm:mx-2 h-0.5 rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < currentStage ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent origin-left"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
