import { useState } from 'react';
import { Play } from 'lucide-react';
import ReelModal from './ReelModal';

const reels = [
  { id: 'reel-01', judul: 'Apa itu Teks Eksposisi?', durasi: '0:45' },
  { id: 'reel-02', judul: 'Cara Nulis Tesis',         durasi: '1:02' },
  { id: 'reel-03', judul: 'Tips Argumentasi Kuat',    durasi: '0:38' },
];

export default function ReelsSection() {
  const [activeReel, setActiveReel] = useState(null);

  return (
    <>
      <div className="mb-8 pt-4">
        <h2 className="font-serif font-black text-sm text-ink mb-4 px-4" style={{ padding: '8px' }}>Reels Belajar</h2>
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {reels.map(reel => (
            <div 
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="relative w-[130px] h-[200px] shrink-0 bg-surface-muted rounded-xl overflow-hidden snap-start cursor-pointer group"
            >
              {/* Fallback bg if no poster/video loads */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-secondary opacity-50" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <Play size={20} className="text-white ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-sans font-bold text-[10px] leading-tight mb-1">{reel.judul}</p>
                <div className="flex items-center text-white/80 text-[9px]">
                  <Play size={10} className="mr-1" /> {reel.durasi}
                </div>
              </div>
            </div>
          ))}
          <div className="w-1 shrink-0"></div>
        </div>
      </div>

      <ReelModal 
        isOpen={!!activeReel} 
        onClose={() => setActiveReel(null)} 
        reel={activeReel} 
      />
    </>
  );
}
