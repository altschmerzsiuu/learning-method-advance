import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, LogOut } from 'lucide-react';

export default function TopBar({
  title,
  showBack = false,
  backPath,
  rightElement,
  xp,
  userName,
  onLogout,
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-surface-card border-b border-border h-[56px] flex items-center px-4 gap-2 shadow-sm">
      {/* Left Section: Logo + FKIP always shown; back arrow overlays when showBack */}
      <div className="flex items-center shrink-0">
        {showBack ? (
          <button
            onClick={() => backPath ? navigate(backPath) : navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} strokeWidth={2} className="text-ink" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <img src="/fkip-logo.jpeg" alt="FKIP Logo" className="h-6 w-auto object-contain rounded-sm" />
            <div className="font-serif font-black text-xl tracking-tight text-primary-300">explay.</div>
          </div>
        )}
      </div>

      {/* Middle Section: Halo nickname (main pages) or title (sub pages) */}
      <div className="flex-1 overflow-hidden flex flex-col justify-center items-center">
        {userName ? (
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] uppercase tracking-widest font-bold text-ink-muted">Halo,</span>
            <span className="font-serif font-black text-sm text-ink truncate mt-0.5">{userName}</span>
          </div>
        ) : title ? (
          <h1 className="font-serif font-bold text-sm text-ink truncate">{title}</h1>
        ) : null}
      </div>

      {/* Right Section: XP, Logout, or Custom rightElement */}
      <div className="flex items-center gap-1.5 shrink-0">
        {xp !== undefined && (
          <div className="flex items-center gap-1 bg-accent-light/50 border border-accent-border rounded-full px-2 py-0.5">
            <Zap size={11} strokeWidth={3} className="text-accent" />
            <span className="text-[11px] font-black text-accent font-sans">{xp} XP</span>
          </div>
        )}
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 transition-colors"
            title="Keluar"
          >
            <LogOut size={16} className="text-rose-500" />
          </button>
        )}
        
        {rightElement}
      </div>
    </header>
  );
}
