import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PageWrapper, TopBar, Card, Button } from '../components/ui';
import { CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { checkAndAwardBadges, triggerBadgeToast } from '../lib/badgeChecker';
import { supabase } from '../lib/supabase';

export default function HasilLatihanScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { score, correctCount, total, xp } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate('/latihan', { replace: true });
      return;
    }

    if (score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#70D6FF', '#FF70A6', '#FFD670', '#FFFFFF']
      });
    }

    const awardAndCheck = async () => {
      if (!user) return;
      
      // Update XP (Now in user_streak table)
      const { data: streakData } = await supabase.from('user_streak').select('total_xp').eq('user_id', user.id).single();
      if (streakData) {
        await supabase.from('user_streak').update({ total_xp: streakData.total_xp + xp }).eq('user_id', user.id);
      }

      // Check badges
      const newBadges = await checkAndAwardBadges(user.id, { type: 'quiz_done', value: 1 }); // Just counting completion
      if (score === 100) {
        const perfBadges = await checkAndAwardBadges(user.id, { type: 'score', value: 100 });
        newBadges.push(...perfBadges);
      }
      
      newBadges.forEach(b => triggerBadgeToast(b));
    };

    awardAndCheck();
  }, [location.state, navigate, score, user, xp]);

  if (!location.state) return null;

  return (
    <PageWrapper>
      <TopBar title="Hasil Latihan" />
      
      <div className="container py-8 flex flex-col items-center">
        
        <div className="w-full max-w-[280px] mb-8 text-center relative">
          {score >= 80 ? (
            <div className="w-24 h-24 bg-primary-50 rounded-full border-4 border-primary-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} className="text-primary-300" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-rose-50 rounded-full border-4 border-rose-200 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={48} className="text-rose-500" />
            </div>
          )}
          
          <h1 className="font-serif font-black text-4xl text-ink">
            {score}
          </h1>
          <p className="font-sans text-ink-muted">Skor Akhir</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <Card className="text-center bg-surface-card flex flex-col justify-center items-center py-4">
            <span className="text-2xl mb-1">🎯</span>
            <p className="font-sans text-xs text-ink-muted uppercase tracking-wider font-bold mb-1">Benar</p>
            <p className="font-serif font-bold text-2xl text-ink">{correctCount}/{total}</p>
          </Card>
          
          <Card className="text-center bg-accent-light border-accent-border flex flex-col justify-center items-center py-4">
            <Zap size={24} className="text-accent mb-1" />
            <p className="font-sans text-xs text-ink-muted uppercase tracking-wider font-bold mb-1">XP Diperoleh</p>
            <p className="font-serif font-bold text-2xl text-accent">+{xp}</p>
          </Card>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button fullWidth onClick={() => navigate('/latihan/soal', { replace: true })}>
            Latihan Lagi
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate('/latihan', { replace: true })}>
            Kembali ke Menu
          </Button>
        </div>

      </div>
    </PageWrapper>
  );
}
