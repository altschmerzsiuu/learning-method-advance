// src/components/ui/DesktopSidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Target, Gamepad2, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/beranda',  icon: Home,      label: 'Beranda' },
  { to: '/materi',   icon: BookOpen,  label: 'Materi'  },
  { to: '/latihan',  icon: Target,    label: 'Latihan' },
  { to: '/games',    icon: Gamepad2,  label: 'Games'   },
  { to: '/profil',   icon: User,      label: 'Profil'  },
];

export default function DesktopSidebar() {
  return (
    <div className="h-full bg-surface-card flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src="/fkip-logo.jpeg" alt="FKIP Logo" className="h-6 w-auto object-contain rounded-sm" />
          <div className="font-serif font-black text-xl tracking-tight text-primary-300">explay.</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-bold'
                    : 'text-[#94A3B8] hover:bg-surface-muted hover:text-ink'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs font-sans">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="px-2 text-[10px] text-ink-muted font-sans">
        © 2026 explay. PWA
      </div>
    </div>
  );
}
