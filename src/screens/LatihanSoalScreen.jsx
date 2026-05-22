import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getSoalLatihan, simpanHasilLatihan } from '../hooks/useLatihan';
import { PageWrapper } from '../components/ui';
import { toast } from '../lib/toast';
import { Flag, ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckSquare } from 'lucide-react';

const TOTAL_TIME = 90 * 60;

export default function LatihanSoalScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const navBarRef = useRef(null);
  const activeBoxRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    async function loadSoal() {
      try {
        const savedQ  = sessionStorage.getItem('latihan_questions');
        const savedA  = sessionStorage.getItem('latihan_answers');
        const savedI  = sessionStorage.getItem('latihan_current_idx');
        const savedT  = sessionStorage.getItem('latihan_time_left');
        const savedF  = sessionStorage.getItem('latihan_flagged');

        if (savedQ) {
          setQuestions(JSON.parse(savedQ));
          if (savedA) setAnswers(JSON.parse(savedA));
          if (savedI) setCurrentIdx(Number(savedI));
          if (savedT) setTimeLeft(Number(savedT));
          if (savedF) setFlagged(new Set(JSON.parse(savedF)));
        } else {
          const data = await getSoalLatihan();
          setQuestions(data);
          sessionStorage.setItem('latihan_questions', JSON.stringify(data));
          sessionStorage.setItem('latihan_time_left', TOTAL_TIME.toString());
        }
        setTimerStarted(true);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat soal: ' + err.message);
      }
      setLoading(false);
    }
    loadSoal();
  }, []);

  const doSubmit = useCallback(async (currentAnswers) => {
    setSaving(true);
    sessionStorage.removeItem('latihan_questions');
    sessionStorage.removeItem('latihan_answers');
    sessionStorage.removeItem('latihan_current_idx');
    sessionStorage.removeItem('latihan_time_left');
    sessionStorage.removeItem('latihan_flagged');
    if (user) {
      try {
        const answersArray = questions.map((_, i) => currentAnswers[i] || null);
        const hasil = await simpanHasilLatihan(user.id, answersArray, questions);
        navigate('/latihan/hasil', { replace: true, state: { ...hasil, questions } });
      } catch (err) {
        console.error('Gagal menyimpan hasil:', err);
        toast.error('Gagal menyimpan hasil: ' + err.message);
        setSaving(false);
      }
    }
  }, [user, questions, navigate]);

  useEffect(() => {
    if (!timerStarted || loading) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        sessionStorage.setItem('latihan_time_left', next.toString());
        if (next <= 0) {
          clearInterval(interval);
          toast.error('Waktu habis! Jawaban otomatis dikumpulkan.');
          const saved = sessionStorage.getItem('latihan_answers');
          doSubmit(saved ? JSON.parse(saved) : {});
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStarted, loading, doSubmit]);

  useEffect(() => {
    activeBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentIdx]);

  // Peringatan sebelum keluar tab/halaman agar ujian aman (confidential & secure)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Progress latihan kamu akan hilang jika kamu keluar halaman ini. Yakin ingin keluar?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getBoxStatus = (idx) => {
    if (flagged.has(idx)) return 'flagged';
    if (answers[idx]) return 'answered';
    return 'empty';
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleAnswer = (opt) => {
    const newAnswers = { ...answers, [currentIdx]: opt };
    setAnswers(newAnswers);
    sessionStorage.setItem('latihan_answers', JSON.stringify(newAnswers));
  };

  const handleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentIdx)) newFlagged.delete(currentIdx);
    else newFlagged.add(currentIdx);
    setFlagged(newFlagged);
    sessionStorage.setItem('latihan_flagged', JSON.stringify([...newFlagged]));
  };

  const goToQuestion = (idx) => {
    setCurrentIdx(idx);
    sessionStorage.setItem('latihan_current_idx', idx.toString());
  };

  const handleSubmitClick = () => {
    if (unansweredCount > 0) setShowConfirm(true);
    else doSubmit(answers);
  };

  if (loading || saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-surface gap-3">
        <div className="w-8 h-8 border-4 border-primary-300 border-t-transparent rounded-full animate-spin" />
        {saving && <p className="text-xs font-bold text-ink-muted">Menyimpan hasil...</p>}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-surface p-6 text-center">
        <p className="text-ink-muted text-sm">Belum ada soal latihan tersedia.</p>
      </div>
    );
  }

  const soal = questions[currentIdx];
  const selectedOpt = answers[currentIdx];
  const isFlagged = flagged.has(currentIdx);
  const isDanger = timeLeft <= 600;

  return (
    <PageWrapper withNav={false} className="latihan-exam-focus">
      <div className="latihan-full-screen">

      {/* TOP BAR */}
      <header className="latihan-topbar">
        <div className={`latihan-timer${isDanger ? ' danger' : ''}`}>
          <Clock size={13} strokeWidth={2.5} />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="latihan-topbar-title">
          <span className="text-[11px] font-bold text-ink-muted">Soal</span>
          <span className="font-serif font-black text-sm text-ink">{currentIdx + 1} / {questions.length}</span>
        </div>
        <button
          onClick={handleFlag}
          className={`latihan-flag-btn${isFlagged ? ' active' : ''}`}
        >
          <Flag size={15} strokeWidth={2} />
          {isFlagged && <span className="text-[10px] font-bold">Ragu</span>}
        </button>
      </header>

      {/* PROGRESS BAR */}
      <div className="latihan-progress-strip">
        <div className="latihan-progress-fill" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </div>

      {/* SOAL AREA */}
      <div className="latihan-soal-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={`soal-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {soal.quiz_contexts?.context_text && (
              <div className="context-box mb-3">
                <div className="context-label">BACAAN</div>
                <p className="context-text whitespace-pre-wrap">{soal.quiz_contexts.context_text}</p>
              </div>
            )}
            <p className="question-text">{soal.question_text}</p>
            <div className="options-list">
              {soal.answer_options?.map((opt, i) => {
                const isSelected = selectedOpt?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`option-btn${isSelected ? ' selected' : ''}`}
                    onClick={() => handleAnswer(opt)}
                  >
                    <span className={`option-letter${isSelected ? ' selected' : ''}`}>
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    <span className="flex-1 text-left">{opt.option_text}</span>
                    {isSelected && <span className="option-check-icon">✓</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="latihan-bottom-section">
        <div className="latihan-nav-buttons">
          <button className="latihan-nav-btn" onClick={() => currentIdx > 0 && goToQuestion(currentIdx - 1)} disabled={currentIdx === 0}>
            <ChevronLeft size={16} strokeWidth={2.5} />
            <span>Sebelumnya</span>
          </button>
          {currentIdx < questions.length - 1 ? (
            <button className="latihan-nav-btn primary" onClick={() => goToQuestion(currentIdx + 1)}>
              <span>Berikutnya</span>
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <button className="latihan-nav-btn submit" onClick={handleSubmitClick} disabled={saving}>
              <CheckSquare size={15} strokeWidth={2} />
              <span>Kumpulkan</span>
            </button>
          )}
        </div>

        <div className="soal-nav-legend">
          <div className="legend-item"><span className="legend-box empty" /><span>Belum</span></div>
          <div className="legend-item"><span className="legend-box answered" /><span>Dijawab</span></div>
          <div className="legend-item"><span className="legend-box flagged" /><span>Ragu</span></div>
        </div>

        <div className="soal-nav-bar scrollbar-hide" ref={navBarRef}>
          {questions.map((_, idx) => {
            const status = getBoxStatus(idx);
            const isActive = idx === currentIdx;
            return (
              <button
                key={idx}
                ref={isActive ? activeBoxRef : null}
                className={`soal-nav-box ${status}${isActive ? ' active' : ''}`}
                onClick={() => goToQuestion(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button className="latihan-submit-btn" onClick={handleSubmitClick} disabled={saving}>
          <CheckSquare size={15} strokeWidth={2} />
          Kumpulkan Jawaban
          {unansweredCount > 0 && <span className="submit-badge">{unansweredCount} belum</span>}
        </button>
      </div>

      {/* MODAL KONFIRMASI */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="latihan-modal-overlay"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              className="latihan-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-icon-wrap">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <h3 className="font-serif font-black text-base text-ink mb-1">Masih ada soal belum dijawab</h3>
              <p className="text-xs text-ink-muted mb-5">
                <strong>{unansweredCount} soal</strong> belum dijawab. Soal yang tidak dijawab dihitung salah. Yakin ingin mengumpulkan?
              </p>
              <div className="flex gap-2">
                <button className="modal-btn cancel" onClick={() => setShowConfirm(false)}>Lanjut Kerjakan</button>
                <button className="modal-btn confirm" onClick={() => { setShowConfirm(false); doSubmit(answers); }}>Ya, Kumpulkan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </PageWrapper>
  );
}
