import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';

const sheetVariants = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

const boxVariants = {
  shake:  { rotate: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  open:   { scale: [1, 1.2, 0], transition: { duration: 0.3, delay: 0.4 } },
  reveal: { scale: [0, 1.1, 1], transition: { duration: 0.3, delay: 0.7 } }
};

export default function MysteryBoxModal({ isOpen, reward, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
          />
          <motion.div 
            variants={sheetVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-card rounded-t-3xl p-6 z-50 flex flex-col items-center shadow-2xl"
          >
            <h3 className="font-serif font-black text-2xl text-ink mb-6">Mystery Box!</h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <motion.div variants={boxVariants} animate="open" className="absolute text-6xl">
                🎁
              </motion.div>
              {reward && (
                <motion.div variants={boxVariants} animate="reveal" className="absolute flex flex-col items-center">
                  <span className="text-5xl mb-2">{reward.type === 'skill' ? '✨' : '💀'}</span>
                  <p className="font-sans font-bold text-center text-ink text-lg">{reward.label}</p>
                </motion.div>
              )}
            </div>

            <Button fullWidth onClick={onClose} className="mt-4">
              Sip!
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
