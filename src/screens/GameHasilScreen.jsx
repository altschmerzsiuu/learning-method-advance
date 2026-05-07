import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui';
import { supabase } from '../lib/supabase';
import { checkAndAwardBadges, triggerBadgeToast } from '../lib/badgeChecker';

function hitungXP(mode, result, difficulty) {
  if (mode === 'team') {
    return result === 'menang' ? 80 : result === 'seri' ? 30 : 0;
  }
  const table = {
    mudah: { menang: 60,  seri: 20, kalah: 5  },
    susah: { menang: 100, seri: 40, kalah: 10 },
  };
  return table[difficulty][result];
}

export default function GameHasilScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { winner, teamX, teamO, mode, difficulty } = location.state || {};
  
  const [xp, setXp] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [randomVideo] = useState(() => {
    const videos = ['v1.mp4', 'v2.mp4', 'v3.mp4'];
    return videos[Math.floor(Math.random() * videos.length)];
  });

  useEffect(() => {
    if (!location.state) {
      navigate('/latihan', { replace: true });
      return;
    }

    let resultStr = 'seri';
    if (winner === 'X') resultStr = 'menang';
    if (mode === 'solo' && winner === 'O') resultStr = 'kalah';
    if (mode === 'team' && winner === 'O') resultStr = 'menang'; // Tim O menang

    const earnedXp = hitungXP(mode, resultStr === 'kalah' ? 'kalah' : winner === 'draw' ? 'seri' : 'menang', difficulty);
    setXp(earnedXp);

    if (winner && winner !== 'draw') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#FB923C', '#38BDF8']
      });
    }

    // Save to supabase (simplistic approach for both modes, saving under user's id)
    const saveResult = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Assume duel_results or game_history table
        await supabase.from('game_history').insert({
          user_id: session.user.id,
          difficulty: mode === 'solo' ? difficulty : 'team',
          result: resultStr,
          xp_earned: earnedXp
        });
        
        // Update user XP
        const { data: profile } = await supabase.from('profiles').select('total_xp').eq('id', session.user.id).single();
        if (profile) {
          await supabase.from('profiles').update({ total_xp: profile.total_xp + earnedXp }).eq('id', session.user.id);
        }

        // Badges check
        if (resultStr === 'menang') {
          const newBadges = await checkAndAwardBadges(session.user.id, { type: 'game_win', value: 1 });
          newBadges.forEach(b => triggerBadgeToast(b));
        }
      }
    };
    saveResult();
  }, [location.state, navigate, winner, mode, difficulty]);

  if (!location.state) return null;

  let title = '';
  let color = 'text-ink';
  
  if (winner === 'draw') {
    title = '🤝 Seri!';
    color = 'text-amber-500';
  } else if (mode === 'solo') {
    if (winner === 'X') {
      title = `🏆 ${teamX} Menang!`;
      color = 'text-success-500';
    } else {
      title = '💪 Jangan Menyerah!';
    }
  } else {
    title = `🏆 Tim ${winner} Menang!`;
    color = winner === 'X' ? 'text-primary-300' : 'text-rose-500';
  }

  const isWin = winner && winner !== 'draw';

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-surface-card relative overflow-hidden">
      
      <div className="w-full max-w-sm flex flex-col items-center gap-6 z-10">
        
        <h1 className={`font-serif font-black italic text-4xl text-center ${color} mb-2`}>
          {title}
        </h1>

        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-none-none border-4 border-surface-muted relative">
          {isWin ? (
            <video
              src={`/videos/${randomVideo}`}
              autoPlay
              muted // Muted to ensure autoplay works on most browsers
              playsInline
              onEnded={() => setVideoEnded(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-muted">
              <span className="text-6xl mb-2">{winner === 'draw' ? '⚖️' : '💔'}</span>
              <p className="font-sans font-bold text-ink-muted">Ayo coba lagi!</p>
            </div>
          )}
        </div>

        <div className="w-full bg-accent-light/50 border border-accent border-dashed p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="font-sans font-bold text-ink">Reward XP</p>
            <p className="font-sans text-xs text-ink-muted">
              {mode === 'solo' ? `Mode ${difficulty}` : 'Team Battle'}
            </p>
          </div>
          <div className="text-2xl font-black text-accent-dark">
            +{xp}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-4">
          <Button fullWidth onClick={() => navigate('/latihan/think-tac-toe', { replace: true })}>
            Main Lagi
          </Button>
          <Button fullWidth variant="outline" onClick={() => navigate('/latihan', { replace: true })}>
            Kembali ke Latihan
          </Button>
        </div>
        
      </div>
    </div>
  );
}
