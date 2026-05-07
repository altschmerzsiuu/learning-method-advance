import { PageWrapper, TopBar, Card } from '../components/ui';
import { Info, Code, Mail } from 'lucide-react';

export default function TentangScreen() {
  return (
    <PageWrapper>
      <TopBar title="Tentang explay." showBack />

      <div className="container py-6 px-4 flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-4">
            <span className="font-serif font-black text-2xl text-primary-300">e.</span>
          </div>
          <h1 className="font-serif font-black text-2xl text-ink">explay.</h1>
          <p className="font-sans text-xs text-ink-muted mt-1">v1.0.0</p>
        </div>

        <Card className="p-5">
          <h2 className="font-serif font-bold text-sm text-ink mb-2">Apa itu explay?</h2>
          <p className="font-sans text-xs text-ink-muted leading-relaxed mb-4">
            explay (Exposure Play) adalah platform pembelajaran interaktif yang dirancang untuk membantu siswa memahami materi Teks Eksposisi secara menyenangkan melalui gamifikasi.
          </p>
          <div className="bg-[#F0FAFF] border border-[#B9ECFF] rounded-xl p-3 flex gap-3 items-start">
            <Info size={16} className="text-[#00A3E8] shrink-0 mt-0.5" />
            <p className="font-sans text-[10px] text-[#0082BA] leading-relaxed">
              Aplikasi ini dikembangkan sebagai bagian dari penelitian skripsi untuk melihat efektivitas gamifikasi dalam pembelajaran bahasa Indonesia.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-serif font-bold text-sm text-ink mb-4">Kontak Developer</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-ink-muted">
              <Mail size={16} />
              <span className="font-sans text-xs">ara@student.uniba.ac.id</span>
            </div>
            <div className="flex items-center gap-3 text-ink-muted">
              <Code size={16} />
              <span className="font-sans text-xs">github.com/altschmerzsiuu</span>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
