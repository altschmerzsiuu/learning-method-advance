import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toastEmitter } from '../../lib/toast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      const newToast = { id, ...e.detail };
      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    toastEmitter.addEventListener('toast', handleToast);
    return () => toastEmitter.removeEventListener('toast', handleToast);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-[90%] sm:max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-lg border
              ${t.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 
                t.type === 'error' ? 'bg-danger/10 border-danger/20 text-danger' : 
                'bg-primary-50 border-primary-200 text-primary-500'}
              bg-white backdrop-blur-md
            `}
          >
            {t.type === 'success' && <CheckCircle2 size={20} />}
            {t.type === 'error' && <AlertCircle size={20} />}
            {t.type === 'info' && <Info size={20} />}
            
            <p className="flex-1 text-sm font-bold font-sans">{t.message}</p>
            
            <button 
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
