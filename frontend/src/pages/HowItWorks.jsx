import { motion } from 'framer-motion'
import { ScanFace, Brain, FlipHorizontal, Vote, Radio } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { Float, Box, TorusKnot, Sphere, Icosahedron, MeshDistortMaterial, Torus, Line, OrbitControls, Html } from '@react-three/drei'
import HeroScene from '../components/HeroScene'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

// Utility for the downward flow arrows
const ArrowDivider = () => (
  <div className="flex justify-center my-8 md:my-12 relative z-20">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="animate-bounce"
    >
      <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,232,0.5)]">
        <svg className="w-7 h-7 text-primary-light dark:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </motion.div>
  </div>
)

const models = [
  {
    name: 'ConvNeXt V2',
    version: 'v2',
    accuracy: '96.01%',
    auc: '0.989',
    color: 'from-cyan-500 to-blue-500',
    focus: 'Spatial Texture Artifacts',
    description: 'Detects manipulation artifacts in facial textures — jawline inconsistencies, skin smoothing patterns, and unnatural blending boundaries. State-of-the-art convolutional architecture with global response normalization.',
    strengths: ['Jawline anomalies', 'Skin texture artifacts', 'Blending boundary detection', 'Compression artifact analysis'],
  },
  {
    name: 'XceptionNet',
    version: 'v3',
    accuracy: '92.35%',
    auc: '0.971',
    color: 'from-purple-500 to-pink-500',
    focus: 'Frequency Domain Analysis',
    description: 'Specializes in detecting GAN-generated frequency patterns and compression noise invisible to the human eye. Depthwise separable convolutions capture subtle spectral inconsistencies.',
    strengths: ['GAN frequency patterns', 'Compression noise', 'Spectral inconsistencies', 'Color channel anomalies'],
  },
  {
    name: 'ResNeXt50-BiLSTM',
    version: 'v2',
    accuracy: '94.00%',
    auc: '0.978',
    color: 'from-emerald-500 to-teal-500',
    focus: 'Temporal Consistency',
    description: 'Analyzes sequences of 15 frames to detect temporal flickering and inter-frame inconsistencies that static models miss. Combines spatial features from ResNeXt50 with bidirectional temporal modeling.',
    strengths: ['Temporal flickering', 'Inter-frame inconsistencies', 'Motion artifacts', 'Sequence-based analysis'],
  },
]

const ttaViews = [
  { label: 'Original', transform: '' },
  { label: 'H-Flip', transform: 'scaleX(-1)' },
  { label: 'Center Crop', transform: 'scale(1.15)' },
  { label: 'Color Jitter', transform: '', filter: 'saturate(1.4) brightness(1.1)' },
]

export default function HowItWorks() {
  return (
    <div className="py-16 sm:py-24">
      {/* Page Header */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden w-full mb-12">
        <div className="absolute inset-0 z-0 opacity-100 dark:opacity-40">
          <HeroScene />
        </div>
        <motion.div {...fadeInUp} className="relative z-10 text-center px-4">
          <p className="text-primary-light dark:text-primary text-sm font-semibold tracking-wider uppercase mb-4">
            Technical Deep Dive
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            How <span className="gradient-text">DeepGuard</span> Works
          </h1>
          <p className="text-lg text-slate-800 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            From video upload to verdict — understand every step of our AI detection pipeline.
          </p>
        </motion.div>
      </section>

      {/* Section 1: MTCNN Face Extraction */}
      <section className="section-wrapper relative">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 -z-10 opacity-20 md:opacity-30 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
              <Box args={[1.5, 1.5, 1.5]}>
                <meshStandardMaterial color="#00D4E8" wireframe />
              </Box>
            </Float>
          </Canvas>
        </div>
        <motion.div {...fadeInUp} className="glass-card p-8 sm:p-12 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <ScanFace className="w-6 h-6 text-primary-light dark:text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Stage 1: Face Extraction</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">MTCNN Neural Network</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                MTCNN (Multi-task Cascaded Convolutional Network) processes each video frame to detect and extract face regions. It uses three neural networks in cascade:
              </p>
              <ul className="space-y-3">
                {['P-Net: Proposes candidate face regions', 'R-Net: Refines face boundaries', 'O-Net: Outputs precise landmarks'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary-light dark:text-primary">{i + 1}</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img src="/images/deepfake_image.jpg" alt="Face extraction example" className="w-full rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2">
                  {['Face 1', 'Face 2', 'Face 3'].map(label => (
                    <span key={label} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <ArrowDivider />

      {/* Section 2: The 3 Models */}
      <section className="section-wrapper">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              Stage 2: Three-Model Ensemble
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Each model specializes in a different type of deepfake artifact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="glass-card p-6 sm:p-8"
            >
              {/* Header with gradient bar */}
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${model.color} mb-6`} />
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{model.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{model.version} — {model.focus}</p>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                {model.description}
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-5">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{model.accuracy}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">TTA Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{model.auc}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AUC Score</p>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Detects</p>
                <div className="flex flex-wrap gap-2">
                  {model.strengths.map(s => (
                    <span key={s} className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ArrowDivider />

      {/* Section 3: TTA */}
      <section className="section-wrapper relative">
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 -z-10 opacity-20 md:opacity-30 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
              <Icosahedron args={[1.8, 0]}>
                <meshStandardMaterial color="#7B61FF" wireframe />
              </Icosahedron>
            </Float>
          </Canvas>
        </div>
        <motion.div {...fadeInUp} className="glass-card p-8 sm:p-12 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <FlipHorizontal className="w-6 h-6 text-primary-light dark:text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Stage 3: Test-Time Augmentation</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">4 views × 3 models = 12 predictions per face</p>
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Each extracted face is augmented into 4 different views before inference. The model predictions are averaged across all views, reducing noise and improving robustness.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ttaViews.map((view, index) => (
              <motion.div
                key={view.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative rounded-xl overflow-hidden mb-2 aspect-square bg-slate-100 dark:bg-slate-800">
                  <img
                    src="/images/deepfake_img.png"
                    alt={view.label}
                    className="w-full h-full object-cover"
                    style={{ transform: view.transform, filter: view.filter || 'none' }}
                  />
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{view.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <ArrowDivider />

      {/* Section 4: Majority Voting */}
      <section className="section-wrapper relative">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 -z-10 opacity-20 md:opacity-30 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Float speed={2.5} rotationIntensity={2} floatIntensity={2}>
              <Torus args={[1.2, 0.4, 16, 32]}>
                <meshStandardMaterial color="#F59E0B" wireframe />
              </Torus>
            </Float>
          </Canvas>
        </div>
        <motion.div {...fadeInUp} className="glass-card p-8 sm:p-12 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Vote className="w-6 h-6 text-primary-light dark:text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Stage 4: Majority Voting</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">2 out of 3 models must agree</p>
            </div>
          </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {[
                { name: 'ConvNeXt V2', vote: 'FAKE', color: 'text-red-400' },
                { name: 'XceptionNet', vote: 'FAKE', color: 'text-red-400' },
                { name: 'ResNeXt-BiLSTM', vote: 'REAL', color: 'text-emerald-400' },
              ].map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex-1 text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 shadow-lg"
                >
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{m.name}</p>
                  <p className={`text-2xl font-black ${m.color}`}>{m.vote}</p>
                </motion.div>
              ))}
            </div>
        </motion.div>
      </section>

      <ArrowDivider />

      {/* Section 5: Final Result */}
      <section className="section-wrapper relative">
        <motion.div {...fadeInUp} className="glass-card p-6 sm:p-10 relative z-10 max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Stage 5: Final Verdict & Reporting</h2>
            <p className="text-slate-500 dark:text-slate-400">The comprehensive ensemble conclusion presented directly to the user</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Verdict Card */}
            <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex flex-col items-center justify-center text-center col-span-1">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Network Consensus</p>
              <div className="w-32 h-32 rounded-full border-8 border-red-500/20 flex flex-col items-center justify-center relative mb-4">
                <div className="absolute inset-0 rounded-full border-t-8 border-l-8 border-red-500 rotate-45 pointer-events-none" />
                <p className="text-4xl font-black text-red-500 drop-shadow-sm">93%</p>
                <p className="text-xs font-bold text-red-400">FAKE</p>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-red-500 font-bold">2 out of 3</span> models flagged synthetic manipulation.
              </p>
            </div>

            {/* Breakdown Card */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-1 lg:col-span-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                Full Confidence Breakdown
              </p>
              <div className="space-y-4">
                {[
                  { name: 'ConvNeXt V2', fake: '96.2%', real: '3.8%', focus: 'Spatial Texture', result: 'FAKE ❌', color: 'text-red-500' },
                  { name: 'XceptionNet', fake: '89.4%', real: '10.6%', focus: 'Frequency Domain', result: 'FAKE ❌', color: 'text-red-500' },
                  { name: 'ResNeXt-BiLSTM', fake: '14.1%', real: '85.9%', focus: 'Temporal Sequence', result: 'REAL ✅', color: 'text-emerald-500' }
                ].map(model => (
                  <div key={model.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm gap-4">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{model.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{model.focus}</p>
                    </div>
                    
                    {/* Progress Bar Mock */}
                    <div className="w-full sm:w-48 h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden flex shadow-inner">
                       <div className="h-full bg-red-400 dark:bg-red-500" style={{ width: model.fake }} />
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {model.fake} <span className="text-red-400">Fake</span>
                        </span>
                      </div>
                      <span className={`text-sm font-black w-20 text-right ${model.color}`}>{model.result}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <p className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 rounded-lg">
                  + PDF Export Enabled
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent my-20" />

      {/* Behind the Scenes: SSE Pipeline */}
      <section className="section-wrapper relative">
        <motion.div {...fadeInUp} className="glass-card p-8 sm:p-12 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-primary-light dark:text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Behind The Scenes</p>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Real-Time Data Pipeline</h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            {[
              { label: 'Frontend', sub: 'Upload Video', emoji: '🌐' },
              { label: 'Flask API', sub: 'Process & Stream', emoji: '⚙️' },
              { label: '3 Models', sub: 'Parallel Inference', emoji: '🧠' },
              { label: 'SSE Stream', sub: 'Live Results', emoji: '📡' },
              { label: 'Browser', sub: 'Display Verdict', emoji: '✅' },
            ].map((step, index) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 w-[180px] shadow-lg backdrop-blur-sm"
                >
                  <p className="text-4xl mb-3">{step.emoji}</p>
                  <p className="text-base font-black text-slate-800 dark:text-slate-100 tracking-wide uppercase">{step.label}</p>
                  <p className="text-sm font-semibold text-primary mt-1">{step.sub}</p>
                </motion.div>
                {index < 4 && (
                  <div className="hidden md:block text-slate-400 dark:text-slate-500 text-3xl mx-4">→</div>
                )}
                {index < 4 && (
                  <div className="md:hidden text-slate-400 dark:text-slate-500 text-3xl my-4">↓</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
