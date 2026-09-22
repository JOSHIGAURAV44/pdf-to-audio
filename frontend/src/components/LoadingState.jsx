import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

export default function LoadingState() {
  return (
    <motion.div className="status-panel loading-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <LoaderCircle className="spinner" aria-hidden="true" />
      <div>
        <p>Creating your audio...</p>
        <span>Extracting text and generating speech</span>
      </div>
    </motion.div>
  )
}
