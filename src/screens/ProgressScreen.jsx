// src/screens/ProgressScreen.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, PlayCircle, ChevronRight, Zap } from 'lucide-react';
import { PageWrapper, TopBar, ProgressBar, ConfirmModal } from '../components/ui';
import { useProgress } from '../hooks/useProgress';
import { useStreak }   from '../hooks/useStreak';
import { useAuth }     from '../hooks/useAuth';
import { useProfile }  from '../hooks/useProfile';
import materiData      from '../data/materi.json';

export default function ProgressScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const { progress, getTopikStatus, getCompletedCount } = useProgress();
  const { totalXP, level, levelLabel, nextXP } = useStreak();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const sorted         = [...materiData].sort((a, b) => a.urutan - b.urutan);
  const completedCount = getCompletedCount();

  return (
    <PageWrapper bottomNav>
      <TopBar 
        title="Progress" 
        xp={totalXP} 
        userName={profile?.nama}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Yakin ingin keluar?"
        message="Sesi kamu akan berakhir, tapi semua progres belajar kamu tetap aman kok!"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <div className="px-4 pb-28 pt-5 flex flex-col gap-5">

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
            <p className="font-sans text-[11px] text-primary-600 font-bold uppercase tracking-[0.08em] mb-1">Total XP</p>
            <p className="font-serif text-[28px] font-black text-ink">{totalXP}</p>
          </div>
          <div className="bg-accent-light border border-accent-border rounded-md p-4">
            <p className="font-sans text-[11px] text-accent font-bold uppercase tracking-[0.08em] mb-1">Level</p>
            <p className="font-serif text-[28px] font-black text-ink">{level}</p>
            <p className="font-sans text-[11px] text-ink-muted">{levelLabel}</p>
          </div>
        </div>

        {/* Level progress */}
        {nextXP !== Infinity && (
          <div className="bg-surface-card border border-border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-sans text-[12px] font-bold text-ink">Menuju Level {level + 1}</p>
              <span className="font-sans text-[11px] text-ink-muted">{totalXP}/{nextXP} XP</span>
            </div>
            <ProgressBar value={totalXP} max={nextXP} />
          </div>
        )}

        {/* Timeline */}
        <section>
          <h2 className="font-serif text-[17px] font-bold text-ink mb-4">
            Jalur <span className="italic">Belajar</span>
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-[2px] bg-border" />

            <div className="flex flex-col gap-3">
              {sorted.map((topik, idx) => {
                const status     = getTopikStatus(topik.id);
                const isLocked   = status === 'locked';
                const isDone     = status === 'done';
                const topikProg  = progress[topik.id];

                return (
                  <div key={topik.id} className="flex items-start gap-4">
                    {/* Node */}
                    <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      isDone   ? 'border-primary-300 bg-primary-300' :
                      !isLocked ? 'border-accent bg-white' :
                      'border-border bg-surface-muted'
                    }`}>
                      {isDone    && <CheckCircle2 size={18} strokeWidth={2} className="text-white" />}
                      {!isLocked && !isDone && <PlayCircle size={18} strokeWidth={1.5} className="text-accent" />}
                      {isLocked  && <Lock size={16} strokeWidth={1.5} className="text-ink-faint" />}
                    </div>

                    {/* Card */}
                    <div
                      onClick={() => !isLocked && navigate(`/belajar/${topik.id}`)}
                      className={`flex-1 flex items-center gap-3 p-3.5 rounded-md border transition-all ${
                        isLocked   ? 'border-border bg-surface-muted opacity-60 cursor-not-allowed' :
                        isDone     ? 'border-primary-200 bg-primary-50 cursor-pointer' :
                        'border-border bg-surface-card hover:border-primary-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`font-sans text-[13px] font-bold ${isLocked ? 'text-ink-faint' : 'text-ink'}`}>
                          {topik.judul}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Zap size={10} className="text-accent" />
                          <span className="font-sans text-[11px] text-ink-muted">
                            {isDone ? topikProg?.xp_earned ?? 0 : topik.xp_reward} XP
                          </span>
                        </div>
                      </div>
                      {!isLocked && (
                        <ChevronRight size={16} strokeWidth={1.5} className="text-ink-faint" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
