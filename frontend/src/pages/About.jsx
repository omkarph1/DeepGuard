import { motion } from 'framer-motion'
import { Shield, BarChart3, Cpu, FlaskConical, Layers, BookOpen, Database } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Canvas } from '@react-three/fiber'
import { Float, Icosahedron, Sphere, MeshDistortMaterial, Stars, Torus } from '@react-three/drei'
import HeroScene from '../components/HeroScene'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const datasetSources = [
  { name: 'FF++ C23', count: 96695 },
  { name: 'CelebDF v2', count: 72594 },
  { name: 'FFHQ Real', count: 67178 },
  { name: '140K StyleGAN', count: 32121 },
  { name: 'CelebA-HQ', count: 28724 },
  { name: 'StyleGAN2', count: 25852 },
  { name: 'StyleGAN3', count: 10466 },
  { name: 'CIPS-Lab', count: 1519 },
  { name: 'Others (8)', count: 8289 },
]

const barColors = ['#00D4E8', '#0891B2', '#7B61FF', '#6D5ACF', '#34D399', '#059669', '#F59E0B', '#EF4444', '#94A3B8']

const modelPerformance = [
  { name: 'ConvNeXt V2 v3', accuracy: '94.73%', auc: '0.989', tta: '96.01%', params: '88.22M' },
  { name: 'XceptionNet v3', accuracy: '91.26%', auc: '0.971', tta: '92.35%', params: '21.86M' },
  { name: 'ResNeXt50-BiLSTM v2', accuracy: '94.19%', auc: '0.978', tta: '94.00%', params: '49.22M' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-2 text-sm">
        <p className="font-semibold text-slate-800 dark:text-white">{label}</p>
        <p className="text-primary-light dark:text-primary">{payload[0].value.toLocaleString()} images</p>
      </div>
    )
  }
  return null
}

export default function About() {
  return (
    <div className="py-16 sm:py-24">
      {/* Page Header */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden w-full mb-12">
        <div className="absolute inset-0 z-0 opacity-100 dark:opacity-40">
          <HeroScene />
        </div>
        <motion.div {...fadeInUp} className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
                         bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <Shield className="w-4 h-4 text-primary-light dark:text-primary" />
            <span className="text-sm font-medium text-primary-light dark:text-primary">About the Project</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-6">
            DeepGuard <span className="gradient-text">v2</span>
          </h1>
          <p className="text-lg text-slate-800 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            DeepGuard v2 is an AI-powered deepfake detection system designed to combat the growing threat of synthetic media.
            Using a 3-model ensemble trained on 343,000+ balanced images from 17 curated sources.
          </p>
        </motion.div>
      </section>

      {/* Why Ensemble Required & Theory */}
      <section className="section-wrapper relative">
        {/* 3D Background Element */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] -z-10 opacity-30 md:opacity-50 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
              <Icosahedron args={[1.8, 0]}>
                <meshStandardMaterial color="#00D4E8" wireframe transparent opacity={0.6} />
              </Icosahedron>
            </Float>
            <Float speed={3} position={[-2, -2, -1]} rotationIntensity={2} floatIntensity={3}>
              <Torus args={[0.8, 0.1, 16, 32]}>
                <meshStandardMaterial color="#7B61FF" wireframe transparent opacity={0.4} />
              </Torus>
            </Float>
          </Canvas>
        </div>

        <motion.div {...fadeInUp} className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Layers className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Why an Ensemble?</h2>
          </div>
          <div className="glass-card p-6 sm:p-8">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Deepfakes are not created equally. A generative adversarial network (GAN) leaves highly specific frequency artifacts, while a face-swapping algorithm leaves spatial blending boundaries. Relying on a single AI model is dangerous because it creates a single point of failure.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              By combining three entirely different architectural paradigms (Convolutional, Depthwise-Separable, and Recurrent Spatial-Temporal), our ensemble system ensures that if a deepfake manages to bypass one network's detection mechanism, the other two will catch the remaining artifacts.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">How the 3 Models Work</h2>
          </div>
          <div className="grid grid-cols-1 space-y-8">
            {[
              {
                title: 'ConvNeXt V2',
                role: 'Spatial Detail Extractor',
                content: (
                  <div className="space-y-6">
                    <p>ConvNeXt V2 represents the absolute pinnacle of pure convolutional architecture, modernizing classic ResNet designs by natively integrating Vision Transformer (ViT) mechanics into a highly efficient convolutional space.</p>
                    <ul className="space-y-4 pl-2">
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Global Response Normalization:</strong> Distinctly prevents feature collapse and dead neurons across spatial dimensions without excessive compute.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Macro Design Upgrades:</strong> Utilizes huge 7x7 patch sizes to natively process 224x224 faces without losing crucial micro-detail mapping.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Primary Spatial Defense:</strong> Identifies face-swap masking, microscopic jawline seams, and unnatural epidermal smoothing typical of auto-encoders.</span>
                      </li>
                    </ul>
                  </div>
                )
              },
              {
                title: 'XceptionNet',
                role: 'Frequency Domain Analyzer',
                content: (
                  <div className="space-y-6">
                    <p>XceptionNet relies on the incredible efficiency of Depthwise Separable Convolutions. By independently processing spatial layers and cross-channel layers, it operates exactly like an "Extreme Inception" module without the heavy parameter tax of standard CNNs.</p>
                    <ul className="space-y-4 pl-2">
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Depthwise Separation:</strong> Mathematically untangles cross-channel correlations from spatial correlations, drastically reducing feature redundancy.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Fourier Transform Spectral Analysis:</strong> Incredibly adept at mapping invisible high-frequency domains rather than just macroscopic spatial forms.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>GAN Noise Detection:</strong> Effortlessly captures upconvolution grid-artifacts and structural noise inherent to GANs and Diffusion models.</span>
                      </li>
                    </ul>
                  </div>
                )
              },
              {
                title: 'ResNeXt50-BiLSTM',
                role: 'Temporal Sequence Checker',
                content: (
                  <div className="space-y-6">
                    <p>Deepfakes often render flawless frozen frames, but they fail over time. The ResNeXt50-BiLSTM hybrid architecture pulls perfectly mapped embeddings from a ResNeXt backbone and forces them into a Recurrent Neural Network (RNN) sequence to analyze the flow of time.</p>
                    <ul className="space-y-4 pl-2">
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Bidirectional Evaluation:</strong> The BiLSTM reads the exact sequence of faces forwards AND backwards, mapping the rigid laws of facial kinetics.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>Micro-Expression Consistency:</strong> Pinpoints impossible muscular contortions and unnatural inter-frame warping that simple models inherently miss.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_10px_rgba(0,212,232,0.8)]" />
                        <span><strong>rPPG Disentanglement:</strong> Detects disruptions in photoplethysmography (blood flow pulse), guaranteeing spatial manipulation is flagged when timelines break.</span>
                      </li>
                    </ul>
                  </div>
                )
              }
            ].map((m, index) => (
              <div key={m.title} className="glass-card p-6 sm:p-10 relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-15 pointer-events-none transition-opacity duration-700 group-hover:opacity-30">
                  <Canvas>
                    <ambientLight />
                    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
                      <Sphere args={[3.5, 32, 32]}>
                        <MeshDistortMaterial color="#7B61FF" distort={0.6} speed={2} wireframe />
                      </Sphere>
                    </Float>
                  </Canvas>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2">{m.title}</h3>
                  <p className="text-sm font-bold text-primary tracking-widest uppercase mb-6">{m.role}</p>
                  <div className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Dataset Creation Process */}
      <section className="section-wrapper">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Dataset Creation Process</h2>
          </div>
          <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { step: '1', title: 'Data Aggregation (17 Sources)', desc: 'Sourced hundreds of gigabytes of videos and images from 17 distinct, curated sources including FaceForensics++, Celeb-DF, and leading StyleGAN generators to ensure robust geographic and demographic diversity.' },
                { step: '2', title: 'MTCNN Face Extraction', desc: 'Used the MTCNN (Multi-task Cascaded Convolutional Network) architecture to accurately detect, crop, and align faces across all frames, perfectly standardized to remove arbitrary background noise.' },
                { step: '3', title: 'Absolute 50/50 Balancing', desc: 'Strictly downsampled the dominant classes across all 17 datasets to achieve exactly a 50/50 split (171,719 REAL, 171,719 FAKE), preventing the model from ever developing a structural class bias.' }
              ].map((s, i) => (
                <div key={s.step} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-black text-xl mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            {/* Soft decorative blur */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 dark:bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Dataset Stats */}
      <section className="section-wrapper">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Dataset Statistics</h2>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { value: '343K+', label: 'Total Images', sub: 'Perfectly balanced Real/Fake' },
                { value: '17', label: 'Data Sources', sub: 'Videos, GANs & diffusion models' },
                { value: '50/50', label: 'Class Balance', sub: '171,719 real + 171,719 fake' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                  <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{stat.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datasetSources} margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {datasetSources.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Model Performance Table */}
      <section className="section-wrapper">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Model Performance</h2>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Model', 'Accuracy', 'AUC', 'TTA Accuracy', 'Parameters'].map(header => (
                      <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modelPerformance.map((model, i) => (
                    <tr key={model.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">{model.name}</td>
                      <td className="px-6 py-4 text-sm font-mono text-primary-light dark:text-primary">{model.accuracy}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">{model.auc}</td>
                      <td className="px-6 py-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">{model.tta}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">{model.params}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Training Setup */}
      <section className="section-wrapper">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-6 h-6 text-primary-light dark:text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Training Setup</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Hardware', items: ['Kaggle T4*2 GPUs', '16GB VRAM', 'CUDA 11.8'] },
              { label: 'Augmentation', items: ['MixUp (α=0.2)', 'CutMix (α=1.0)', 'Random Erasing', 'Color Jitter'] },
              { label: 'Training Strategy', items: ['2-Phase Training', 'Cosine Annealing LR', 'Label Smoothing (0.1)', 'Early Stopping'] },
              { label: 'Optimization', items: ['AdamW Optimizer', 'Weight Decay 1e-4', 'Batch Size 32', 'Mixed Precision (FP16)'] },
            ].map(group => (
              <div key={group.label} className="glass-card p-6">
                <h3 className="text-sm font-semibold text-primary-light dark:text-primary uppercase tracking-wider mb-3">
                  {group.label}
                </h3>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li key={item} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  )
}
