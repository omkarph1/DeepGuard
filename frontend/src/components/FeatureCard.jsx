import { motion } from 'framer-motion'

export default function FeatureCard({ icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card p-6 sm:p-8 group cursor-default"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 
                      flex items-center justify-center mb-5 
                      group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
