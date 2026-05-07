import { motion, AnimatePresence } from 'framer-motion';

const sheetVariants = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

export default function SoalModal({ isOpen, soal, onAnswer }) {
  if (!soal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            variants={sheetVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-card rounded-t-3xl p-6 z-50 flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
            
            {soal.context && (
              <div className="bg-surface-muted p-4 rounded-xl mb-4 border-l-4 border-primary-400">
                <p className="font-sans text-sm italic text-ink-muted leading-relaxed">
                  {soal.context}
                </p>
              </div>
            )}
            
            <h3 className="font-serif font-bold text-lg text-ink mb-6 leading-snug">
              {soal.pertanyaan}
            </h3>
            
            <div className="flex flex-col gap-3">
              {soal.shuffledOptions?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(opt === soal.correctText)}
                  className="text-left w-full p-4 rounded-xl border border-border bg-surface-card hover:bg-primary-50 hover:border-primary-200 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center font-bold text-ink-muted shrink-0">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-sans text-sm text-ink">{opt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
