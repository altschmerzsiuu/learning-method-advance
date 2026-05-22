// src/components/ui/DesktopStatsPanel.jsx
import { useProfile } from '../../hooks/useProfile';
import { useStreak } from '../../hooks/useStreak';
import { useAuth } from '../../hooks/useAuth';
import { Zap } from 'lucide-react';

export default function DesktopStatsPanel() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { streak, totalXP } = useStreak();

  const streakDays = streak || 0;

  return (
    <div className="h-full bg-surface-card py-6 px-6 flex flex-col gap-6">
      <h2 className="font-serif font-black text-sm text-ink mb-2">Progres Belajar</h2>

      {/* Profile Section */}
      <div className="flex items-center gap-3 bg-surface-muted p-3 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
          {profile?.nama?.charAt(0) || user?.email?.charAt(0) || 'P'}
        </div>
        <div>
          <div className="font-sans font-bold text-xs text-ink">{profile?.nama || 'Pelajar'}</div>
          <div className="text-[10px] text-ink-muted">Siswa Kelas VIII</div>
        </div>
      </div>

      {/* Streak Section */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🔥</span>
          <div className="font-sans font-black text-sm text-orange-600">{streakDays} Hari Membara</div>
        </div>
        <p className="text-[10px] text-orange-600/80 font-sans">Jangan biarkan apimu padam! Belajar setiap hari.</p>
      </div>

      {/* XP Section */}
      <div className="bg-surface-muted p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Zap size={12} strokeWidth={3} className="text-accent" />
            <span className="font-sans font-bold text-xs text-ink">Total XP</span>
          </div>
          <span className="font-sans font-black text-xs text-accent">{totalXP}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-accent transition-all duration-500" 
            style={{ width: `${Math.min((totalXP / 1000) * 100, 100)}%` }}
          />
        </div>
        <div className="text-[9px] text-ink-muted mt-1 text-right">Target: 1000 XP</div>
      </div>
    </div>
  );
}
