import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, PageWrapper, Card, Button } from '../components/ui';

export default function GameSetupScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('solo'); // 'solo' | 'team'
  const [difficulty, setDifficulty] = useState('mudah');
  const [teamX, setTeamX] = useState('');
  const [teamO, setTeamO] = useState('');

  const isFormValid = () => {
    if (mode === 'solo') return teamX.trim().length > 0;
    return teamX.trim().length > 0 && teamO.trim().length > 0;
  };

  const handleStart = () => {
    navigate('/latihan/think-tac-toe/main', {
      state: {
        mode,
        difficulty: mode === 'solo' ? difficulty : 'mudah', // Team mode ignores difficulty
        teamX: teamX || 'Pemain',
        teamO: mode === 'solo' ? 'AI' : teamO || 'Lawan'
      }
    });
  };

  return (
    <PageWrapper>
      <TopBar title="Think-Tac-Toe" onBack={() => navigate('/latihan')} />
      
      <div className="px-4 py-6 flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-[26px] font-black italic text-ink leading-[1.2] mb-1">
            Pilih Mode Bermain
          </h1>
          <p className="font-sans text-[13px] text-ink-muted">Pilih mode yang sesuai untukmu.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Card 
            className={`cursor-pointer transition-all border-2 ${mode === 'solo' ? 'border-primary-500 bg-primary-50/30' : 'border-transparent'}`}
            onClick={() => setMode('solo')}
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-sans font-bold text-base text-ink">Solo vs AI 🤖</h3>
              <p className="font-sans text-xs text-ink-muted">Lawan komputer, buktikan kemampuanmu!</p>
              
              {mode === 'solo' && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDifficulty('mudah'); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${difficulty === 'mudah' ? 'bg-primary-500 text-white' : 'bg-surface-muted text-ink-muted'}`}
                  >
                    Mudah
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDifficulty('susah'); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${difficulty === 'susah' ? 'bg-primary-500 text-white' : 'bg-surface-muted text-ink-muted'}`}
                  >
                    Susah
                  </button>
                </div>
              )}
            </div>
          </Card>

          <Card 
            className={`cursor-pointer transition-all border-2 ${mode === 'team' ? 'border-accent bg-accent-light/30' : 'border-transparent'}`}
            onClick={() => setMode('team')}
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-sans font-bold text-base text-ink">Team Battle ⚔️</h3>
              <p className="font-sans text-xs text-ink-muted">Tantang temanmu! 2 pemain bergantian. Lengkap dengan Skill & Mystery Box.</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink-muted">
            {mode === 'solo' ? 'Nama Kamu' : 'Nama Tim X'}
          </label>
          <input
            type="text"
            value={teamX}
            onChange={(e) => setTeamX(e.target.value)}
            placeholder="Masukkan nama..."
            className="w-full px-4 py-3 bg-surface-card border border-border rounded-xl font-sans text-sm focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>

        {mode === 'team' && (
          <div className="flex flex-col gap-3">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink-muted">
              Nama Tim O
            </label>
            <input
              type="text"
              value={teamO}
              onChange={(e) => setTeamO(e.target.value)}
              placeholder="Masukkan nama lawan..."
              className="w-full px-4 py-3 bg-surface-card border border-border rounded-xl font-sans text-sm focus:border-rose-400 focus:outline-none transition-colors"
            />
          </div>
        )}

        <div className="mt-8">
          <Button fullWidth disabled={!isFormValid()} onClick={handleStart} className="py-4 text-base">
            Mulai Game
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
