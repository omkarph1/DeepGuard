import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react'
import ModelCard from './ModelCard'
import RadarChart from './RadarChart'
import ConfidenceGauge from './ConfidenceGauge'

export default function ResultsPanel({ results, onReset }) {
  const isFake = results.verdict === 'FAKE'

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      
      const element = document.getElementById('results-panel')
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: '#0A0E1A',
        scale: 2,
        useCORS: true,
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const maxPdfHeight = pdf.internal.pageSize.getHeight()
      let pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      // If the content is taller than an A4 page, scale it down proportionally
      let imgWidth = pdfWidth
      let xOffset = 0
      
      if (pdfHeight > maxPdfHeight) {
        const ratio = maxPdfHeight / pdfHeight
        pdfHeight = maxPdfHeight
        imgWidth = pdfWidth * ratio
        xOffset = (pdfWidth - imgWidth) / 2 // Center horizontally
      }
      
      pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidth, pdfHeight)
      pdf.save(`deepguard-report-${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }

  return (
    <motion.div
      id="results-panel"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Verdict Header */}
      <div className="glass-card p-6 sm:p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          className="inline-flex items-center justify-center mb-4"
        >
          {isFake ? (
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          )}
        </motion.div>

        <h2 className={`text-3xl sm:text-4xl font-black mb-2 ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
          {results.verdict} {isFake ? '❌' : '✅'}
        </h2>
        <p className={`text-sm font-semibold uppercase tracking-wider mb-1
          ${results.confidence_tier === 'HIGH' ? 'text-amber-400' : 
            results.confidence_tier === 'MODERATE' ? 'text-orange-400' : 'text-slate-400'}`}
        >
          {results.confidence_tier} CONFIDENCE
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {results.filename} · {new Date(results.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Extracted Frames */}
      {results.frames && results.frames.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Extracted Faces ({results.faces_extracted} detected)
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {results.frames.map((frame, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={frame}
                  alt={`Face ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Model Cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Individual Model Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.models.map((model, index) => (
            <ModelCard key={model.name} model={model} index={index} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RadarChart models={results.models} />
        <ConfidenceGauge fakeProb={results.ensemble_fake_prob} />
      </div>

      {/* Confidence Breakdown Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Full Confidence Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Verdict</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fake %</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Real %</th>
              </tr>
            </thead>
            <tbody>
              {results.models.map((model) => (
                <tr key={model.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="px-6 py-3 text-sm font-medium text-slate-800 dark:text-white">{model.name} {model.version}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold ${model.label === 'FAKE' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {model.label}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-mono text-red-400">{(model.fake_prob * 100).toFixed(1)}%</td>
                  <td className="px-6 py-3 text-sm font-mono text-emerald-400">{(model.real_prob * 100).toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="bg-slate-50 dark:bg-slate-800/30">
                <td className="px-6 py-3 text-sm font-bold text-slate-800 dark:text-white">Ensemble Average</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-bold ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
                    {results.verdict}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-mono font-bold text-red-400">{(results.ensemble_fake_prob * 100).toFixed(1)}%</td>
                <td className="px-6 py-3 text-sm font-mono font-bold text-emerald-400">{(results.ensemble_real_prob * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadPDF}
          className="btn-glow inline-flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download PDF Report
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold
                    border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300
                    hover:border-primary hover:text-primary-light dark:hover:text-primary transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5" />
          Analyze Another Video
        </button>
      </div>
    </motion.div>
  )
}
