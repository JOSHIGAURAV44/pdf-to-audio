import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileAudio, Sparkles } from 'lucide-react'
import UploadZone from './components/UploadZone'
import LoadingState from './components/LoadingState'
import ErrorMessage from './components/ErrorMessage'
import AudioResult from './components/AudioResult'
import { generateAudio } from './services/api'

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState('')
  const audioUrlRef = useRef(null)

  const clearAudio = () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    audioUrlRef.current = null
    setAudioUrl(null)
  }

  useEffect(() => () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
  }, [])

  const handleFileChange = (file, validationError = '') => {
    clearAudio()
    setError(validationError)
    setSelectedFile(file)
  }

  const reset = () => {
    clearAudio()
    setSelectedFile(null)
    setError('')
  }

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Choose a PDF before generating audio.')
      return
    }
    if (!(selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf'))) {
      setError('Please select a PDF file.')
      return
    }

    setLoading(true)
    setError('')
    clearAudio()
    try {
      const blob = await generateAudio(selectedFile)
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url
      setAudioUrl(url)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <motion.div className="orb orb-one" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.section className="content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
        <div className="brand-mark" aria-hidden="true"><FileAudio size={19} /><span></span><Sparkles size={14} /></div>
        <p className="eyebrow">PDF <span>→</span> AUDIO</p>
        <h1>Turn your PDF into<br /><em>audio.</em></h1>
        <p className="intro">Upload a one-page PDF and listen to it anywhere.</p>

        {!audioUrl && <UploadZone file={selectedFile} disabled={loading} onFileChange={handleFileChange} onClear={reset} />}

        {!audioUrl && selectedFile && !loading && !error && (
          <motion.button className="generate-button" type="button" onClick={handleGenerate} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
            Generate audio <span>→</span>
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {loading && <LoadingState key="loading" />}
          {!loading && error && <ErrorMessage key="error" message={error} onRetry={reset} />}
          {!loading && audioUrl && <AudioResult key="result" audioUrl={audioUrl} sourceFile={selectedFile} onStartOver={reset} />}
        </AnimatePresence>
        {!selectedFile && !error && !audioUrl && <p className="privacy-note">Your document is processed securely by your audio service.</p>}
      </motion.section>
    </main>
  )
}
