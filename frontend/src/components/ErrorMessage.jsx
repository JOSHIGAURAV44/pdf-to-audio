import { motion } from 'framer-motion'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.section className="status-panel error-panel" role="alert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <AlertCircle aria-hidden="true" />
      <div>
        <p>Something went wrong.</p>
        <span>{message}</span>
      </div>
      <button type="button" className="text-button" onClick={onRetry}>
        <RefreshCcw size={15} aria-hidden="true" /> Try another PDF
      </button>
    </motion.section>
  )
}
