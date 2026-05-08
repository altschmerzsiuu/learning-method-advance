// src/components/quiz/SoalCard.jsx
import { motion, AnimatePresence } from 'framer-motion';
import PilihanButton from './PilihanButton';
import { Info } from 'lucide-react';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:  (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.15 } }),
};

export default function SoalCard({
  soal,
  direction,
  selectedAnswer,
  isAnswered,
  onSelect,
}) {
  if (!soal) return null;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={soal.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {/* Context / Soal Cerita if any */}
        {soal.context && (
          <div className="bg-surface-muted border-l-4 border-primary-300 p-4 mb-4 rounded-r-md">
            <p className="font-sans text-[13px] text-ink leading-[1.65] whitespace-pre-line italic">
              {soal.context}
            </p>
          </div>
        )}

        {/* Question */}
        <div className="bg-surface-card border border-border rounded-lg p-5 mb-4">
          <p className="font-serif text-[16px] font-bold text-ink leading-[1.5]">
            {soal.pertanyaan}
          </p>
          <span className="inline-block mt-2 badge badge-active capitalize">
            {soal.tingkat}
          </span>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {(soal.shuffledOptions || []).map((optionText, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            return (
              <PilihanButton
                key={letter}
                pilihan={`${letter}. ${optionText}`}
                isSelected={selectedAnswer === letter}
                isAnswered={isAnswered}
                isCorrect={optionText === soal.correctText}
                onClick={() => onSelect(letter, optionText)}
              />
            );
          })}
        </div>

        {/* Explanation (shown after answer) */}
        <AnimatePresence>
          {isAnswered && soal.penjelasan && soal.penjelasan.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-info-light border border-info-border rounded-md p-4 flex gap-3"
            >
              <Info size={16} strokeWidth={1.5} className="text-info shrink-0 mt-0.5" />
              <p className="font-sans text-[13px] text-ink leading-[1.65]">{soal.penjelasan}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
