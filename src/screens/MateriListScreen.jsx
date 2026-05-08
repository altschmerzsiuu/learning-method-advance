import { useNavigate } from 'react-router-dom';
import { PageWrapper, TopBar, ProgressBar } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import materiData from '../data/materi.json';
import { useProfile } from '../hooks/useProfile';
import { Lock, CheckCircle2, ChevronRight, BookOpen, Layers, PenTool, FileText, Search, Edit } from 'lucide-react';

const TOPIK_ICONS = {
  pengenalan: BookOpen,
  struktur: Layers,
  kebahasaan: PenTool,
  jenis: FileText,
  analisis: Search,
  menulis: Edit,
};

export default function MateriListScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { progress, loading } = useProgress(user?.id);
  const { streak } = useStreak(user?.id);
  const { profile } = useProfile(user?.id);

  if (loading) return <div className="p-6 text-center text-ink-muted">Memuat...</div>;

  const totalCompleted = materiData.filter(m => progress[m.id]?.status === 'done').length;

  return (
    <PageWrapper bottomNav>
      <TopBar xp={streak?.total_xp || 0} onLogout={signOut} userName={profile?.nama || user?.email?.split('@')[0] || 'Pelajar'} />

      <div className="container py-6 pb-24 px-4 flex flex-col gap-6">
        
        {/* Progress Header */}
        <div className="bg-gradient-to-br from-[#F0FAFF] to-[#B9ECFF] border border-[#B9ECFF] rounded-2xl p-5 shadow-sm">
          <h2 className="font-serif font-black text-lg text-ink mb-1">Perjalanan Belajarmu</h2>
          <p className="font-sans text-[11px] text-ink-muted leading-relaxed mb-4">
            Selesaikan semua topik untuk jadi ahli teks eksposisi!
          </p>
          <div className="flex items-center gap-3">
            <ProgressBar value={totalCompleted} max={6} className="flex-1" />
            <span className="text-xs font-black text-primary-300">{totalCompleted}/6</span>
          </div>
        </div>

        {/* Topik List */}
        <div className="flex flex-col gap-3">
          {materiData.map((topik, index) => {
            const isDone = progress[topik.id]?.status === 'done';
            const isUnlocked = progress[topik.id]?.status === 'active' || progress[topik.id]?.status === 'done';
            
            return (
              <button
                key={topik.id}
                onClick={() => isUnlocked && navigate(`/materi/${topik.id}`)}
                disabled={!isUnlocked}
                className={`relative overflow-hidden text-left bg-white border border-border rounded-2xl p-4 flex items-center gap-4 transition-all
                  ${!isUnlocked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-primary-200 hover:shadow-sm'}
                `}
              >
                {/* Nomor besar */}
                <div className={`font-serif font-black text-4xl w-8 text-center
                  ${isDone ? 'text-success-500/20' : isUnlocked ? 'text-primary-300/20' : 'text-ink-muted/10'}
                `}>
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const TopikIcon = TOPIK_ICONS[topik.id];
                      return TopikIcon ? (
                        <div className={`w-6 h-6 flex items-center justify-center rounded-md ${isDone ? 'text-success-500' : isUnlocked ? 'text-primary-500' : 'text-ink-faint'}`}>
                          <TopikIcon size={16} strokeWidth={1.5} />
                        </div>
                      ) : null;
                    })()}
                    <h3 className="font-serif font-bold text-sm text-ink">{topik.judul}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-success-500 bg-success-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} /> Selesai
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-ink-muted bg-surface-muted px-2 py-0.5 rounded-full">
                        <Lock size={10} /> Terkunci
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-primary-300 bg-primary-50 px-2 py-0.5 rounded-full">
                        Mulai Belajar
                      </span>
                    )}
                    
                    <span className="text-[10px] font-bold text-accent">+{topik.xp_reward || 80} XP</span>
                  </div>
                </div>

                {isUnlocked && <ChevronRight size={20} className="text-ink-muted" />}
              </button>
            );
          })}
        </div>

      </div>
    </PageWrapper>
  );
}
