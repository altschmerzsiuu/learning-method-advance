// src/components/ui/TopBar.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

/**
 * TopBar component — EksposiLab Design System
 * Layout: [back/logo] [title center] [right action]
 */
export default function TopBar({
  title,
  showBack = false,
  rightContent,
  onBack,
  xp,
  logo = false,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-card border-b border-border h-[52px] flex items-center px-4 gap-3">
      {/* Left */}
      <div className="flex items-center min-w-[40px]">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-muted transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} strokeWidth={1.5} className="text-ink" />
          </button>
        )}
        {logo && (
          <div className="flex items-center gap-2">
            <img src="/logo-fkip.jpg" alt="Logo FKIP" className="h-8 w-auto object-contain" />
            <span className="font-serif font-black text-lg text-ink italic leading-none">
              explay<span className="text-primary-300">.</span>
            </span>
          </div>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 text-center px-2">
        {title && (
          <h1 className="font-serif font-bold text-[16px] text-ink truncate leading-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center justify-end min-w-[40px]">
        {xp !== undefined && (
          <div className="flex items-center gap-1 bg-accent-light border border-accent-border rounded-full px-2.5 py-1 whitespace-nowrap">
            <Zap size={13} strokeWidth={2.5} className="text-accent" />
            <span className="text-[12px] font-black text-accent font-sans leading-none">{xp} XP</span>
          </div>
        )}
        {rightContent}
      </div>
    </header>
  );
}
