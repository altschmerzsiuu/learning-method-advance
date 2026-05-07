// src/components/quiz/PilihanButton.jsx
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PilihanButton({ pilihan, isSelected, isAnswered, isCorrect, onClick }) {
  const letter = pilihan.charAt(0); // 'A', 'B', 'C', 'D'

  let stateClass = 'border-border bg-surface-card hover:border-primary-300';
  let letterClass = 'bg-surface-muted text-ink-muted';

  if (isAnswered) {
    if (isCorrect) {
      stateClass  = 'border-primary-300 bg-primary-50';
      letterClass = 'bg-primary-300 text-white';
    } else if (isSelected && !isCorrect) {
      stateClass  = 'border-danger bg-red-50';
      letterClass = 'bg-danger text-white';
    }
  } else if (isSelected) {
    stateClass  = 'border-primary-300 bg-primary-50';
    letterClass = 'bg-primary-300 text-white';
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={isAnswered}
      className={`w-full flex items-center gap-3 p-3.5 rounded-md border transition-all text-left ${stateClass}`}
      whileTap={!isAnswered ? { scale: 0.98 } : {}}
      animate={isAnswered && isSelected && !isCorrect ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.35 }}
    >
      <span className={`w-7 h-7 rounded-md flex items-center justify-center font-sans text-[12px] font-bold shrink-0 transition-all ${letterClass}`}>
        {letter}
      </span>
      <span className="font-sans text-[13px] text-ink leading-[1.55] flex-1">
        {pilihan.slice(3)} {/* strip "A. " */}
      </span>
      {isAnswered && isCorrect && (
        <CheckCircle2 size={18} strokeWidth={2} className="text-primary-300 shrink-0" />
      )}
      {isAnswered && isSelected && !isCorrect && (
        <XCircle size={18} strokeWidth={2} className="text-danger shrink-0" />
      )}
    </motion.button>
  );
}
