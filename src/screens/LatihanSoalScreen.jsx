import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getSoalLatihan, simpanHasilLatihan } from '../hooks/useLatihan';
import { PageWrapper, TopBar, ProgressBar, Button } from '../components/ui';
import { toast } from '../lib/toast';

export default function LatihanSoalScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function loadSoal() {
      try {
        // Cek apakah ada data kuis yang tersimpan di sesi ini
        const savedQuestions = sessionStorage.getItem('latihan_questions');
        const savedAnswers = sessionStorage.getItem('latihan_answers');
        const savedIdx = sessionStorage.getItem('latihan_current_idx');

        if (savedQuestions) {
          setQuestions(JSON.parse(savedQuestions));
          if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
          if (savedIdx) setCurrentIdx(Number(savedIdx));
        } else {
          // Jika tidak ada, ambil dari database
          const data = await getSoalLatihan();
          setQuestions(data);
          sessionStorage.setItem('latihan_questions', JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadSoal();
  }, []);

  const handleAnswer = async (opt) => {
    if (isTransitioning) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIdx] = opt;
    setAnswers(newAnswers);
    
    // Simpan progres jawaban ke session storage
    sessionStorage.setItem('latihan_answers', JSON.stringify(newAnswers));
    
    // Auto next after feedback delay
    setIsTransitioning(true);
    setTimeout(async () => {
      if (currentIdx < questions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        // Simpan nomor soal terakhir ke session storage
        sessionStorage.setItem('latihan_current_idx', nextIdx.toString());
        setIsTransitioning(false);
      } else {
        setSaving(true);
        
        // Hapus data sesi karena kuis sudah selesai
        sessionStorage.removeItem('latihan_questions');
        sessionStorage.removeItem('latihan_answers');
        sessionStorage.removeItem('latihan_current_idx');

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
            setIsTransitioning(false);
          }
        }
      }
    }, 1200);
  };

  if (loading || saving) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-surface">
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
      <TopBar title={`Soal ${currentIdx + 1} / ${questions.length}`} />
      
      <div className="latihan-progress-wrapper">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-ink-muted uppercase tracking-wider">Progres Belajar</span>
          <span className="text-[10px] font-black text-primary-300">{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <motion.div 
            className="h-full progfill-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="soal-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={`soal-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="soal-card">
              {soal.quiz_contexts?.context_text && (
                <div className="context-box">
                  <div className="context-label">BACAAN</div>
                  <p className="context-text whitespace-pre-wrap">{soal.quiz_contexts.context_text}</p>
                </div>
              )}

              <p className="question-text">{soal.question_text}</p>

              <div className="options-list">
                {soal.answer_options?.map((opt, i) => {
                  const isSelected = answeredOpt?.id === opt.id;
                  const showCorrect = !!answeredOpt && opt.is_correct;
                  const showWrong = isSelected && !opt.is_correct;
                  
                  let btnClass = "option-btn ";
                  if (showCorrect) btnClass += "correct";
                  else if (showWrong) btnClass += "wrong";
                  else if (answeredOpt) btnClass += "opacity-50";

                  return (
                    <button
                      key={opt.id}
                      className={btnClass}
                      onClick={() => !answeredOpt && handleAnswer(opt)}
                      disabled={!!answeredOpt || isTransitioning}
                    >
                      <span className="option-letter">
                        {['A','B','C','D'][i]}
                      </span>
                      <span className="flex-1">{opt.option_text}</span>
                      {showCorrect && <div className="option-icon">✓</div>}
                      {showWrong && <div className="option-icon">✕</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {answeredOpt && currentIdx === questions.length - 1 && (
        <div className="latihan-bottom-bar">
          <Button fullWidth disabled={saving}>
            {saving ? 'Menyimpan...' : 'Lihat Hasil Akhir'}
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}
