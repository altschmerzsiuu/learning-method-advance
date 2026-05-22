// src/components/ui/DesktopSidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Target, Gamepad2, User, HelpCircle, LogOut } from 'lucide-react';
import { triggerTour } from '../../hooks/useOnboarding';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/beranda',  icon: Home,      label: 'Beranda', tourKey: 'beranda' },
  { to: '/materi',   icon: BookOpen,  label: 'Materi',  tourKey: 'materi'  },
  { to: '/latihan',  icon: Target,    label: 'Latihan', tourKey: 'latihan' },
  { to: '/games',    icon: Gamepad2,  label: 'Games',   tourKey: 'games'   },
  { to: '/profil',   icon: User,      label: 'Profil',  tourKey: 'profil'  },
];

export default function DesktopSidebar() {
  const { signOut } = useAuth();

  return (
    <div data-tour="nav" className="w-full h-full bg-surface-card flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src="/fkip-logo.jpeg" alt="FKIP Logo" className="h-6 w-auto object-contain rounded-sm" />
          <div className="font-serif font-black text-xl tracking-tight text-primary-300">explay.</div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label, tourKey }) => (
            <NavLink
              key={to}
              to={to}
              data-tour={tourKey}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-bold'
                    : 'text-[#94A3B8] hover:bg-surface-muted hover:text-ink'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="font-sans">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar: Tour button + Logout + copyright */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={triggerTour}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-ink-muted hover:bg-surface-muted hover:text-ink transition-all w-full text-left cursor-pointer"
          title="Lihat Tutorial"
        >
          <HelpCircle size={18} strokeWidth={1.5} />
          <span className="text-xs font-sans font-medium">Lihat Tutorial</span>
        </button>

        <button
          onClick={signOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all w-full text-left cursor-pointer"
          title="Keluar"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-xs font-sans font-medium">Keluar Akun</span>
        </button>

        <div className="px-3 pt-2 text-[10px] text-ink-faint font-sans border-t border-border mt-2">
          © 2026 explay.
        </div>
      </div>
    </div>
  );
}
