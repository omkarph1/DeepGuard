import { useState, useRef, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileVideo, X } from 'lucide-react'

export default function UploadZone({ onFileSelect, disabled }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  // Stable blob URL — only re-created when the file actually changes.
  // Without this, URL.createObjectURL() runs every render (60x/sec during
  // timer ticks) giving the <video> a new src each time and making it reload.
  const videoSrc = useMemo(() => {
    if (!selectedFile) return null
    const url = URL.createObjectURL(selectedFile)
    return url
  }, [selectedFile])

  // Revoke old object URL when file changes or component unmounts (memory cleanup)
  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc)
    }
  }, [videoSrc])

  const validTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']

  const handleFile = (file) => {
    if (!file) return
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv)$/i)) {
      alert('Please upload a video file (.mp4, .avi, .mov, .mkv)')
      return
    }
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !disabled && inputRef.current?.click()}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center cursor-pointer
                     transition-all duration-300
                     ${dragOver
                       ? 'border-primary bg-primary/5 dark:bg-primary/10'
                       : 'border-slate-300 dark:border-slate-600 hover:border-primary/50 dark:hover:border-primary/50'
                     }
                     ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {/* Scanning line effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent 
                            ${dragOver ? 'animate-scan' : 'opacity-0'}`} />
          </div>

          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            {dragOver ? 'Drop your video here' : 'Drag & drop your video'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            or click to browse files
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Supports MP4, AVI, MOV, MKV
          </p>
          
          <input
            ref={inputRef}
            type="file"
            accept=".mp4,.avi,.mov,.mkv,video/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
            disabled={disabled}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 glass-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
              <FileVideo className="w-6 h-6 text-primary-light dark:text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatSize(selectedFile.size)}
              </p>
            </div>
            {!disabled && (
              <button
                onClick={clearFile}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Video Preview */}
          <div className="mt-6 rounded-xl overflow-hidden bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-700">
            <video 
              src={videoSrc} 
              controls 
              className="w-full max-h-64 object-contain"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
