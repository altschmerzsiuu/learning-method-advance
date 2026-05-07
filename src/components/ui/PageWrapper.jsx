// src/components/ui/PageWrapper.jsx
import { motion } from 'framer-motion';

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

/**
 * PageWrapper — Wraps every screen with page transition animation.
 * Usage: wrap the return JSX of each screen with <PageWrapper>
 */
import BottomNav from './BottomNav';

export default function PageWrapper({ children, className = '', bottomNav = false }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-dvh flex flex-col ${className}`}
    >
      <main className="flex-1">
        {children}
      </main>
      {bottomNav && <BottomNav />}
    </motion.div>
  );
}
