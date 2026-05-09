import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Trophy } from 'lucide-react';

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
    judul: 'Kumpulkan XP & Badge!',
    sub: 'Setiap misi selesai = XP bertambah.',
    cta: 'Lihat Progress',
    ctaPath: '/profil',
    ctaColor: '#FFD670',
  },
];

export default function CarouselBanner() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];
  const IconComponent = banner.Icon;

  return (
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
              onClick={() => navigate(banner.ctaPath)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-sm"
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
  );
}

