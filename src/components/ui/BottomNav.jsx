// src/components/ui/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { Home, Target, BarChart2, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/home',     icon: Home,      label: 'Beranda' },
  { to: '/latihan',  icon: Target,    label: 'Latihan'  },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/profil',   icon: User,      label: 'Profil'   },
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
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? 'text-primary-300'
                  : 'text-ink-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="transition-all"
                />
                <span
                  className={`text-[10px] font-sans ${isActive ? 'font-bold' : 'font-normal'}`}
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
