import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, TopBar, ConfirmModal } from '../components/ui';
import BadgeItem from '../components/profil/BadgeItem'; 
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useProgress } from '../hooks/useProgress';
import { supabase } from '../lib/supabase';
import { Edit2 } from 'lucide-react';

export default function ProfilScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, streak, loading: profileLoading, error: profileError, refresh } = useProfile(user?.id);
  const { getCompletedCount } = useProgress();
  
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    async function loadBadges() {
      if (!user) return;
      const { data: allB } = await supabase.from('badges').select('*').order('id');
      const { data: uB } = await supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user.id);
      
      setAllBadges(allB || []);
      setUserBadges(uB || []);
    }
    loadBadges();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-[100dvh] bg-surface-bg"><div className="w-8 h-8 border-4 border-primary-300 border-t-transparent rounded-full animate-spin" /></div>;
  if (profileError) return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-surface-bg p-6 text-center gap-4">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </div>
      <h2 className="font-serif font-black text-xl text-ink">Yah, Koneksi Terputus!</h2>
      <p className="font-sans text-sm text-ink-muted">Gagal memuat data profil karena masalah jaringan. Pastikan internetmu stabil lalu coba lagi ya.</p>
      <button onClick={() => refresh()} className="mt-2 px-6 py-3 bg-primary-300 text-white rounded-full font-bold shadow-sm">Coba Lagi</button>
    </div>
  );

  const totalXP = streak?.total_xp || 0;
  const level = Math.floor(totalXP / 500) + 1;
  const streakCount = streak?.streak_count || 0;

  return (
    <PageWrapper bottomNav>
      <TopBar 
        title="Profil" 
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

      {/* pb-32 biar konten paling bawah nggak ketutup menu bawah */}
      <div className="container py-6 pb-32 flex flex-col gap-6 px-4">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="w-[80px] h-[80px] rounded-full border-[3px] border-transparent bg-gradient-to-tr from-primary-300 to-secondary p-0.5 relative mb-3">
            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
          </div>
          <h2 className="font-serif font-bold text-xl text-ink leading-none">{profile?.nama || 'Pelajar'}</h2>
          <p className="font-sans text-sm text-ink-muted mt-1">Kelas {profile?.kelas || 'VII'} • {profile?.sekolah || 'Belum diatur'}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-primary-50 border border-primary-200 text-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Level {level}
            </div>
            <button 
              onClick={() => navigate('/profil/edit')}
              className="p-1.5 bg-surface-muted border border-border rounded-full hover:bg-white transition-colors"
              title="Edit Profil"
            >
              <Edit2 size={12} className="text-ink-muted" />
            </button>
          </div>
        </div>

        {/* StatGrid 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-card border border-border rounded-xl p-4 flex flex-col items-center">
            <p className="font-serif font-black text-2xl text-accent mb-1">{totalXP}</p>
            <p className="font-sans text-xs text-ink-muted">XP Total</p>
          </div>
          <div className="bg-surface-card border border-border rounded-xl p-4 flex flex-col items-center">
            <p className="font-serif font-black text-2xl text-primary-300 mb-1">{level}</p>
            <p className="font-sans text-xs text-ink-muted">Level</p>
          </div>
          <div className="bg-surface-card border border-border rounded-xl p-4 flex flex-col items-center">
            <p className="font-serif font-black text-2xl text-secondary mb-1">{streakCount} 🔥</p>
            <p className="font-sans text-xs text-ink-muted">Streak</p>
          </div>
          <div className="bg-surface-card border border-border rounded-xl p-4 flex flex-col items-center">
            <p className="font-serif font-black text-2xl text-ink mb-1">{getCompletedCount()}</p>
            <p className="font-sans text-xs text-ink-muted">Quiz Selesai</p>
          </div>
        </div>

        {/* BadgeSection */}
        <div>
          <h3 className="font-serif font-bold text-lg mb-1">Pencapaian</h3>
          <p className="text-[11px] text-ink-muted mb-4 italic">Tap badge untuk melihat cara mendapatkannya</p>
          <div className="grid grid-cols-3 gap-3">
            {allBadges.map((badge, index) => {
              const ub = userBadges.find(u => u.badge_id === badge.id);
              return (
                <BadgeItem 
                  key={badge.id}
                  badge={badge}
                  isEarned={!!ub}
                  earnedAt={ub?.earned_at}
                  index={index}
                />
              );
            })}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
