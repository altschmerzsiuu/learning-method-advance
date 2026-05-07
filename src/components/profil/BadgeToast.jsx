import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Global event emitter for badges
export const badgeEmitter = new EventTarget();

export function triggerBadgeToast(badge) {
  const event = new CustomEvent('new_badge', { detail: badge });
  badgeEmitter.dispatchEvent(event);
}

export default function BadgeToast() {
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    const handleNewBadge = (e) => {
      setBadge(e.detail);
      setTimeout(() => setBadge(null), 3000);
    };

    badgeEmitter.addEventListener('new_badge', handleNewBadge);
    return () => badgeEmitter.removeEventListener('new_badge', handleNewBadge);
  }, []);

  return (
    <AnimatePresence>
      {badge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1.1, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="bg-accent text-ink px-6 py-4 rounded-2xl border-4 border-accent-border shadow-2xl flex flex-col items-center gap-2 max-w-[280px] text-center"
          >
            <div className="text-5xl">{badge.icon || '🏆'}</div>
            <div>
              <p className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">Badge Baru!</p>
              <h3 className="font-serif font-black text-xl leading-tight">{badge.nama}</h3>
              <p className="font-sans text-sm opacity-90 mt-1">{badge.deskripsi}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
