// src/components/ui/PageWrapper.jsx
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';
import DesktopStatsPanel from './DesktopStatsPanel';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

/**
 * PageWrapper — responsive shell layout.
 *
 * withNav=false (default) → centered 430px layout (auth, quiz, game)
 * withNav=true            → sidebar kiri + konten + (desktop) panel kanan
 *
 * PENTING: children hanya di-render SEKALI — tidak ada double render.
 * Sidebar dan panel dikontrol via CSS breakpoint, bukan conditional JS render.
 *
 * Mobile (<768px)  : sidebar hidden, konten centered max 430px
 * Tablet (768px+)  : sidebar 200px muncul, konten melebar
 * Desktop (1024px+): sidebar 220px + konten + panel stats 260px
 */
export default function PageWrapper({ children, className = '', withNav = false, bottomNav = false }) {
  // Support prop lama `bottomNav` untuk backwards compat
  const showNav = withNav || bottomNav;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`app-shell ${showNav ? 'app-shell--nav' : 'app-shell--centered'}`}
    >
      {/* ── SIDEBAR (tablet/desktop, hanya jika withNav) ── */}
      {showNav && (
        <aside className="app-sidebar">
          <DesktopSidebar />
        </aside>
      )}

      {/* ── KONTEN UTAMA — render SEKALI saja ──────────── */}
      <div className={`app-content ${showNav ? 'app-content--nav' : 'app-content--centered'}`}>
        <main className={`flex-1 flex flex-col ${className}`}>
          {children}
        </main>
        {/* BottomNav hanya muncul di mobile */}
        {showNav && <BottomNav />}
      </div>

      {/* ── PANEL KANAN (desktop only, hanya jika withNav) */}
      {showNav && (
        <aside className="app-stats">
          <DesktopStatsPanel />
        </aside>
      )}
    </motion.div>
  );
}