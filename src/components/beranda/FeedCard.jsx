import { useNavigate } from 'react-router-dom';
import { Lightbulb, Quote } from 'lucide-react';

export default function FeedCard({ item }) {
  const navigate = useNavigate();

  if (item.tipe === 'materi') {
    return (
      <div className="bg-white border border-border rounded-xl p-4 shadow-sm mb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-xl">
            {item.emoji}
          </div>
          <div className="bg-accent-light/50 text-accent font-black text-[10px] px-2 py-1 rounded-full">
            +{item.xp} XP
          </div>
        </div>
        <h3 className="font-serif font-bold text-ink text-sm mb-1">{item.judul}</h3>
        <p className="font-sans text-xs text-ink-muted leading-relaxed mb-4">{item.preview}</p>
        <button 
          onClick={() => navigate(`/materi/${item.topikId}`)}
          className="text-[11px] font-bold text-primary-300 hover:text-primary-400 transition-colors"
        >
          Pelajari →
        </button>
      </div>
    );
  }

  if (item.tipe === 'tips' || item.tipe === 'info') {
    const bgColors = {
      sky: 'bg-[#F0FAFF] border-[#B9ECFF]',
      pink: 'bg-[#FFF0F6] border-[#FFD6E8]',
      gold: 'bg-[#FFFBEB] border-[#FFE9A0]',
    };
    const textColors = {
      sky: 'text-[#00A3E8]',
      pink: 'text-[#F43F5E]',
      gold: 'text-[#D97706]',
    };

    const bgClass = bgColors[item.warna] || bgColors.sky;
    const txtClass = textColors[item.warna] || textColors.sky;

    return (
      <div className={`${bgClass} border rounded-xl p-4 shadow-sm mb-3`}>
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb size={14} className={txtClass} />
          <span className={`text-[10px] font-black uppercase tracking-wider ${txtClass}`}>
            {item.tipe === 'info' ? 'INFO EXPLAY' : 'TIPS'}
          </span>
        </div>
        <h3 className="font-serif font-bold text-ink text-sm mb-1">{item.judul}</h3>
        <p className="font-sans text-xs text-ink-muted leading-relaxed whitespace-pre-line">{item.isi}</p>
      </div>
    );
  }

  if (item.tipe === 'quote') {
    return (
      <div className="bg-gradient-to-br from-surface-muted to-white border border-border rounded-xl p-5 shadow-sm mb-3 relative overflow-hidden">
        <Quote size={40} className="absolute -top-2 -left-2 text-ink-faint opacity-30" />
        <p className="font-serif italic font-bold text-ink text-lg leading-snug relative z-10 mb-3">
          {item.isi}
        </p>
        <p className="font-sans font-bold text-[10px] text-ink-muted text-right relative z-10">
          {item.author}
        </p>
      </div>
    );
  }

  return null;
}
