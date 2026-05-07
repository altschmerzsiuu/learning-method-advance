import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PageWrapper, TopBar, Card, ProgressBar, Button } from '../components/ui';
import { Target, FileText, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { useProfile } from '../hooks/useProfile';

export default function LatihanScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { progress } = useProgress(user?.id);
  const { streak } = useStreak(user?.id);
  const { profile } = useProfile(user?.id);
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);

  const topikIds = ['pengenalan', 'struktur', 'kebahasaan', 'jenis', 'analisis', 'menulis'];
  const doneCount = topikIds.filter(id => progress[id]?.completed).length;
  const isUnlocked = doneCount >= 3;

  useEffect(() => {
    async function loadRiwayat() {
      if (!user) return;
      setLoadingRiwayat(true);
      // Hanya select kolom yang pasti ada di DB
      const { data, error } = await supabase
        .from('quiz_results')
        .select('id, created_at, score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setRiwayat(data);
      } else if (error) {
        console.warn('Riwayat latihan tidak dapat dimuat:', error?.message);
        setRiwayat([]);
      }
      setLoadingRiwayat(false);
    }
    loadRiwayat();
  }, [user]);

  return (
    <PageWrapper bottomNav>
      <TopBar 
        xp={streak?.total_xp || 0}
        userName={profile?.nama || user?.email?.split('@')[0] || 'Pelajar'}
        onLogout={signOut}
      />
      
      <div className="container py-6 pb-24 px-4 flex flex-col gap-6">
        
        {!isUnlocked ? (
          <Card className="p-5 bg-[#FFFBEB] border border-[#FFE9A0]">
            <div className="flex items-center gap-2 text-[#D97706] mb-2">
              <Lock size={18} />
              <h2 className="font-serif font-black text-sm">Latihan Terkunci</h2>
            </div>
            <p className="font-sans text-xs text-ink-muted mb-4">
              Selesaikan minimal <strong>3 topik materi</strong> dulu untuk membuka latihan soal!
            </p>
            <ProgressBar value={doneCount} max={3} className="mb-4" />
            <p className="font-sans text-[10px] text-ink-muted mb-4">{doneCount}/3 topik selesai</p>
            <Button onClick={() => navigate('/materi')} fullWidth className="border-none text-white shadow-sm" style={{background:'#FFD670'}}>
              Ke Materi <ChevronRight size={16} className="ml-1" />
            </Button>
          </Card>
        ) : (
          <Card className="p-5 border-primary-200 bg-primary-50 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Target size={100} />
            </div>
            <h2 className="font-serif font-black text-lg text-primary-600 mb-1 relative z-10">
              20 Soal Pilihan Ganda
            </h2>
            <p className="font-sans text-xs text-ink-muted mb-4 relative z-10 max-w-[80%]">
              Campuran semua topik · Dinilai & disimpan
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent-light px-2 py-1 rounded-md mb-5 relative z-10">
              <FileText size={12} /> Nilai masuk rekap
            </div>
            <Button onClick={() => navigate('/latihan/soal')} fullWidth className="relative z-10 shadow-sm">
              Mulai Latihan <ChevronRight size={16} className="ml-1" />
            </Button>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          <h3 className="font-serif font-bold text-sm text-ink flex items-center gap-2">
            Riwayat Latihan
          </h3>
          
          {loadingRiwayat ? (
            <div className="text-center text-xs text-ink-muted py-4">Memuat riwayat...</div>
          ) : riwayat.length === 0 ? (
            <div className="text-center text-xs text-ink-muted py-8 bg-surface-muted rounded-xl border border-border border-dashed">
              Belum ada riwayat latihan.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {riwayat.map((r, i) => {
                const date = new Date(r.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                return (
                  <div key={r.id} className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-sans font-bold text-xs text-ink">Latihan ke-{riwayat.length - i}</p>
                      <p className="font-sans text-[10px] text-ink-muted">{date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-black text-lg text-ink">{r.score ?? '–'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </PageWrapper>
  );
}
