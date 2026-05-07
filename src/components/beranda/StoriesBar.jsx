import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, PenTool, FileText, Search, Edit } from 'lucide-react';

const topiks = [
  { id: 'pengenalan', label: 'Pengenalan', Icon: BookOpen },
  { id: 'struktur',   label: 'Struktur',   Icon: Layers },
  { id: 'kebahasaan', label: 'Bahasa',     Icon: PenTool },
  { id: 'jenis',      label: 'Jenis',      Icon: FileText },
  { id: 'analisis',   label: 'Analisis',   Icon: Search },
  { id: 'menulis',    label: 'Menulis',    Icon: Edit },
];

export default function StoriesBar({ progress = {} }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 px-4 pt-3 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
      {topiks.map(t => {
        const isDone = progress[t.id]?.completed;
        const isActive = progress[t.id]?.unlocked || t.id === 'pengenalan';
        const IconComponent = t.Icon;

        return (
          <div 
            key={t.id} 
            className="flex flex-col items-center gap-1 shrink-0 snap-start cursor-pointer group"
            onClick={() => {
              if (isActive || isDone) {
                navigate(`/materi/${t.id}`);
              }
            }}
          >
            <div className={`p-[2px] rounded-full transition-all ${isDone ? 'bg-success-500' : isActive ? 'bg-gradient-to-tr from-primary-300 to-secondary group-hover:shadow-md' : 'bg-surface-muted'}`}>
              <div className="w-[52px] h-[52px] rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
                <IconComponent size={24} strokeWidth={1.5} className={`${isActive || isDone ? 'text-primary-600' : 'text-ink-faint'}`} />
              </div>
            </div>
            <span className={`text-[9px] font-sans ${isActive || isDone ? 'text-ink font-bold' : 'text-ink-muted'}`}>
              {t.label}
            </span>
          </div>
        );
      })}
      <div className="w-1 shrink-0"></div>
    </div>
  );
}
