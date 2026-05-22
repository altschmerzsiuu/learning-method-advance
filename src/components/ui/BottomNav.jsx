// src/components/ui/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Target, Gamepad2, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/beranda',  icon: Home,      label: 'Beranda', tourKey: 'beranda' },
  { to: '/materi',   icon: BookOpen,  label: 'Materi',  tourKey: 'materi'  },
  { to: '/latihan',  icon: Target,    label: 'Latihan', tourKey: 'latihan' },
  { to: '/games',    icon: Gamepad2,  label: 'Games',   tourKey: 'games'   },
  { to: '/profil',   icon: User,      label: 'Profil',  tourKey: 'profil'  },
];

export default function BottomNav() {
  return (
    <nav
      data-tour="nav"
      className="sticky bottom-0 left-0 right-0 w-full bg-surface-card border-t border-border z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center h-[60px]">
        {NAV_ITEMS.map(({ to, icon: Icon, label, tourKey }) => (
          <NavLink
            key={to}
            to={to}
            data-tour={tourKey}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-[#70D6FF]' : 'text-[#94A3B8]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={1.5} className="transition-all" />
                <span className={`text-[10px] font-sans ${isActive ? 'font-[700]' : 'font-[400]'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
