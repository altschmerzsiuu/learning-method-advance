// src/screens/MateriScreen.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, TopBar, Badge, Button } from '../components/ui';
import KontenRenderer from '../components/materi/KontenRenderer';
import { useProgress } from '../hooks/useProgress';
import materiData from '../data/materi.json';
import { ChevronRight } from 'lucide-react';

export default function MateriDetailScreen() {
  const { topikId }           = useParams();
  const navigate              = useNavigate();
  const { getTopikStatus, completeTopik } = useProgress();
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const contentRef = useRef(null);

  const topik  = materiData.find(m => m.id === topikId);
  const status = getTopikStatus(topikId);

  // Detect if user has scrolled 80% of content
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el   = contentRef.current;
      const scrollPct = (window.scrollY + window.innerHeight) / (el.offsetTop + el.scrollHeight);
      setShowStickyBtn(scrollPct >= 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!topik) {
    return (
      <PageWrapper>
        <TopBar showBack backPath="/materi" title="Materi" />
        <div className="p-4 text-center pt-16">
          <p className="font-serif text-[18px] font-bold text-ink">Topik tidak ditemukan.</p>
        </div>
      </PageWrapper>
    );
  }

  if (status === 'locked') {
    return (
      <PageWrapper>
        <TopBar showBack backPath="/materi" title={topik.judul} />
        <div className="p-4 pt-16 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface-muted flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-faint">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p className="font-serif text-[18px] font-bold text-ink">Topik ini masih terkunci</p>
          <p className="font-sans text-[13px] text-ink-muted">Selesaikan topik sebelumnya terlebih dahulu.</p>
          <Button variant="ghost" onClick={() => navigate('/materi')}>Kembali ke Materi</Button>
        </div>
      </PageWrapper>
    );
  }

  const handleLanjutQuiz = () => {
    completeTopik(topikId, topik.xp_reward);
    navigate(`/materi/${topikId}/quiz`);
  };

  return (
    <PageWrapper>
      <TopBar
        showBack
        backPath="/materi"
        title={topik.judul}
        rightContent={<Badge variant={status === 'done' ? 'done' : 'active'}>{status === 'done' ? 'Selesai' : 'Aktif'}</Badge>}
      />

      <div ref={contentRef} className="px-4 pb-36 pt-5">
        {/* Hero header */}
        <div className="mb-6">
          <p className="font-sans text-[11px] font-bold text-ink-muted uppercase tracking-[0.08em] mb-1">
            Topik {topik.urutan} dari {materiData.length}
          </p>
          <h1 className="font-serif text-[26px] font-black italic text-ink leading-[1.2] mb-2">
            {topik.judul}
          </h1>
          <p className="font-sans text-[13px] text-ink-muted leading-[1.65]">{topik.deskripsi}</p>
        </div>

        {/* Content */}
        <KontenRenderer konten={topik.konten} />
      </div>

      {/* Sticky CTA bottom */}
      <AnimatePresence>
        {showStickyBtn && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-card border-t border-border p-4 z-40"
          >
            <Button fullWidth onClick={handleLanjutQuiz}>
              <span>Lanjut ke Quiz</span>
              <ChevronRight size={18} strokeWidth={2} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
