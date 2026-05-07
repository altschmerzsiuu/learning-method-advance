import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PageWrapper, TopBar, Card, ProgressBar, Button } from '../components/ui';
import { Target, Swords, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LatihanScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (user) {
      supabase.from('user_streak').select('total_xp').eq('user_id', user.id).single()
        .then(({ data }) => setXp(data?.total_xp || 0));
    }
  }, [user]);

  return (
    <PageWrapper bottomNav>
      <TopBar title="Latihan" logo xp={xp} />
      
      <div className="container py-5 flex flex-col gap-5">
        
        <section>
          <h2 className="font-serif font-bold text-xl mb-3 flex items-center gap-2">
            <Target size={20} className="text-primary-300" />
            Latihan Mandiri
          </h2>
          <Card
            hoverable
            onClick={() => navigate('/latihan/soal')}
            className="flex items-center gap-4 py-5"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
              <Target size={24} strokeWidth={1.5} className="text-primary-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-sans font-bold text-ink">Latihan Campuran</h3>
              <p className="font-sans text-[11px] text-ink-muted">20 Soal Acak Semua Topik</p>
            </div>
            <div className="bg-accent-light px-3 py-1 rounded-full border border-accent-border">
              <span className="text-[10px] font-bold text-accent">+XP</span>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="font-serif font-bold text-xl mb-3 flex items-center gap-2">
            <Swords size={20} className="text-secondary" />
            Mode Spesial
          </h2>
          <Card
            hoverable
            onClick={() => navigate('/latihan/think-tac-toe')}
            className="flex items-center gap-4 py-5 relative overflow-hidden"
          >
            {/* Dekorasi Background */}
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tl from-secondary-light to-transparent rounded-tl-full opacity-50" />
            
            <div className="w-12 h-12 rounded-lg bg-secondary-light border border-secondary-border flex items-center justify-center shrink-0 relative z-10">
              <Swords size={24} strokeWidth={1.5} className="text-secondary" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-sans font-bold text-ink">Think-Tac-Toe</h3>
              <p className="font-sans text-[11px] text-ink-muted">Main Game Sambil Belajar</p>
            </div>
            <div className="bg-accent-light px-3 py-1 rounded-full border border-accent-border relative z-10">
              <span className="text-[10px] font-bold text-accent">Game</span>
            </div>
          </Card>
        </section>

      </div>
    </PageWrapper>
  );
}
