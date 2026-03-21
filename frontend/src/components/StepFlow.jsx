import { motion } from 'framer-motion'
import { Upload, Cpu, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: 'Upload',
    description: 'Drop your video file for analysis',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI Analyzes',
    description: '3 models inspect every frame',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Get Verdict',
    description: 'Real or Fake with full breakdown',
  },
]

export default function StepFlow() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            className="flex flex-col items-center text-center w-48"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 
                            flex items-center justify-center mb-3 text-primary-light dark:text-primary">
              {step.icon}
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
              {step.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {step.description}
            </p>
          </motion.div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
              className="hidden md:block w-20 h-px bg-gradient-to-r from-primary/40 to-accent/40 origin-left"
            />
          )}
        </div>
      ))}
    </div>
  )
}
