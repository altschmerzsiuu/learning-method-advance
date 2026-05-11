// src/components/beranda/CarouselBanner.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Trophy, X } from 'lucide-react';

const banners = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #F0FAFF, #B9ECFF)',
    Icon: BookOpen,
    iconColor: '#00A3E8',
    judul: 'Kuasai Teks Eksposisi!',
    sub: 'Mulai dari materi, sampai jago nulis sendiri.',
    cta: 'Mulai Belajar',
    ctaPath: '/materi',
    ctaColor: '#70D6FF',
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #FFF0F6, #FFD6E8)',
    Icon: Gamepad2,
    iconColor: '#E8508A',
    judul: 'Main Think-Tac-Toe!',
    sub: 'Jawab soal, rebut kotak, kalahkan lawan.',
    cta: 'Main Sekarang',
    ctaPath: '/games',
    ctaColor: '#FF70A6',
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #FFFBEB, #FFE9A0)',
    Icon: Trophy,
    iconColor: '#D97706',
    judul: 'Kurikulum & Sumber',
    sub: 'Capaian, Tujuan Pembelajaran, dan Referensi.',
    cta: 'Lihat Detail',
    ctaPath: null, // Kita handle pake modal
    ctaColor: '#FFD670',
  },
];

export default function CarouselBanner() {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Berhenti geser otomatis kalau modal lagi kebuka
    if (showModal) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [showModal]);

  const banner = banners[current];
  const IconComponent = banner.Icon;

  const handleCtaClick = () => {
    if (banner.id === 3) {
      setShowModal(true);
    } else {
      navigate(banner.ctaPath);
    }
  };

  return (
    <>
      <div className="relative w-full h-[140px] px-4 overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full rounded-2xl p-4 flex flex-col justify-between"
            style={{ background: banner.bg }}
          >
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: banner.iconColor + '22' }}>
                <IconComponent size={22} style={{ color: banner.iconColor }} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif font-black text-ink leading-tight">{banner.judul}</h3>
                <p className="font-sans text-[10px] text-ink-muted leading-snug mt-1 max-w-[200px]">
                  {banner.sub}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <button
                onClick={handleCtaClick}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-sm hover:scale-105 transition-transform"
                style={{ backgroundColor: banner.ctaColor }}
              >
                {banner.cta}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-4 bg-primary-300' : 'w-1.5 bg-ink-faint'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Modal untuk CP, TP & Sumber */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay gelap */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            {/* Konten Modal */}
            <motion.div 
              className="relative bg-white w-full max-w-[400px] max-h-[80vh] overflow-y-auto rounded-3xl p-6 shadow-xl z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Tombol Close */}
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-muted hover:bg-border transition-colors"
              >
                <X size={16} className="text-ink" />
              </button>

              <h2 className="font-serif font-black text-lg text-ink mb-6">Informasi Pembelajaran</h2>

              <div className="flex flex-col gap-5 font-sans text-xs text-ink-muted leading-relaxed">
                {/* CP */}
                <div>
                  <h3 className="font-bold text-primary-600 mb-1">1. Capaian Pembelajaran (CP):</h3>
                  <p>Peserta didik mampu memahami isi, gagasan, dan informasi dalam teks eksposisi serta menanggapi isi teks secara kritis.</p>
                </div>

                {/* TP */}
                <div>
                  <h3 className="font-bold text-primary-600 mb-1">2. Tujuan Pembelajaran (TP):</h3>
                  <p>Peserta didik mampu mengidentifikasi informasi, ide pokok, struktur, dan kaidah kebahasaan teks eksposisi serta menyusun teks eksposisi secara logis, sistematis, dan didukung fakta yang relevan.</p>
                </div>

                {/* Sumber */}
                <div>
                  <h3 className="font-bold text-primary-600 mb-1">3. Sumber Belajar:</h3>
                  <ol className="list-decimal list-outside ml-4 flex flex-col gap-2 mt-1">
                    <li>Rahman, T. (2018). Teks Dalam Kajian Struktur dan Kebahasaan. Pilar Nusantara.</li>
                    <li>Lestari Gusfitri, Maya, dan Elly Delfia. 2021. Bahasa Indonesia untuk SMP Kelas VIII. Jakarta: Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi, Badan Standar, Kurikulum, dan Asesmen Pendidikan, Pusat Perbukuan</li>
                    <li>Maelasari, N. (2019). MENULIS TEKS EKSPOSISI DALAM MODEL PEMBELAJARAN MIND MAPPING.</li>
                    <li>Hikmah, Siti Nur Afifatul. 2021. “Pengembangan Instrumen Asesmen Keterampilan Menulis Teks Eksposisi.” Jurnal Tarbiyatuna, No. 1.</li>
                    <li>Tribun Padang. 2025. “50 Contoh Soal Teks Eksposisi Kunci Jawaban Pilihan Ganda dan Esai Lengkap.” Diakses pada 10 Mei 2026</li>
                    <li>Cherylcei. 2024. “Fakta vs Opini.” TikTok.</li>
                    <li>Shewantcoykeren. 2026. “Teks Eksposisi dengan Alasan.” TikTok.</li>
                    <li>Sejarahseru.di. 2023. “Sejarah Bahasa Indonesia.” TikTok.</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
