// src/components/ui/PageWrapper.jsx
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

export default function PageWrapper({ children, className = '', bottomNav = false }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-dvh flex flex-col bg-[#F8FAFC]" // Background luar abu-abu tipis biar estetik
    >
      {/* Konten dikunci ukuran HP (430px) dan ditaruh di tengah */}
      <div className="w-full max-w-[430px] mx-auto min-h-dvh bg-white flex flex-col shadow-sm relative">
        <main className={`flex-1 flex flex-col ${className}`}>
          {children}
        </main>
        
        {bottomNav && <BottomNav />}
      </div>
    </motion.div>
  );
}