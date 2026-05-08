// src/screens/QuizScreen.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { PageWrapper, Button, TopBar } from '../components/ui';
import SoalCard from '../components/quiz/SoalCard';
import { useQuiz } from '../hooks/useQuiz';

export default function QuizScreen() {
  const { topikId } = useParams();
  const navigate    = useNavigate();
  const {
    soalList, currentSoal, currentIdx, total, isLast,
    loading, error, direction, selectedAnswer, isAnswered,
    score, selectAnswer, nextSoal, getScorePercent, retry
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

  if (error) {
    return (
      <PageWrapper>
        <TopBar showBack />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-6 text-center gap-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h2 className="font-serif font-black text-xl text-ink">Koneksi Bermasalah</h2>
          <p className="font-sans text-sm text-ink-muted">Gagal mengambil soal dari server. Pastikan koneksi internetmu stabil.</p>
          <Button onClick={() => retry()} className="mt-2">Coba Lagi</Button>
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
      <TopBar 
        title={`Quiz: ${currentIdx + 1}/${total}`}
        showBack
      />

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
