import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Upload, X } from 'lucide-react'

export default function UploadZone({ file, disabled, onFileChange, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const selectFile = (candidate) => {
    if (!candidate) return
    const isPdf = candidate.type === 'application/pdf' || candidate.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      onFileChange(null, 'Please select a PDF file.')
      return
    }
    onFileChange(candidate)
  }

  const onDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    if (!disabled) selectFile(event.dataTransfer.files?.[0])
  }

  return (
    <motion.div
      layout
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className={`upload-zone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
      onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        id="pdf-upload"
        className="sr-only"
        type="file"
        accept=".pdf,application/pdf"
        disabled={disabled}
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
      <AnimatePresence mode="wait" initial={false}>
        {file ? (
          <motion.div key="selected" className="file-selected" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <span className="file-icon"><FileText aria-hidden="true" /></span>
            <div className="file-copy">
              <p title={file.name}>{file.name}</p>
              <span>Ready to generate audio</span>
            </div>
            <button className="icon-button" type="button" onClick={onClear} disabled={disabled} aria-label="Remove selected PDF">
              <X size={18} aria-hidden="true" />
            </button>
          </motion.div>
        ) : (
          <motion.label key="empty" htmlFor="pdf-upload" className="empty-upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <span className="upload-icon"><Upload aria-hidden="true" /></span>
            <span className="upload-title">Drop your PDF here</span>
            <span className="upload-subtitle">or click to browse</span>
            <span className="upload-note">One-page PDF only</span>
          </motion.label>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
