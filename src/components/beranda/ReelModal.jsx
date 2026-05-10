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
            src={reel.videoUrl || `/reels/${reel.id}.mp4`}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-auto border border-white/10">
              <h3 className="text-white font-sans font-bold text-[11px]">{reel.judul}</h3>
            </div>
          </div>

          {/* Tombol Sumber TikTok */}
          {reel.sourceUrl && (
            <a 
              href={reel.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 transition-all active:scale-95 group"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="group-hover:animate-bounce">
                <path d="M12.525.02c1.31-.036 2.612.012 3.914.012.041 2.456 1.587 4.731 3.978 5.607a.24.24 0 0 1 .15.225c-.017 1.288-.004 2.575-.004 3.863-.005.082-.033.166-.122.188-2.036-.13-4.011-.92-5.472-2.392V18.15c.01 5.35-6.19 8.657-10.457 5.422-4.267-3.235-2.715-10.231 2.612-11.233.155-.029.317-.037.472-.037 1.341.01 2.682-.01 4.022.01.033 0 .067.006.1.013.067.014.12.051.134.119.014.068.01.14-.022.196-.032.055-.084.095-.145.109-.153.033-.309.043-.464.043-3.111.01-5.116 3.195-4.046 6.075 1.07 2.879 5.093 3.655 7.11 1.488.948-.992 1.303-2.38 1.258-3.733V.02Z"/>
              </svg>
              <span className="text-white font-sans text-[11px] font-bold">Lihat Sumber</span>
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
