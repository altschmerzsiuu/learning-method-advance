import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { PageWrapper, TopBar, ProgressBar } from '../components/ui';
import SoalCard from '../components/quiz/SoalCard';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function LatihanSoalScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [idx]: { opsi: 'A', isCorrect: true } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSoal() {
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .in('pool', ['latihan', 'both'])
        .limit(50);
      
      if (data && data.length > 0) {
        setQuestions(shuffleArray(data).slice(0, 20));
      }
      setLoading(false);
    }
    loadSoal();
  }, []);

  const handleAnswer = (opsi, isCorrect) => {
    setAnswers({
      ...answers,
      [currentIdx]: { opsi, isCorrect }
    });
    
    // Auto next after 1.2s delay for feedback
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        finishLatihan();
      }
    }, 1200);
  };

  const finishLatihan = async () => {
    const correctCount = Object.values(answers).filter(a => a?.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const xpEarned = correctCount * 10; // 10 XP per correct answer in latihan

    if (user) {
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        tipe: 'latihan',
        score,
        total_soal: questions.length,
        xp_earned: xpEarned
      });
      // Streak and total_xp update will be handled in HasilLatihanScreen or useProfile hook
    }

    navigate('/latihan/soal/hasil', {
      replace: true,
      state: { score, correctCount, total: questions.length, xp: xpEarned }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-8 h-8 border-4 border-primary-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <PageWrapper>
        <TopBar title="Latihan Kosong" showBack />
        <div className="p-6 text-center text-ink-muted mt-20">Belum ada soal latihan tersedia.</div>
      </PageWrapper>
    );
  }

  const q = questions[currentIdx];
  const hasAnswered = !!answers[currentIdx];
  const progress = ((currentIdx + (hasAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <PageWrapper>
      <TopBar title={`Soal ${currentIdx + 1} / ${questions.length}`} showBack />
      
      <div className="container py-4 flex flex-col min-h-[calc(100dvh-52px)]">
        <div className="mb-6">
          <ProgressBar value={progress} />
        </div>

        <div className="flex-1">
          <SoalCard
            soal={q}
            onAnswer={handleAnswer}
            disabled={hasAnswered}
          />
        </div>

        {hasAnswered && currentIdx < questions.length - 1 && (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="mt-6 w-full py-3 bg-primary-300 hover:bg-primary-600 text-ink font-bold rounded-xl active:scale-95 transition-all"
          >
            Lanjut
          </button>
        )}
      </div>
    </PageWrapper>
  );
}
