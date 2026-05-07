import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ConfirmModal({ 
  isOpen, 
  title = "Konfirmasi", 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Ya, Keluar", 
  cancelText = "Batal",
  variant = "danger"
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xs bg-white rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${
                variant === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-primary-50 text-primary-500'
              }`}>
                <AlertCircle size={24} />
              </div>
              
              <h3 className="font-serif font-black text-lg text-ink mb-2">{title}</h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-6">
                {message}
              </p>
              
              <div className="flex flex-col gap-2 w-full">
                <Button 
                  variant={variant} 
                  fullWidth 
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
