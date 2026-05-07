import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ReelModal({ isOpen, onClose, reel }) {
  if (!isOpen || !reel) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-[101]"
        >
          <X size={24} />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl overflow-hidden relative"
        >
          <video
            src={`/reels/${reel.id}.mp4`}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-4 left-4 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <h3 className="text-white font-sans font-bold text-xs">{reel.judul}</h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
