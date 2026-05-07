import { motion } from 'framer-motion';

const symbolVariants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } }
};

export default function GameCell({ idx, value, isWinner, onClick, isMysteryBox, isTargetMode, activeSkill }) {
  let bgClass = 'bg-surface-muted';
  let borderClass = 'border-border';
  let content = null;

  if (value === 'X') {
    bgClass = 'bg-primary-50';
    borderClass = 'border-primary-200';
    content = <motion.span variants={symbolVariants} initial="hidden" animate="visible" className="text-primary-300 font-serif font-black text-4xl">X</motion.span>;
  } else if (value === 'O') {
    bgClass = 'bg-rose-50';
    borderClass = 'border-rose-200';
    content = <motion.span variants={symbolVariants} initial="hidden" animate="visible" className="text-rose-500 font-serif font-black text-4xl">O</motion.span>;
  } else if (isMysteryBox) {
    bgClass = 'bg-accent-light/50';
    borderClass = 'border-accent-border/50';
    content = <span className="opacity-50 text-2xl">🎁</span>;
  }

  if (isWinner) {
    borderClass = 'border-primary-300 animate-pulse';
  }

  let targetProps = {};
  if (isTargetMode) {
    // If erase, can select opponent's cells
    if ((activeSkill === 'erase' || activeSkill === 'steal') && value && value !== 'X') { // Assuming 'X' is always the current player triggering skill? Wait, what if currentTurn is O?
      borderClass = 'border-warning-500 animate-pulse';
      targetProps = { onClick: () => onClick(idx), className: 'cursor-pointer' };
    } else {
      bgClass += ' opacity-50 cursor-not-allowed';
    }
  }

  return (
    <div
      onClick={() => { if (!isTargetMode) onClick(idx); else if (targetProps.onClick) targetProps.onClick(); }}
      className={`relative w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-colors ${bgClass} ${borderClass} ${!isTargetMode && !value ? 'hover:bg-primary-50/50 cursor-pointer' : ''} ${targetProps.className || ''}`}
    >
      {content}
    </div>
  );
}
