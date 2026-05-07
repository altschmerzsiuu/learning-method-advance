import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PageWrapper, TopBar, Button } from '../components/ui';
import { Check, X } from 'lucide-react';

export default function HasilLatihanScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, grade, benar, totalSoal, xpEarned, detail, questions } = location.state || {};
  const [filter, setFilter] = useState('all'); // 'all' | 'wrong'

  useEffect(() => {
    if (score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#70D6FF', '#FF70A6', '#FFD670']
      });
    }
  }, [score]);

  if (!location.state) return <Navigate to="/latihan" replace />;

  const getGradeClass = (g) => {
    switch(g) {
      case 'A': return 'bg-[#F0FAFF] text-[#00A3E8] border-[#B9ECFF]';
      case 'B': return 'bg-[#DCFCE7] text-[#22C55E] border-[#BBF7D0]';
      case 'C': return 'bg-[#FFFBEB] text-[#D97706] border-[#FFE9A0]';
      case 'D': return 'bg-[#FFEDD5] text-[#EA580C] border-[#FED7AA]';
      default:  return 'bg-[#FFF0F6] text-[#E11D48] border-[#FFD6E8]';
    }
  };

  const displayList = filter === 'wrong' ? detail.filter(d => !d.is_benar) : detail;

  return (
    <PageWrapper className="latihan-screen">
      <TopBar title="Hasil Latihan" showBack backPath="/latihan" />
      
      <div className="container py-6 px-4 flex flex-col min-h-[calc(100dvh-56px)]">
        
        {/* Score Hero */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center mb-6 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 w-full h-2 ${getGradeClass(grade).split(' ')[0]}`} />
          
          <h1 className="font-serif font-black text-6xl text-ink mt-2 mb-1">{score}</h1>
          <div className={`px-4 py-1 rounded-full border font-bold text-lg mb-3 ${getGradeClass(grade)}`}>
            Grade {grade}
          </div>
          <p className="font-sans text-sm text-ink-muted mb-4">
            {benar} dari {totalSoal} soal benar
          </p>
          
          <div className="bg-accent-light border border-accent-border rounded-xl px-6 py-3 flex items-center justify-center">
            <span className="font-serif font-bold text-accent-dark">+ {xpEarned} XP</span>
          </div>
        </div>

        {/* Review Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif font-bold text-sm text-ink">Review Jawaban</h2>
            <div className="bg-surface-muted rounded-full p-1 flex">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-ink' : 'text-ink-muted'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setFilter('wrong')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${filter === 'wrong' ? 'bg-white shadow-sm text-ink' : 'text-ink-muted'}`}
              >
                Yang Salah
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {displayList.map((d, i) => {
              const soal = questions.find(q => q.id === d.soal_id);
              if (!soal) return null;
              
              const optBenar = soal.answer_options.find(o => o.id === d.jawaban_benar);
              const optUser = soal.answer_options.find(o => o.id === d.pilihan_user);
              
              return (
                <div key={d.soal_id} className={`p-4 rounded-xl border ${d.is_benar ? 'bg-[#F0FAFF] border-[#B9ECFF]' : 'bg-[#FFF0F6] border-[#FFD6E8]'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${d.is_benar ? 'bg-[#00A3E8] text-white' : 'bg-[#F43F5E] text-white'}`}>
                      {d.is_benar ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                    </div>
                    <p className="font-sans font-bold text-xs text-ink">{soal.question_text}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 pl-8">
                    {!d.is_benar && optUser && (
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-[#F43F5E] shrink-0 mt-0.5">X</span>
                        <span className="text-[11px] text-[#E8508A]">{optUser.option_text}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-[#00A3E8] shrink-0 mt-0.5">✓</span>
                      <span className="text-[11px] text-[#0082BA]">{optBenar?.option_text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {displayList.length === 0 && (
              <div className="text-center py-8 text-ink-muted text-xs">
                Yeay! Tidak ada jawaban yang salah.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/latihan/soal', { replace: true })} fullWidth>
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
