import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database } from 'lucide-react'
import HeroScene from '../components/HeroScene'
import StatsBar from '../components/StatsBar'
import FeatureCard from '../components/FeatureCard'
import StepFlow from '../components/StepFlow'

const features = [
  {
    icon: '🧠',
    title: '3-Model Ensemble',
    description: 'ConvNeXt V2 + XceptionNet + ResNeXt-BiLSTM work together. Each model catches different manipulation artifacts for maximum coverage.',
  },
  {
    icon: '⚡',
    title: 'Real-Time SSE Streaming',
    description: 'Watch the analysis unfold live. Every stage — face extraction, model inference, voting — streams directly to your browser.',
  },
  {
    icon: '📄',
    title: 'PDF Report Export',
    description: 'Download a comprehensive report with all model scores, confidence metrics, extracted frames, and the final verdict.',
  },
]

const datasets = [
  'FaceForensics++', 'Celeb-DF v2', 'DFDC', '140K Real Faces',
  'StyleGAN', 'StyleGAN2', 'PGGAN', 'StarGAN', 'AttGAN',
  'BEGAN', 'CramerGAN', 'MMDGAN', 'Artifact GAN',
]

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image + Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-deepfake.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark mode overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/70 to-bg-dark/90 hidden dark:block" />
          {/* Light mode overlay — semi-transparent so image shows through */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-light/60 via-bg-light/50 to-bg-light/70 dark:hidden" />
        </div>

        {/* 3D Scene */}
        <HeroScene />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary-light dark:text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                AI-Powered Deepfake Detection
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6 text-slate-800 dark:text-white">
                Is it{' '}
                <span className="gradient-text">Real</span> or{' '}
                <span className="gradient-text">Fake</span>?
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-600 dark:text-slate-300">
                  Our AI Knows.
                </span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
                Upload any video and our 3-model ensemble — trained on 288K+ balanced images from 17 curated types — will tell you if it's been manipulated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/detect" className="btn-glow inline-flex items-center justify-center gap-2">
                  Analyze Video
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold
                            border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300
                            hover:border-primary hover:text-primary-light dark:hover:text-primary transition-all duration-300"
                >
                  How It Works
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Features Section */}
      <section className="section-wrapper">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4"
          >
            Why <span className="gradient-text">DeepGuard</span>?
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Three specialized AI models working together deliver industry-leading detection accuracy.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-16 sm:py-24 border-y transition-colors border-slate-200 dark:border-slate-800
                          bg-white/50 dark:bg-surface-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4"
            >
              How It <span className="gradient-text">Works</span>
            </motion.h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              From upload to verdict in three simple steps — powered by cutting-edge AI.
            </p>
          </div>
          <StepFlow />
        </div>
      </section>

      {/* Trust / Dataset Section */}
      <section className="section-wrapper">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4"
          >
            Trained on <span className="gradient-text">17 Curated Types</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            288K+ balanced images covering deepfake videos, GAN generators, and diffusion models.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {datasets.map((ds, i) => (
            <motion.span
              key={ds}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                        bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300
                        border border-slate-200 dark:border-slate-700"
            >
              <Database className="w-3 h-3 text-primary-light dark:text-primary" />
              {ds}
            </motion.span>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center
                       bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5
                       dark:from-primary/20 dark:via-accent/10 dark:to-primary/5
                       border border-primary/20 dark:border-primary/30"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Ready to detect a <span className="gradient-text">deepfake</span>?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              Upload your video and get a detailed AI analysis in seconds. No sign-up required.
            </p>
            <Link to="/detect" className="btn-glow inline-flex items-center gap-2">
              Start Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
