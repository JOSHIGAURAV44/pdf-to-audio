import { motion } from 'framer-motion'
import { Check, Download, FileAudio } from 'lucide-react'

function outputName(fileName) {
  return `${fileName.replace(/\.pdf$/i, '') || 'audio'}.wav`
}

export default function AudioResult({ audioUrl, sourceFile, onStartOver }) {
  const downloadName = outputName(sourceFile.name)
  return (
    <motion.section className="audio-result" aria-live="polite" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="result-heading"><span><Check size={15} strokeWidth={3} aria-hidden="true" /></span><p>Your audio is ready.</p></div>
      <div className="audio-card">
        <div className="audio-file"><span className="file-icon"><FileAudio aria-hidden="true" /></span><p title={downloadName}>{downloadName}</p></div>
        <audio controls src={audioUrl} preload="metadata" aria-label={`Audio for ${sourceFile.name}`} />
        <div className="audio-actions">
          <a className="download-button" href={audioUrl} download={downloadName}><Download size={17} aria-hidden="true" /> Download audio</a>
          <button className="text-button" type="button" onClick={onStartOver}>Use another PDF</button>
        </div>
      </div>
    </motion.section>
  )
}
