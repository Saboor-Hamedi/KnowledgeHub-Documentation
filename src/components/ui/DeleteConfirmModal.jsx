import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to delete this? This action cannot be undone." }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        >
            <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 p-3 bg-red-50 text-red-500 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
                        <p className="text-xs text-red-500 font-medium mt-0.5">This action is irreversible</p>
                    </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-6 leading-relaxed pl-1">
                    {message}
                </p>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
