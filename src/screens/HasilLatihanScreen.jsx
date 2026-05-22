import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PageWrapper, TopBar, Button } from '../components/ui';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function HasilLatihanScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, grade, benar, totalSoal, xpEarned, detail, questions } = location.state || {};
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (score >= 80) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#70D6FF', '#FF70A6', '#FFD670'] });
    }
  }, [score]);

  if (!location.state) return <Navigate to="/latihan" replace />;

  const getGradeStyle = (g) => {
    switch(g) {
      case 'A': return { bg: '#F0FAFF', text: '#00A3E8', border: '#B9ECFF' };
      case 'B': return { bg: '#DCFCE7', text: '#22C55E', border: '#BBF7D0' };
      case 'C': return { bg: '#FFFBEB', text: '#D97706', border: '#FFE9A0' };
      case 'D': return { bg: '#FFEDD5', text: '#EA580C', border: '#FED7AA' };
      default:  return { bg: '#FFF0F6', text: '#E11D48', border: '#FFD6E8' };
    }
  };

  const gradeStyle = getGradeStyle(grade);
  const displayList = filter === 'wrong' ? detail.filter(d => !d.is_benar) : detail;

  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <PageWrapper withNav className="latihan-screen">
      <TopBar title="Hasil Latihan" showBack backPath="/latihan" />

      <div className="container py-5 px-4 flex flex-col min-h-[calc(100dvh-56px)]">

        {/* ── SCORE HERO ─────────────────────────────────────────────────── */}
        <div className="hasil-hero-card mb-8">
          <div className="hasil-hero-bar" style={{ background: gradeStyle.text }} />

          <div className="flex flex-col items-center pt-5 pb-6 px-4">
            <p className="text-xs font-bold text-ink-muted mb-1">SKOR KAMU</p>
            <h1 className="font-serif font-black text-6xl text-ink mb-2">{score}</h1>

            <div
              className="px-4 py-1 rounded-full border font-bold text-base mb-3"
              style={{ background: gradeStyle.bg, color: gradeStyle.text, borderColor: gradeStyle.border }}
            >
              Grade {grade}
            </div>

            {/* Ringkasan */}
            <p className="font-sans text-sm text-ink-muted mb-4 text-center">
              Kamu menjawab <strong className="text-ink">{benar} dari {totalSoal}</strong> soal dengan benar
            </p>

            {/* XP */}
            <div className="bg-accent-light border border-accent-border rounded-xl px-6 py-2.5 flex items-center gap-2 mb-3">
              <span className="text-lg">⚡</span>
              <span className="font-serif font-bold text-accent-dark">+ {xpEarned} XP didapat!</span>
            </div>

            {/* Statistik mini */}
            <div className="flex gap-4 mt-1">
              <div className="text-center">
                <p className="font-serif font-black text-xl text-[#22C55E]">{benar}</p>
                <p className="text-[10px] font-bold text-ink-muted">Benar</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="font-serif font-black text-xl text-[#F43F5E]">{totalSoal - benar}</p>
                <p className="text-[10px] font-bold text-ink-muted">Salah</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="font-serif font-black text-xl text-ink">{totalSoal}</p>
                <p className="text-[10px] font-bold text-ink-muted">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── REVIEW SECTION ─────────────────────────────────────────────── */}
        <div className="flex-1 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif font-bold text-sm text-ink">Review Jawaban</h2>
            <div className="bg-surface-muted rounded-full p-1 flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-ink' : 'text-ink-muted'}`}
              >
                Semua ({totalSoal})
              </button>
              <button
                onClick={() => setFilter('wrong')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${filter === 'wrong' ? 'bg-white shadow-sm text-ink' : 'text-ink-muted'}`}
              >
                Yang Salah ({totalSoal - benar})
              </button>
            </div>
          </div>

          <div className="hasil-review-grid flex flex-col gap-3 mb-8">
            {displayList.map((d, i) => {
              const soalIdx = questions.findIndex(q => q.id === d.soal_id);
              const soal = questions[soalIdx];
              if (!soal) return null;

              const optBenar = soal.answer_options.find(o => o.id === d.jawaban_benar);
              const optUser  = soal.answer_options.find(o => o.id === d.pilihan_user);
              const isOpen   = expanded[i] !== false; // default open

              return (
                <div
                  key={d.soal_id}
                  className={`review-soal-card ${d.is_benar ? 'benar' : 'salah'}`}
                >
                  {/* Header soal */}
                  <button
                    className="w-full flex items-start gap-3 text-left"
                    onClick={() => toggleExpand(i)}
                  >
                    <div className={`review-status-badge ${d.is_benar ? 'benar' : 'salah'}`}>
                      {d.is_benar ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-ink-muted mb-0.5">
                        Soal {soalIdx + 1} · {d.is_benar ? '✓ Benar' : '✗ Salah'}
                      </p>
                      <p className="font-sans text-xs font-semibold text-ink leading-relaxed line-clamp-2">
                        {soal.question_text}
                      </p>
                    </div>
                    {isOpen
                      ? <ChevronUp size={14} className="text-ink-muted shrink-0 mt-0.5" />
                      : <ChevronDown size={14} className="text-ink-muted shrink-0 mt-0.5" />
                    }
                  </button>

                  {/* Detail semua opsi */}
                  {isOpen && (
                    <div className="mt-3 flex flex-col gap-1.5 pl-8">
                      {soal.answer_options.map((opt, oi) => {
                        const isCorrectAnswer = opt.id === d.jawaban_benar;
                        const isUserAnswer    = opt.id === d.pilihan_user;
                        const label           = ['A', 'B', 'C', 'D'][oi];

                        let optClass = 'review-option';
                        let badge = null;

                        if (isCorrectAnswer && isUserAnswer) {
                          optClass += ' correct';
                          badge = <span className="review-option-badge correct">✓ Jawaban kamu & jawaban benar</span>;
                        } else if (isCorrectAnswer) {
                          optClass += ' correct';
                          badge = <span className="review-option-badge correct">✓ Jawaban benar</span>;
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          optClass += ' wrong';
                          badge = <span className="review-option-badge wrong">✗ Jawaban kamu</span>;
                        }

                        return (
                          <div key={opt.id} className={optClass}>
                            <span className="review-option-letter">{label}</span>
                            <div className="flex-1 min-w-0">
                              <span className="review-option-text">{opt.option_text}</span>
                              {badge}
                            </div>
                          </div>
                        );
                      })}

                      {/* Jika soal tidak dijawab */}
                      {!optUser && (
                        <p className="text-[10px] text-ink-muted mt-1 italic">— Soal ini tidak dijawab</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {displayList.length === 0 && (
              <div className="text-center py-8 text-ink-muted text-xs">
                Yeay! Tidak ada jawaban yang salah. 🎉
              </div>
            )}
          </div>
        </div>

        {/* ── ACTIONS ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 pb-6">
          <Button onClick={() => { sessionStorage.clear(); navigate('/latihan/soal', { replace: true }); }} fullWidth>
            Latihan Lagi
          </Button>
          <Button variant="outline" onClick={() => navigate('/beranda', { replace: true })} fullWidth>
            Ke Beranda
          </Button>
        </div>

      </div>
    </PageWrapper>
  );
}
