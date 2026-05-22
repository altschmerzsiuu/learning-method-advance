import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    targetKey: null,
    emoji: '👋',
    title: 'Selamat datang di explay!',
    desc: 'Platform belajar seru untuk siswa SMP yang mau jago teks eksposisi. Yuk, kenalan dulu sama semua fiturnya!',
  },
  {
    targetKey: 'nav',
    emoji: '🧭',
    title: 'Menu Navigasi',
    desc: 'Dari sini kamu bisa berpindah ke semua halaman — Beranda, Materi, Latihan, Games, dan Profil kamu.',
  },
  {
    targetKey: 'materi',
    emoji: '📖',
    title: 'Belajar Materi',
    desc: 'Mulai dari sini! Ada 6 topik materi teks eksposisi yang ringkas, lengkap, dan seru untuk dipelajari.',
  },
  {
    targetKey: 'latihan',
    emoji: '🎯',
    title: 'Latihan Soal',
    desc: 'Setelah belajar, uji kemampuanmu dengan 20 soal pilihan ganda. Ada timer 90 menit dan navigasi soal bebas!',
  },
  {
    targetKey: 'games',
    emoji: '🎮',
    title: 'Arena Games',
    desc: 'Bosen belajar? Refreshing dengan Think-Tac-Toe atau Susun Struktur sambil tetap belajar teks eksposisi!',
  },
  {
    targetKey: null,
    emoji: '💪',
    title: 'Kamu Siap Belajar!',
    desc: 'Semua fitur sudah kamu kenali. Kumpulkan XP, raih badge, dan jadilah yang terbaik!',
    isLast: true,
  },
];

/** Cari elemen dengan data-tour attribute, pilih yang visible di layar */
function getTourElement(key) {
  if (!key) return null;
  const els = document.querySelectorAll(`[data-tour="${key}"]`);
  for (const el of els) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 || rect.height > 0) return { el, rect };
  }
  return null;
}

export default function OnboardingTour({ onFinish }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState(null);
  const rafRef = useRef(null);

  // Listen to global event untuk memulai tour
  useEffect(() => {
    const handleStart = () => {
      setStep(0);
      setHighlightRect(null);
      setIsOpen(true);
    };
    window.addEventListener('explay:start-tour', handleStart);
    return () => window.removeEventListener('explay:start-tour', handleStart);
  }, []);

  // Update highlight rect saat step berubah
  useEffect(() => {
    if (!isOpen) return;
    const current = STEPS[step];
    if (!current.targetKey) {
      setHighlightRect(null);
      return;
    }
    // Sedikit delay agar animasi selesai dulu
    rafRef.current = setTimeout(() => {
      const result = getTourElement(current.targetKey);
      if (result) {
        result.el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        setTimeout(() => {
          const freshResult = getTourElement(current.targetKey);
          if (freshResult) setHighlightRect(freshResult.rect);
        }, 300);
      }
    }, 100);
    return () => clearTimeout(rafRef.current);
  }, [step, isOpen]);

  // Tambahkan class highlight aktif agar elemen target "nyala" dan terlihat jelas
  useEffect(() => {
    const oldHighlighted = document.querySelectorAll('.tour-highlighted-active');
    oldHighlighted.forEach(el => el.classList.remove('tour-highlighted-active'));

    if (!isOpen) return;

    const current = STEPS[step];
    if (current && current.targetKey) {
      const t = setTimeout(() => {
        const result = getTourElement(current.targetKey);
        if (result && result.el) {
          result.el.classList.add('tour-highlighted-active');
        }
      }, 400);
      return () => clearTimeout(t);
    }
  }, [step, isOpen]);

  // Bersihkan sisa class saat komponen unmount
  useEffect(() => {
    return () => {
      const oldHighlighted = document.querySelectorAll('.tour-highlighted-active');
      oldHighlighted.forEach(el => el.classList.remove('tour-highlighted-active'));
    };
  }, []);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleClose(true);
    }
  }, [step]);

  const handleClose = useCallback((finished = false) => {
    setIsOpen(false);
    setStep(0);
    setHighlightRect(null);
    if (onFinish) onFinish(finished);
  }, [onFinish]);

  if (!isOpen) return null;

  const current = STEPS[step];
  const PADDING = 6;

  // Hitung posisi tooltip berdasarkan letak highlight (responsif & adaptif)
  const tooltipPos = (() => {
    if (!highlightRect) {
      return {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        maxWidth: 440,
        width: 'calc(100vw - 32px)',
      };
    }
    
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const isBottom = highlightRect.top > window.innerHeight / 2;
      const top = isBottom ? highlightRect.top - PADDING - 12 : highlightRect.bottom + PADDING + 12;
      return {
        position: 'fixed',
        top,
        left: '50%',
        transform: isBottom ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
        maxWidth: 320,
        width: 'calc(100vw - 32px)',
      };
    } else {
      // Desktop: posisikan tooltip di sebelah kanan spotlight agar presisi dan tidak menghalangi
      return {
        position: 'fixed',
        top: Math.max(20, Math.min(highlightRect.top - PADDING, window.innerHeight - 260)),
        left: highlightRect.right + PADDING + 20,
        maxWidth: 340,
        width: '340px',
        transform: 'none',
      };
    }
  })();

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="tour-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`tour-overlay ${highlightRect ? 'tour-overlay--transparent' : ''}`}
        onClick={() => handleClose(false)}
      >
        {/* Spotlight highlight box */}
        {highlightRect && (
          <div
            className="tour-spotlight"
            style={{
              top: highlightRect.top - PADDING,
              left: highlightRect.left - PADDING,
              width: highlightRect.width + PADDING * 2,
              height: highlightRect.height + PADDING * 2,
            }}
            onClick={e => e.stopPropagation()}
          />
        )}

        {/* Tooltip */}
        <motion.div
          key={`tooltip-${step}`}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="tour-tooltip"
          style={tooltipPos}
          onClick={e => e.stopPropagation()}
        >
          {/* Tombol tutup */}
          <button
            className="tour-close-btn"
            onClick={() => handleClose(false)}
            title="Lewati Tour"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

          {/* Emoji + Judul */}
          <div className="text-3xl mb-2">{current.emoji}</div>
          <h3 className="tour-tooltip-title">{current.title}</h3>
          <p className="tour-tooltip-desc">{current.desc}</p>

          {/* Progress dots */}
          <div className="tour-dots">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`tour-dot ${i === step ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="tour-actions">
            <button className="tour-btn-skip" onClick={() => handleClose(false)}>
              Lewati
            </button>
            <button className="tour-btn-next" onClick={handleNext}>
              {current.isLast ? '🎉 Mulai Belajar!' : (
                <>Selanjutnya <ChevronRight size={14} strokeWidth={2.5} /></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
