// src/screens/HasilQuizScreen.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { PageWrapper, Button, TopBar } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { supabase } from '../lib/supabase';
import { checkAndAwardBadges, triggerBadgeToast } from '../lib/badgeChecker';

export default function HasilQuizScreen() {
  const { topikId } = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();
  const { user } = useAuth();
  const { completeTopik } = useProgress();

  const { score = 0, total = 5, scorePercent = 0 } = location.state ?? {};
  const xpEarned = Math.round(scorePercent * 0.8); // max 80 XP for perfect

  // Fire confetti on great score and award XP
  useEffect(() => {
    if (!user) return;

    const processResults = async () => {
      // 1. Mark as done and unlock next topic
      await completeTopik(topikId);

      // 2. Update Profile XP (Now in user_streak table)
      const { data: streakData } = await supabase.from('user_streak').select('total_xp').eq('user_id', user.id).single();
      if (streakData) {
        await supabase.from('user_streak').update({ total_xp: streakData.total_xp + xpEarned }).eq('user_id', user.id);
      }
      
      // 2. Check and Award Badges
      const newBadges = await checkAndAwardBadges(user.id, { type: 'quiz_done', value: 1 });
      if (scorePercent === 100) {
        const perfBadges = await checkAndAwardBadges(user.id, { type: 'score', value: 100 });
        newBadges.push(...perfBadges);
      }
      
      // Also check topics_done if we want
      
      newBadges.forEach(b => triggerBadgeToast(b));
    };

    processResults();

    if (scorePercent >= 80) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#70D6FF', '#FF70A6', '#FFD670', '#FFFFFF'],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessage = () => {
    if (scorePercent >= 80) return 'Luar biasa! Kamu sangat menguasai materi ini.';
    if (scorePercent >= 60) return 'Bagus! Terus tingkatkan lagi ya.';
    return 'Jangan menyerah. Pelajari kembali materinya dan coba lagi!';
  };

  return (
    <PageWrapper withNav>
      <TopBar title="Hasil Kuis" showBack backPath="/materi" />
      <div className="min-h-[calc(100dvh-56px)] flex flex-col items-center justify-center px-4 pb-10">

        {/* Score Circle */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 mb-6 ${
            scorePercent >= 80 ? 'border-primary-300 bg-primary-50' :
            scorePercent >= 60 ? 'border-accent bg-accent-light' :
            'border-danger bg-red-50'
          }`}
        >
          <span className="font-serif text-[40px] font-black text-ink leading-none">{scorePercent}</span>
          <span className="font-sans text-[11px] text-ink-muted font-medium">poin</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center mb-6"
        >
          <h1 className="font-serif text-[24px] font-black italic text-ink mb-2">
            {scorePercent >= 80 ? 'Sempurna!' : scorePercent >= 60 ? 'Hampir!' : 'Yuk, coba lagi!'}
          </h1>
          <p className="font-sans text-[13px] text-ink-muted leading-[1.65] max-w-[280px]">{getMessage()}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full flex gap-3 mb-6"
        >
          <div className="flex-1 bg-primary-50 border border-primary-200 rounded-md p-3 text-center">
            <CheckCircle2 size={20} strokeWidth={1.5} className="mx-auto text-primary-300 mb-1" />
            <p className="font-serif text-[22px] font-black text-ink">{score}</p>
            <p className="font-sans text-[11px] text-ink-muted">Benar</p>
          </div>
          <div className="flex-1 bg-red-50 border border-red-100 rounded-md p-3 text-center">
            <XCircle size={20} strokeWidth={1.5} className="mx-auto text-danger mb-1" />
            <p className="font-serif text-[22px] font-black text-ink">{total - score}</p>
            <p className="font-sans text-[11px] text-ink-muted">Salah</p>
          </div>
          <div className="flex-1 bg-accent-light border border-accent-border rounded-md p-3 text-center">
            <Zap size={20} strokeWidth={1.5} className="mx-auto text-accent mb-1" />
            <p className="font-serif text-[22px] font-black text-ink">+{xpEarned}</p>
            <p className="font-sans text-[11px] text-ink-muted">XP</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full flex flex-col gap-2.5"
        >
          <Button fullWidth onClick={() => navigate('/materi')}>
            <span>Lanjut Belajar</span>
            <ChevronRight size={18} strokeWidth={2} />
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate(`/materi/${topikId}/quiz`)}>
            <RotateCcw size={16} strokeWidth={1.5} />
            <span>Ulangi Quiz</span>
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
