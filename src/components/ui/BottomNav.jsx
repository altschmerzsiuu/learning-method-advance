// src/components/ui/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Target, Gamepad2, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/beranda',  icon: Home,      label: 'Beranda' },
  { to: '/materi',   icon: BookOpen,  label: 'Materi'  },
  { to: '/latihan',  icon: Target,    label: 'Latihan' },
  { to: '/games',    icon: Gamepad2,  label: 'Games'   },
  { to: '/profil',   icon: User,      label: 'Profil'  },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-card border-t border-border z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center h-[60px]">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? 'text-[#70D6FF]'
                  : 'text-[#94A3B8]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className="transition-all"
                />
                <span
                  className={`text-[10px] font-sans ${isActive ? 'font-[700]' : 'font-[400]'}`}
                >
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
