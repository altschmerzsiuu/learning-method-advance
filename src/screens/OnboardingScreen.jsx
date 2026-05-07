import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, Button } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    emoji: '👋',
    title: 'Selamat Datang di explay!',
    desc: 'Platform belajar asik buat kamu yang mau jago bikin teks eksposisi.',
    bg: 'bg-[#F0FAFF]',
    color: 'text-[#00A3E8]'
  },
  {
    emoji: '📖',
    title: 'Materi Seru & Ringkas',
    desc: 'Baca materi tanpa bosen. Tersedia 6 topik yang bikin kamu paham sampai akar.',
    bg: 'bg-[#FFF0F6]',
    color: 'text-[#E8508A]'
  },
  {
    emoji: '🎮',
    title: 'Belajar Sambil Main',
    desc: 'Bosen baca? Ayo latih ingatanmu lewat game Think-Tac-Toe dan Susun Struktur.',
    bg: 'bg-[#FFFBEB]',
    color: 'text-[#E8B800]'
  },
  {
    emoji: '🏆',
    title: 'Kumpulkan XP!',
    desc: 'Setiap misi yang kamu selesaikan akan berbuah manis. Kumpulkan XP dan pamerkan pencapaianmu.',
    bg: 'bg-[#F5F5F5]',
    color: 'text-[#64748B]'
  }
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      navigate('/beranda', { replace: true });
    }
  };

  const slide = slides[current];

  return (
    <PageWrapper className={slide.bg + " transition-colors duration-500"}>
      <div className="flex flex-col min-h-[100dvh] px-6 py-12">
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="text-8xl mb-8 drop-shadow-sm">{slide.emoji}</div>
              <h1 className={`font-serif font-black text-2xl mb-4 ${slide.color}`}>
                {slide.title}
              </h1>
              <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-[280px]">
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-6 mt-auto">
          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? `w-6 ${slide.color.replace('text-', 'bg-')}` : 'w-2 bg-ink-faint'
                }`} 
              />
            ))}
          </div>

          <Button 
            onClick={handleNext} 
            fullWidth 
            className={`shadow-sm border-none ${slide.color.replace('text-', 'bg-').replace('00A', '1AB').replace('E85', 'F43').replace('E8B', 'F59').replace('647', '334')} text-white hover:opacity-90`}
          >
            {current === slides.length - 1 ? 'Mulai Belajar' : 'Lanjut'}
          </Button>
        </div>

      </div>
    </PageWrapper>
  );
}
