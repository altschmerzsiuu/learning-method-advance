import { useState } from 'react';
import { Play } from 'lucide-react';
import ReelModal from './ReelModal';

const reels = [
  { 
    id: 'reel-01', 
    judul: 'Fakta vs Opini', 
    durasi: '@cherylcei',
    videoUrl: '/reels/reel-01@cherylcei.mp4',
    sourceUrl: 'https://www.tiktok.com/@cherylcei?_r=1&_t=ZS-96EjODZEj36'
  },
  { 
    id: 'reel-02', 
    judul: 'Sejarah Bahasa Indonesia',         
    durasi: '@sejarahseru',
    videoUrl: '/reels/reel-02@sejarahseru.mp4',
    sourceUrl: 'https://www.tiktok.com/@sejarahseru.id?_r=1&_t=ZS-96EjJNgdPKG'
  },
  { 
    id: 'reel-03', 
    judul: 'Pahami Teks Eksposisi di Sini',    
    durasi: '@shewantcoykeren',
    videoUrl: '/reels/reel-03@shewantcoykeren.mp4',
    sourceUrl: 'https://www.tiktok.com/@shewantcoykeren?_r=1&_t=ZS-96EjHwCPrJk'
  },
];

export default function ReelsSection() {
  const [activeReel, setActiveReel] = useState(null);

  return (
    <>
      <div className="mb-8 pt-4">
        <h2 className="font-serif font-black text-sm text-ink mb-4 px-4" style={{ padding: '8px' }}>Video Pembelajaran</h2>
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {reels.map(reel => (
            <div 
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="relative w-[130px] h-[200px] shrink-0 bg-black rounded-xl overflow-hidden snap-start cursor-pointer group"
            >
              {/* Video Preview (Detik Pertama) */}
              <video 
                src={`${reel.videoUrl}#t=0.1`} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                muted
                playsInline
                preload="metadata"
              />
              
              {/* Overlay dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-all group-hover:scale-110">
                  <Play size={20} className="text-white ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 w-full p-3">
                <p className="text-white font-sans font-bold text-[10px] leading-tight mb-1 line-clamp-2 drop-shadow-md">
                  {reel.judul}
                </p>
                <div className="flex items-center text-white/90 text-[9px] font-medium">
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
