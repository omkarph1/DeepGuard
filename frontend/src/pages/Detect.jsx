import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import ProgressTerminal from '../components/ProgressTerminal'
import ProgressBar from '../components/ProgressBar'
import { dummyResults } from '../data/dummyResults'

const ResultsPanel = lazy(() => import('../components/ResultsPanel'))

const DEMO_MODE = false // Set to false when backend is connected
const API_URL = import.meta.env.VITE_API_URL || 'https://omkarpp-deepguard-backend.hf.space';

export default function Detect() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [logs, setLogs] = useState([])
  const [results, setResults] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const startTimeRef = useRef(null)

  // Stable 1-second interval timer — no jitter, no frame-rate dependency
  useEffect(() => {
    if (!analyzing) return
    startTimeRef.current = Date.now()
    setElapsedTime(0)
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [analyzing])

  const addLog = useCallback((log) => {
    setLogs(prev => [...prev, log])
  }, [])

  // Demo mode: simulate analysis with dummy data
  const runDemoAnalysis = useCallback(async () => {
    setAnalyzing(true)
    setCurrentStage(0)
    setLogs([])
    setResults(null)
    setElapsedTime(0)

    const demoLogs = dummyResults.logs
    const stageTimings = [
      { stage: 0, delay: 300 },
      { stage: 1, delay: 800 },
      { stage: 2, delay: 600 },
      { stage: 3, delay: 600 },
      { stage: 4, delay: 500 },
    ]

    let logIndex = 0
    
    for (const timing of stageTimings) {
      setCurrentStage(timing.stage)
      
      // Add 2-3 logs per stage
      const logsPerStage = timing.stage === 4 ? 2 : 3
      for (let j = 0; j < logsPerStage && logIndex < demoLogs.length; j++) {
        await new Promise(r => setTimeout(r, timing.delay))
        addLog(demoLogs[logIndex])
        logIndex++
      }
    }

    // Show remaining logs
    while (logIndex < demoLogs.length) {
      await new Promise(r => setTimeout(r, 200))
      addLog(demoLogs[logIndex])
      logIndex++
    }

    await new Promise(r => setTimeout(r, 500))
    setResults(dummyResults)
    setAnalyzing(false)
  }, [addLog])

  // Real mode: connect to backend SSE
  const runRealAnalysis = useCallback(async () => {
    if (!file) return
    setAnalyzing(true)
    setCurrentStage(0)
    setLogs([])
    setResults(null)
    setElapsedTime(0)

    try {
      const formData = new FormData()
      formData.append('video', file)

      const response = await fetch(`${API_URL}/api/detect`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'stage') {
                setCurrentStage(data.stage)
              } else if (data.type === 'log') {
                addLog(data.message)
              } else if (data.type === 'final_result') {
                setResults(data.result)
                setAnalyzing(false)
              } else if (data.type === 'error') {
                addLog(`Error: ${data.message}`)
                setAnalyzing(false)
              }
            } catch (e) {
              // Skip non-JSON lines
            }
          }
        }
      }
    } catch (err) {
      addLog(`Error: ${err.message}`)
      setAnalyzing(false)
    }
  }, [file, addLog])

  const handleAnalyze = () => {
    if (DEMO_MODE) {
      runDemoAnalysis()
    } else {
      runRealAnalysis()
    }
  }

  const handleReset = () => {
    setFile(null)
    setAnalyzing(false)
    setCurrentStage(-1)
    setLogs([])
    setResults(null)
    setElapsedTime(0)
    startTimeRef.current = null
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
                         bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <Shield className="w-4 h-4 text-primary-light dark:text-primary" />
            <span className="text-sm font-medium text-primary-light dark:text-primary">Deepfake Detection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-3">
            Analyze Your <span className="gradient-text">Video</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Upload a video and our 3-model ensemble — trained on 343K+ images from 10+ curated types — will determine if it contains deepfake manipulation.
          </p>
        </motion.div>

        {/* Upload Zone */}
        {!results && (
          <div className="space-y-6 mb-8">
            <UploadZone onFileSelect={setFile} disabled={analyzing} />
            
            {/* Analyze Button — shown before AND during analysis */}
            {(file || DEMO_MODE) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <button
                  onClick={!analyzing ? handleAnalyze : undefined}
                  disabled={analyzing}
                  className={`btn-glow inline-flex items-center gap-3 transition-all ${
                    analyzing ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {analyzing ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      <span className="tabular-nums">
                        Analyzing...&nbsp;
                        {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                      </span>
                    </>
                  ) : (
                    DEMO_MODE ? '🎮 Run Demo Analysis' : '🔍 Run Video Analysis'
                  )}
                </button>
                {DEMO_MODE && !analyzing && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Demo mode — uses simulated data. Connect backend for real analysis.
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Progress Section */}
        {(analyzing || logs.length > 0) && !results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-8"
          >
            <div className="flex justify-between items-center mb-2 px-2">
               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Analysis Progress / Real-Time Logs</h3>
            </div>
            <ProgressBar currentStage={currentStage} />
            <ProgressTerminal logs={logs} />
          </motion.div>
        )}

        {/* Results Panel */}
        {results && (
          <Suspense
            fallback={
              <div className="glass-card p-6 text-center text-slate-600 dark:text-slate-300">
                Loading analysis results...
              </div>
            }
          >
            <ResultsPanel results={results} onReset={handleReset} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
