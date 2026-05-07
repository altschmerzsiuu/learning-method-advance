import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, CheckCircle2, Lock, PlayCircle, Flame, Zap, LogOut } from 'lucide-react';
import { PageWrapper, TopBar, BottomNav, Card, Badge, ProgressBar, ConfirmModal } from '../components/ui';
import { useProgress } from '../hooks/useProgress';
import { useStreak }   from '../hooks/useStreak';
import { useAuth }     from '../hooks/useAuth';
import { useProfile }  from '../hooks/useProfile';
import materiData      from '../data/materi.json';

const STATUS_ICON = {
  done:   <CheckCircle2 size={16} strokeWidth={2} className="text-primary-300" />,
  active: <PlayCircle   size={16} strokeWidth={2} className="text-accent" />,
  locked: <Lock         size={16} strokeWidth={1.5} className="text-ink-faint" />,
};

export default function HomeScreen() {
  const navigate             = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const { progress, getTopikStatus, getCompletedCount } = useProgress();
  const { streak, totalXP, level, levelLabel, weekDots } = useStreak();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const sortedMateri = [...materiData].sort((a, b) => a.urutan - b.urutan);
  const completedCount = getCompletedCount();
  const totalCount     = sortedMateri.length;

  return (
    <PageWrapper bottomNav>
      <TopBar 
        logo 
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

        {/* Hero Card */}
        <Card className="bg-primary-300 border-primary-600 text-white p-5 batik-overlay">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <p className="font-sans text-[11px] font-black uppercase tracking-[0.15em] text-white/80 mb-1.5">
                Jalur Belajarmu
              </p>
              <h2 className="font-serif text-[26px] font-black italic leading-[1.15] tracking-tight">
                {completedCount === 0 ? 'Mulai Dari Awal!' : `${completedCount} dari ${totalCount} Selesai`}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <Zap size={14} strokeWidth={2.5} className="text-accent" />
              <span className="font-sans text-[12px] font-black uppercase tracking-wider">Lv {level}</span>
            </div>
          </div>
          <div className="space-y-2">
            <ProgressBar value={completedCount} max={totalCount} className="h-2 [&>div]:bg-white [&>span]:text-white/80 [&>span]:font-bold" />
            <div className="flex justify-between items-center">
              <p className="font-sans text-[12px] font-bold text-white/90">
                {totalCount - completedCount} topik lagi
              </p>
              <p className="font-sans text-[12px] font-bold text-white/70">
                {Math.round((completedCount / totalCount) * 100)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Streak Row */}
        <div className="bg-surface-card border border-border rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame size={18} strokeWidth={1.5} className="text-accent" />
              <span className="font-sans text-[13px] font-bold text-ink">Streak Minggu Ini</span>
            </div>
            <Badge variant="streak">{streak} Hari</Badge>
          </div>
          <div className="flex gap-2">
            {weekDots.map((dot, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-1.5 rounded-full ${dot.isActive ? 'bg-primary-300' : 'bg-border'}`} />
                <span className="font-sans text-[9px] text-ink-faint">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Jalur Belajar */}
        <section>
          <h2 className="font-serif text-[17px] font-bold text-ink mb-3">
            Jalur <span className="italic">Belajar</span>
          </h2>
          <div className="flex flex-col gap-2.5">
            {sortedMateri.map((topik) => {
              const status = getTopikStatus(topik.id);
              const isLocked = status === 'locked';
              const topikProgress = progress[topik.id];

              return (
                <motion.div
                  key={topik.id}
                  whileHover={!isLocked ? { y: -2 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  onClick={() => !isLocked && navigate(`/belajar/${topik.id}`)}
                  className={`flex items-center gap-3.5 p-4 rounded-md border transition-all ${
                    isLocked
                      ? 'border-border bg-surface-muted opacity-60 cursor-not-allowed'
                      : status === 'done'
                      ? 'border-primary-200 bg-primary-50 cursor-pointer'
                      : 'border-border bg-surface-card hover:border-primary-300 cursor-pointer'
                  }`}
                >
                  {/* Number */}
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 font-serif font-black text-[15px] ${
                    status === 'done'   ? 'bg-primary-300 text-white' :
                    status === 'active' ? 'bg-accent text-white' :
                    'bg-border text-ink-faint'
                  }`}>
                    {topik.urutan}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-sans text-[13px] font-bold truncate ${isLocked ? 'text-ink-faint' : 'text-ink'}`}>
                      {topik.judul}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {STATUS_ICON[status]}
                      <span className="font-sans text-[11px] text-ink-muted capitalize">{status}</span>
                      <span className="text-ink-faint">·</span>
                      <Zap size={10} className="text-accent" />
                      <span className="font-sans text-[11px] text-ink-muted">+{topik.xp_reward} XP</span>
                    </div>
                  </div>

                  {!isLocked && (
                    <ChevronRight size={18} strokeWidth={1.5} className="text-ink-faint shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="font-serif text-[17px] font-bold text-ink mb-3">
            Aksi <span className="italic">Cepat</span>
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <Card hoverable onClick={() => navigate('/latihan')} className="text-center py-5">
              <BookOpen size={28} strokeWidth={1.5} className="mx-auto text-primary-300 mb-2" />
              <p className="font-sans text-[13px] font-bold text-ink">Latihan Soal</p>
              <p className="font-sans text-[11px] text-ink-muted mt-0.5">Uji pemahamanmu</p>
            </Card>
            <Card hoverable onClick={() => navigate('/latihan/think-tac-toe')} className="text-center py-5">
              <div className="w-7 h-7 mx-auto mb-2 grid grid-cols-2 gap-0.5">
                {[0,1,2,3].map(i => <div key={i} className={`rounded-sm ${i%2===0?'bg-primary-300':'bg-accent'}`} />)}
              </div>
              <p className="font-sans text-[13px] font-bold text-ink">Think-Tac-Toe</p>
              <p className="font-sans text-[11px] text-ink-muted mt-0.5">Main vs AI / Teman</p>
            </Card>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
