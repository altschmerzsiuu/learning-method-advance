// src/screens/LatihanScreen.jsx
import { useNavigate } from 'react-router-dom';
import { Target, Sword, ChevronRight, BookOpen } from 'lucide-react';
import { PageWrapper, TopBar, BottomNav, Card } from '../components/ui';
import materiData from '../data/materi.json';
import { useProgress } from '../hooks/useProgress';

export default function LatihanScreen() {
  const navigate = useNavigate();
  const { getTopikStatus } = useProgress();

  const activeTopics = materiData.filter(t => getTopikStatus(t.id) !== 'locked');

  return (
    <PageWrapper>
      <TopBar title="Latihan" />

      <div className="px-4 pb-28 pt-5 flex flex-col gap-5">

        <div>
          <h1 className="font-serif text-[26px] font-black italic text-ink leading-[1.2] mb-1">
            Pilih <span className="not-italic font-black">mode</span> latihan
          </h1>
          <p className="font-sans text-[13px] text-ink-muted">Uji pemahamanmu atau lawan AI dalam duel seru!</p>
        </div>

        {/* Quiz Kilat */}
        <section>
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted mb-2">
            Quiz per Topik
          </h2>
          <div className="flex flex-col gap-2">
            {activeTopics.length === 0 ? (
              <div className="bg-surface-muted rounded-md p-4 text-center">
                <p className="font-sans text-[13px] text-ink-muted">Mulai belajar dulu di tab Belajar!</p>
              </div>
            ) : (
              activeTopics.map(topik => (
                <Card
                  key={topik.id}
                  hoverable
                  onClick={() => navigate(`/quiz/${topik.id}`)}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-md bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
                    <Target size={18} strokeWidth={1.5} className="text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-[13px] font-bold text-ink">{topik.judul}</p>
                    <p className="font-sans text-[11px] text-ink-muted">{topik.xp_reward} XP reward</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-ink-faint" />
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Duel Eksposisi */}
        <section>
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted mb-2">
            Mode Game
          </h2>
          <Card
            hoverable
            onClick={() => navigate('/latihan/think-tac-toe')}
            className="flex items-center gap-4 py-5"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-light border border-accent-border flex items-center justify-center shrink-0">
              <Sword size={22} strokeWidth={1.5} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-sans text-[14px] font-bold text-ink">Duel Eksposisi</p>
              <p className="font-sans text-[12px] text-ink-muted leading-[1.5]">
                Papan Tic-Tac-Toe + soal pilgan. Menang = +100 XP!
              </p>
            </div>
            <ChevronRight size={18} strokeWidth={1.5} className="text-ink-faint" />
          </Card>
        </section>

      </div>

      <BottomNav />
    </PageWrapper>
  );
}
