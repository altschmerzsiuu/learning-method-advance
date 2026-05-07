import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, TopBar, BottomNav, Button } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useProgress } from '../hooks/useProgress';
import { supabase } from '../lib/supabase';
import { Edit2, LogOut, Camera } from 'lucide-react';

export default function ProfilScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, streak, loading: profileLoading } = useProfile(user?.id);
  const { getCompletedCount } = useProgress();
  
  const [badges, setBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState([]);

  useEffect(() => {
    async function loadBadges() {
      if (!user) return;
      const { data: allBadges } = await supabase.from('badges').select('*');
      const { data: uBadges } = await supabase.from('user_badges').select('badge_id').eq('user_id', user.id);
      
      setBadges(allBadges || []);
      setUserBadgeIds((uBadges || []).map(b => b.badge_id));
    }
    loadBadges();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (profileLoading) return <div className="p-6 text-center">Memuat profil...</div>;

  const totalXP = streak?.total_xp || 0;
  const level = Math.floor(totalXP / 500) + 1;
  const streakCount = streak?.streak_count || 0;

  return (
    <PageWrapper bottomNav>
      <TopBar title="Profil" />

      <div className="container py-6 flex flex-col gap-6 px-4">
        
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
            <button
              onClick={() => navigate('/profil/edit')}
              className="absolute bottom-0 right-0 bg-surface-card border border-border rounded-full p-1.5 shadow-none"
            >
              <Camera size={12} className="text-ink" />
            </button>
          </div>
          <h2 className="font-serif font-bold text-xl text-ink leading-none">{profile?.nama || 'Pelajar'}</h2>
          <p className="font-sans text-sm text-ink-muted mt-1">Kelas {profile?.kelas || 'VII'} • {profile?.sekolah || 'Belum diatur'}</p>
          <div className="bg-primary-50 border border-primary-200 text-primary-600 px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase tracking-wide">
            Level {level}
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
          <h3 className="font-serif font-bold text-lg mb-3">Pencapaian</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map(b => {
              const isEarned = userBadgeIds.includes(b.id);
              return (
                <div key={b.id} className={`flex flex-col items-center text-center p-3 rounded-xl border ${isEarned ? 'bg-accent-light border-accent-border' : 'bg-surface-muted border-border grayscale opacity-60'}`}>
                  <span className="text-3xl mb-2">{b.icon}</span>
                  <p className="font-sans text-[10px] font-bold text-ink leading-tight">{b.nama}</p>
                  {!isEarned && <span className="text-[10px] text-ink-muted mt-1">🔒</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Button variant="ghost" fullWidth onClick={() => navigate('/profil/edit')} className="flex gap-2">
            <Edit2 size={16} /> Edit Profil
          </Button>
          <Button variant="danger" fullWidth onClick={handleLogout} className="flex gap-2 bg-rose-50 text-rose-600 border-none hover:bg-rose-100">
            <LogOut size={16} /> Keluar
          </Button>
        </div>

      </div>
    </PageWrapper>
  );
}
