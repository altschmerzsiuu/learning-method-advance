import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PageWrapper, TopBar, Card, ProgressBar, Button, ConfirmModal } from '../components/ui';
import { Target, Swords, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useStreak } from '../hooks/useStreak';

export default function LatihanScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const { totalXP: xp } = useStreak();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <PageWrapper bottomNav>
      <TopBar 
        title="Latihan" 
        logo 
        xp={xp} 
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
      
      <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
        
        <section>
          <h2 className="font-serif font-bold text-base mb-2 flex items-center gap-2 text-ink">
            <Target size={16} className="text-primary-300" />
            Latihan Mandiri
          </h2>
          <Card
            hoverable
            onClick={() => navigate('/latihan/soal')}
            className="flex items-center gap-3 py-3 px-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
              <Target size={20} strokeWidth={2} className="text-primary-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-sans font-bold text-sm text-ink">Latihan Campuran</h3>
              <p className="font-sans text-[10px] text-ink-muted">20 Soal Acak Semua Topik</p>
            </div>
            <div className="bg-accent-light px-2 py-0.5 rounded-full border border-accent-border">
              <span className="text-[9px] font-bold text-accent">+XP</span>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="font-serif font-bold text-base mb-2 flex items-center gap-2 text-ink">
            <Swords size={16} className="text-secondary" />
            Mode Spesial
          </h2>
          <Card
            hoverable
            onClick={() => navigate('/latihan/think-tac-toe')}
            className="flex items-center gap-3 py-3 px-4 relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 w-16 h-16 bg-gradient-to-tl from-secondary-light to-transparent rounded-tl-full opacity-30" />
            
            <div className="w-10 h-10 rounded-lg bg-secondary-light border border-secondary-border flex items-center justify-center shrink-0 relative z-10">
              <Swords size={20} strokeWidth={2} className="text-secondary" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-sans font-bold text-sm text-ink">Think-Tac-Toe</h3>
              <p className="font-sans text-[10px] text-ink-muted">Main Game Sambil Belajar</p>
            </div>
            <div className="bg-accent-light px-2 py-0.5 rounded-full border border-accent-border relative z-10">
              <span className="text-[9px] font-bold text-accent">Game</span>
            </div>
          </Card>
        </section>

      </div>
    </PageWrapper>
  );
}
