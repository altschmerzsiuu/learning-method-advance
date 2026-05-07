import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, LogOut } from 'lucide-react';

export default function TopBar({
  title,
  showBack = false,
  rightContent,
  onBack,
  xp,
  userName,
  onLogout,
  logo = false,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-card border-b border-border h-[56px] flex items-center px-4 gap-3 shadow-sm">
      {/* Left Section: Logo or Back */}
      <div className="flex items-center">
        {showBack ? (
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2} className="text-ink" />
          </button>
        ) : logo ? (
          <img src="/logo-fkip.jpg" alt="Logo" className="h-8 w-8 object-contain rounded-sm" />
        ) : null}
      </div>

      {/* Middle Section: User Name or Title */}
      <div className="flex-1 overflow-hidden">
        {userName ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-muted leading-tight">Halo,</span>
            <h1 className="font-serif font-black text-sm text-ink truncate leading-tight -mt-0.5">
              {userName}
            </h1>
          </div>
        ) : title && (
          <h1 className="font-serif font-bold text-sm text-ink truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right Section: XP & Logout */}
      <div className="flex items-center gap-2">
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
        
        {rightContent}
      </div>
    </header>
  );
}
