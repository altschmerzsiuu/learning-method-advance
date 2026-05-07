// src/screens/QuizScreen.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { PageWrapper, Button } from '../components/ui';
import SoalCard from '../components/quiz/SoalCard';
import { useQuiz } from '../hooks/useQuiz';

export default function QuizScreen() {
  const { topikId } = useParams();
  const navigate    = useNavigate();
  const {
    soalList, currentSoal, currentIdx, total, isLast,
    loading, direction, selectedAnswer, isAnswered,
    score, selectAnswer, nextSoal, getScorePercent,
  } = useQuiz(topikId);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-dvh p-4 gap-4">
          <div className="w-8 h-8 border-4 border-primary-300 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-[14px] text-ink-muted">Memuat soal...</p>
        </div>
      </PageWrapper>
    );
  }

  if (soalList.length === 0) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-dvh p-4 gap-4">
          <p className="font-serif text-[18px] font-bold text-ink text-center">Soal tidak tersedia untuk topik ini.</p>
          <Button variant="ghost" onClick={() => navigate(-1)}>Kembali</Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* TopBar — no BottomNav on quiz */}
      <header className="sticky top-0 z-50 bg-surface-card border-b border-border h-[52px] flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-muted">
          <X size={20} strokeWidth={1.5} className="text-ink" />
        </button>
        {/* Progress dots */}
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {soalList.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentIdx ? 'bg-primary-300 w-3' :
                i === currentIdx ? 'bg-primary-400 w-5' :
                'bg-border w-3'
              }`}
            />
          ))}
        </div>
        <span className="font-sans text-[12px] text-ink-muted w-9 text-right">
          {currentIdx + 1}/{total}
        </span>
      </header>

      <div className="px-4 pt-5 pb-32">
        <SoalCard
          soal={currentSoal}
          direction={direction}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          onSelect={selectAnswer}
        />
      </div>

      {/* Bottom CTA */}
      {isAnswered && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-card border-t border-border p-4 z-40">
          {isLast ? (
            <Button
              fullWidth
              onClick={() => navigate(`/quiz/${topikId}/hasil`, { state: { score, total, scorePercent: getScorePercent() } })}
            >
              Lihat Hasil
            </Button>
          ) : (
            <Button fullWidth onClick={nextSoal}>
              Soal Berikutnya
            </Button>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
