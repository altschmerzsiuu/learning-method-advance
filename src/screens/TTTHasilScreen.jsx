import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { PageWrapper, TopBar, Button } from '../components/ui';
import { supabase } from '../lib/supabase';
import { checkAndAwardBadges, triggerBadgeToast } from '../lib/badgeChecker';

const WIN_VIDEOS = [
  'video1.mp4', 
  'video2.mp4', 
  'video3.mp4', 
  'bintanglima.mp4', 
  'kasihababa.mp4', 
  'tenxi.mp4'
];

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

export default function TTTHasilScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { winner, teamX, teamO, mode, difficulty } = location.state || {};
  
  const [xp, setXp] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [resultStatus, setResultStatus] = useState(''); // 'menang', 'kalah', 'seri'
  const videoRef = useRef(null);

  const [randomVideo] = useState(() => {
    return WIN_VIDEOS[Math.floor(Math.random() * WIN_VIDEOS.length)];
  });

  useEffect(() => {
    if (!location.state) {
      navigate('/games', { replace: true });
      return;
    }

    let resultStr = 'seri';
    if (winner === 'X') resultStr = 'menang';
    if (mode === 'solo' && winner === 'O') resultStr = 'kalah';
    if (mode === 'team' && winner === 'O') resultStr = 'menang'; // Tim O menang
    
    setResultStatus(resultStr);

    const earnedXp = hitungXP(mode, resultStr === 'kalah' ? 'kalah' : winner === 'draw' ? 'seri' : 'menang', difficulty);
    setXp(earnedXp);

    if (resultStr === 'menang') {
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#70D6FF','#FF70A6','#FFD670','#FFFFFF'],
        origin: { y: 0.6 }
      });
    }

    // Save to supabase
    const saveResult = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('game_history').insert({
          user_id: session.user.id,
          mode: mode === 'solo' ? 'solo' : 'team', // Make sure it fits the constraint
          result: resultStr,
          xp_earned: earnedXp
        });
        
        await supabase.rpc('increment_xp', { user_id: session.user.id, amount: earnedXp });

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
  let titleColor = '';
  if (resultStatus === 'seri') {
    title = 'Seri!';
    titleColor = 'text-[#D97706]'; // gold
  } else if (resultStatus === 'menang') {
    title = mode === 'team' ? `Tim ${winner} Menang!` : `${teamX} Menang!`;
    titleColor = 'text-[#00A3E8]'; // sky
  } else {
    title = 'Jangan Menyerah!';
    titleColor = 'text-[#E11D48]'; // rose
  }

  return (
    <PageWrapper className={resultStatus === 'menang' ? 'bg-[#F0FAFF]' : 'bg-surface'}>
      <TopBar title="Hasil Game" showBack backPath="/games" />

      <div className="container py-6 px-4 flex flex-col min-h-[calc(100dvh-56px)]">
        
        {/* State: Menang */}
        {resultStatus === 'menang' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {!videoEnded ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h1 className={`font-serif font-black text-2xl mb-1 ${titleColor}`}>
                    {title}
                  </h1>
                  <p className="font-sans text-sm text-ink-muted">Tonton perayaan kemenanganmu! 🎉</p>
                </motion.div>
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative shadow-lg">
                  <video
                    ref={videoRef}
                    src={`/videos/${randomVideo}`}
                    autoPlay
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white rounded-full text-xs font-bold backdrop-blur-sm border border-white/20"
                    onClick={() => setVideoEnded(true)}
                  >
                    Skip →
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center bg-white p-8 rounded-3xl border border-[#B9ECFF] shadow-sm w-full"
              >
                <div className="text-6xl mb-4">🏆</div>
                <h1 className={`font-serif font-black text-3xl mb-2 text-center ${titleColor}`}>
                  {title}
                </h1>
                <p className="font-sans text-sm text-ink-muted text-center mb-6">Kamu mainnya hebat banget!</p>
              </motion.div>
            )}
          </div>
        )}

        {/* State: Seri */}
        {resultStatus === 'seri' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-[#FFE9A0] rounded-3xl p-8 mb-6 shadow-sm">
            <div className="text-6xl mb-4">🤝</div>
            <h1 className={`font-serif font-black text-3xl mb-2 ${titleColor}`}>{title}</h1>
            <p className="font-sans text-sm text-ink-muted">Pertandingan yang sangat sengit.</p>
          </div>
        )}

        {/* State: Kalah */}
        {resultStatus === 'kalah' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-[#FFD6E8] rounded-3xl p-8 mb-6 shadow-sm">
            <div className="text-6xl mb-4">💪</div>
            <h1 className={`font-serif font-black text-3xl mb-2 ${titleColor}`}>{title}</h1>
            <p className="font-sans text-sm text-ink-muted">Coba lagi, pasti bisa!</p>
          </div>
        )}

        {/* Info & Actions */}
        {(videoEnded || resultStatus !== 'menang') && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full mt-6 flex flex-col gap-4"
          >
            <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-sans font-bold text-xs text-ink">Reward XP</p>
                <p className="font-sans text-[10px] text-ink-muted">
                  {mode === 'solo' ? `Mode ${difficulty}` : 'Team Battle'}
                </p>
              </div>
              <div className="text-xl font-black text-[#E8B800]">+ {xp}</div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/games/think-tac-toe/setup', { replace: true })} fullWidth>
                Main Lagi
              </Button>
              <Button variant="outline" onClick={() => navigate('/games', { replace: true })} fullWidth>
                Game Lain
              </Button>
            </div>
          </motion.div>
        )}

      </div>
    </PageWrapper>
  );
}
