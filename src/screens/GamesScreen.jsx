import { useNavigate } from 'react-router-dom';
import { PageWrapper, TopBar, Card, Button } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { ChevronRight, Swords, Puzzle, Gamepad2 } from 'lucide-react';

export default function GamesScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);

  return (
    <PageWrapper withNav>
      <TopBar onLogout={signOut} userName={profile?.nama || user?.email?.split('@')[0] || 'Pelajar'} />

      <div className="container py-6 pb-24 px-4 flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="font-serif font-black italic text-2xl text-ink mb-1">Arena Bermain</h1>
          <p className="font-sans text-xs text-ink-muted">Belajar sambil main, makin paham makin seru!</p>
        </div>

        {/* Game Cards */}
        <div className="flex flex-col gap-4">
          
          {/* Card 1: Think-Tac-Toe */}
          <Card className="p-5 border-primary-200 bg-[#F0FAFF] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Swords size={100} className="text-primary-600" />
            </div>
            <div className="mb-3 relative z-10 text-primary-500">
              <Gamepad2 size={40} />
            </div>
            <h2 className="font-serif font-black text-lg text-primary-600 mb-1 relative z-10">
              Think-Tac-Toe
            </h2>
            <p className="font-sans text-xs text-ink-muted mb-4 relative z-10 max-w-[85%]">
              Jawab soal, rebut kotak, kalahkan lawan atau AI!
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-500 bg-white border border-primary-100 px-2 py-1 rounded-md mb-5 relative z-10">
              Solo vs AI · Team Battle
            </div>
            <Button 
              onClick={() => navigate('/games/think-tac-toe/setup')} 
              fullWidth 
              className="bg-primary-300 hover:bg-primary-400 text-white border-none shadow-sm relative z-10"
            >
              Main <ChevronRight size={16} className="ml-1" />
            </Button>
          </Card>

          {/* Card 2: Susun Struktur */}
          <Card className="p-5 border-secondary-border bg-[#FFF0F6] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Puzzle size={100} className="text-secondary-dark" />
            </div>
            <div className="mb-3 relative z-10 text-secondary-dark">
              <Puzzle size={40} />
            </div>
            <h2 className="font-serif font-black text-lg text-secondary-dark mb-1 relative z-10">
              Susun Struktur
            </h2>
            <p className="font-sans text-xs text-ink-muted mb-4 relative z-10 max-w-[85%]">
              Drag & drop paragraf ke slot Tesis, Argumentasi, atau Penegasan Ulang!
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary-dark bg-white border border-secondary-light px-2 py-1 rounded-md mb-5 relative z-10">
              Drag & Drop
            </div>
            <Button 
              onClick={() => navigate('/games/susun-struktur')} 
              fullWidth 
              className="bg-secondary hover:bg-secondary-dark text-white border-none shadow-sm relative z-10"
            >
              Main <ChevronRight size={16} className="ml-1" />
            </Button>
          </Card>

        </div>
        
      </div>
    </PageWrapper>
  );
}
