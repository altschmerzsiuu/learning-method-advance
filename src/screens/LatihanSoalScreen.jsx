import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSoalLatihan, simpanHasilLatihan } from '../hooks/useLatihan';
import { PageWrapper, TopBar, ProgressBar, Toast } from '../components/ui';
import { toast } from '../lib/toast';

export default function LatihanSoalScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of option objects
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSoal() {
      try {
        const data = await getSoalLatihan();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadSoal();
  }, []);

  const handleAnswer = async (opt) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = opt;
    setAnswers(newAnswers);
    
    // Auto next after 1.2s delay for feedback
    setTimeout(async () => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Finish
        setSaving(true);
        if (user) {
          try {
            const hasil = await simpanHasilLatihan(user.id, newAnswers, questions);
            navigate('/latihan/hasil', {
              replace: true,
              state: { ...hasil, questions }
            });
          } catch (err) {
            console.error("Gagal menyimpan hasil:", err);
            toast.error('Gagal menyimpan hasil: ' + err.message);
            setSaving(false);
          }
        }
      }
    }, 1200);
  };

  if (loading || saving) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-8 h-8 border-4 border-primary-300 border-t-transparent rounded-full animate-spin" />
        {saving && <p className="absolute mt-12 text-xs font-bold text-ink">Menyimpan Hasil...</p>}
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

  const soal = questions[currentIdx];
  const answeredOpt = answers[currentIdx];
  const progress = ((currentIdx + (answeredOpt ? 1 : 0)) / questions.length) * 100;

  return (
    <PageWrapper className="latihan-screen">
      <TopBar title={`Soal ${currentIdx + 1} / ${questions.length}`} showBack />
      
      <div className="container py-4 px-4 flex flex-col min-h-[calc(100dvh-56px)]">
        <div className="mb-6">
          <ProgressBar value={progress} />
        </div>

        <div className="flex-1 w-full max-w-md mx-auto">
          <div className="soal-card p-5">
            {/* Context (bacaan) jika ada */}
            {soal.quiz_contexts?.context_text && (
              <div className="context-box">
                <div className="context-label">BACAAN</div>
                <p className="font-serif text-sm leading-relaxed text-ink">{soal.quiz_contexts.context_text}</p>
              </div>
            )}

            {/* Pertanyaan */}
            <p className="font-sans font-bold text-ink mb-6">{soal.question_text}</p>

            {/* Pilihan Jawaban */}
            <div className="flex flex-col gap-3">
              {soal.answer_options?.map((opt, i) => {
                const isSelected = answeredOpt?.id === opt.id;
                const showCorrect = !!answeredOpt && opt.is_correct;
                const showWrong = isSelected && !opt.is_correct;
                
                let btnClass = "option-btn text-left p-3 flex items-center gap-3 transition-colors ";
                if (showCorrect) btnClass += "correct";
                else if (showWrong) btnClass += "wrong";
                else if (answeredOpt) btnClass += "opacity-50"; // disable others
                else btnClass += "hover:bg-surface-muted";

                return (
                  <button
                    key={opt.id}
                    className={btnClass}
                    onClick={() => !answeredOpt && handleAnswer(opt)}
                    disabled={!!answeredOpt}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                      ${showCorrect ? 'bg-success-500 text-white' : 
                        showWrong ? 'bg-rose-500 text-white' : 
                        'bg-surface-muted text-ink-muted'}
                    `}>
                      {['A','B','C','D'][i]}
                    </span>
                    <span className={`font-sans text-sm ${showCorrect || showWrong ? 'font-bold' : ''}`}>
                      {opt.option_text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
