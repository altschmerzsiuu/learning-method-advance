import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

export default function BadgeItem({ badge, isEarned, earnedAt, index }) {
  const [showInfo, setShowInfo] = useState(false);

  // Cek posisi kolom (0, 1, atau 2)
  const isRightColumn = index % 3 === 2;
  const isLeftColumn = index % 3 === 0;

  let tooltipStyle = {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    zIndex: 50,
    background: '#0D1B2A',
    color: '#FFFFFF',
    borderRadius: '10px',
    padding: '10px 12px',
    width: '160px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  };

  let arrowStyle = {
    position: 'absolute',
    bottom: '-5px',
    width: '10px',
    height: '10px',
    background: '#0D1B2A',
    borderRadius: '2px',
    rotate: '45deg',
  };

  // Atur perataan berdasarkan kolom
  if (isRightColumn) {
    tooltipStyle.right = '0';
    arrowStyle.right = '12px';
  } else if (isLeftColumn) {
    tooltipStyle.left = '0';
    arrowStyle.left = '12px';
  } else {
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translateX(-50%)';
    arrowStyle.left = '50%';
    arrowStyle.transform = 'translateX(-50%)';
  }

  // Helper: konversi kondisi badge ke teks yang mudah dipahami
  const getCaraMendapat = (kondisi) => {
    if (!kondisi) return 'Selesaikan misi tertentu';
    const { type, value } = kondisi;
    const map = {
      login:       `Login ke explay. untuk pertama kali`,
      quiz_done:   value === 1 ? `Selesaikan 1 sesi quiz` : `Selesaikan ${value} sesi quiz`,
      score:       `Dapatkan nilai ${value} di quiz manapun`,
      streak:      `Login ${value} hari berturut-turut`,
      xp:          `Kumpulkan ${value} XP`,
      game_win:    value === 1 ? `Menangkan 1 game Think-Tac-Toe` : `Menangkan ${value} game`,
      topics_done: `Selesaikan semua ${value} topik materi`,
    };
    return map[type] || 'Selesaikan misi tertentu';
  };

  return (
    <div className="badge-item-wrapper" style={{ position: 'relative' }}>

      {/* Badge Card */}
      <div
        className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
        style={{
          background: isEarned ? '#FFFFFF' : '#F5F5F5',
          border: isEarned ? '1px solid #E8EDF2' : '1px solid #F0F0F0',
          borderRadius: '12px',
          padding: '12px 10px',
          textAlign: 'center',
          position: 'relative',
          filter: isEarned ? 'none' : 'grayscale(100%)',
          opacity: isEarned ? 1 : 0.5,
          cursor: 'pointer',
        }}
        onClick={() => setShowInfo(v => !v)}
      >
        {/* Icon ℹ️ di pojok kanan atas */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            cursor: 'pointer',
            zIndex: 2,
          }}
          onClick={e => { e.stopPropagation(); setShowInfo(v => !v) }}
        >
          <Info
            size={13}
            color={isEarned ? '#94A3B8' : '#CBD5E1'}
          />
        </div>

        {/* Badge Icon/Emoji */}
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>
          {badge.icon}
        </div>

        {/* Nama Badge */}
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          color: isEarned ? '#0D1B2A' : '#94A3B8',
          lineHeight: 1.3,
        }}>
          {badge.nama}
        </div>

        {/* Tanggal dapat (jika sudah earned) */}
        {isEarned && earnedAt && (
          <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '3px' }}>
            {new Date(earnedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>

      {/* Tooltip/Popup Info */}
      <AnimatePresence>
        {showInfo && (
          <>
            {/* Backdrop tap to close */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setShowInfo(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={{ duration: 0.15 }}
              style={tooltipStyle}
            >
              {/* Arrow */}
              <div style={arrowStyle} />

              {/* Nama + deskripsi */}
              <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                {badge.icon} {badge.nama}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.75, lineHeight: 1.5, marginBottom: '6px' }}>
                {badge.deskripsi}
              </div>

              {/* Cara mendapatkan */}
              <div style={{
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                opacity: 0.5,
                marginBottom: '2px',
              }}>
                CARA MENDAPAT
              </div>
              <div style={{ fontSize: '10px', opacity: 0.85, lineHeight: 1.4 }}>
                {getCaraMendapat(badge.kondisi)}
              </div>

              {/* Status */}
              <div style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: isEarned ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                fontSize: '9px',
                fontWeight: 700,
                textAlign: 'center',
                color: isEarned ? '#4ADE80' : 'rgba(255,255,255,0.6)',
              }}>
                {isEarned ? `✓ Didapat ${new Date(earnedAt).toLocaleDateString('id-ID')}` : 'Belum didapat'}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
