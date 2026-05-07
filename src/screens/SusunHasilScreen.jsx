import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PageWrapper, TopBar, Button } from '../components/ui';

export default function SusunHasilScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, xp, benar, total, finalItems } = location.state || {};

  useEffect(() => {
    if (score >= 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF70A6', '#FFD6E8', '#E8508A']
      });
    }
  }, [score]);

  if (!location.state) return <Navigate to="/games" replace />;

  const isWin = score >= 75;

  return (
    <PageWrapper>
      <TopBar title="Hasil Susun Struktur" showBack backPath="/games" />
      
      <div className="container py-6 px-4 flex flex-col min-h-[calc(100dvh-56px)]">
        
        {/* Score Hero */}
        <div className={`border rounded-2xl p-6 flex flex-col items-center mb-6 shadow-sm relative overflow-hidden
          ${isWin ? 'bg-[#FFF0F6] border-[#FFD6E8]' : 'bg-surface-muted border-border'}
        `}>
          <div className="text-4xl mb-2">{isWin ? '🏆' : '💪'}</div>
          <h1 className="font-serif font-black text-5xl text-ink mt-2 mb-1">{score}</h1>
          
          <p className="font-sans text-sm text-ink-muted mb-4">
            {benar} dari {total} paragraf benar
          </p>
          
          <div className="bg-white border rounded-xl px-6 py-3 flex items-center justify-center">
            <span className="font-serif font-bold text-secondary-dark">+ {xp} XP</span>
          </div>
        </div>

        <div className="flex-1">
          {/* Note: In a full implementation, you could render the paragraphs showing correct/wrong placement here */}
          {/* To save space and complexity, we just show the summary score for now */}
          <div className="bg-white border rounded-xl p-4 text-center">
            <p className="text-sm font-sans text-ink-muted">
              {isWin 
                ? "Hebat! Kamu berhasil menyusun struktur teks eksposisi dengan baik." 
                : "Ayo coba lagi! Perhatikan ciri-ciri tiap bagian struktur teks."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={() => navigate('/games/susun-struktur', { replace: true })} fullWidth className="bg-secondary hover:bg-secondary-dark border-none text-white">
            Main Lagi
          </Button>
          <Button variant="outline" onClick={() => navigate('/games', { replace: true })} fullWidth>
            Ke Menu Game
          </Button>
        </div>

      </div>
    </PageWrapper>
  );
}
