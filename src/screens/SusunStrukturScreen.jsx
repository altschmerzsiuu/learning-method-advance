import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { PageWrapper, TopBar, Button, ProgressBar } from '../components/ui';
import ParagrafDrag from '../components/game/susun/ParagrafDrag';
import SlotDrop from '../components/game/susun/SlotDrop';
import { useSusunStruktur } from '../hooks/useSusunStruktur';
import { useAuth } from '../hooks/useAuth';

export default function SusunStrukturScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    soalList,
    currentIdx,
    setCurrentIdx,
    currentSoal,
    items,
    handleDragEnd,
    loading,
    hitungScore,
    simpanHasil
  } = useSusunStruktur();

  const [hasChecked, setHasChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleCekJawaban = async () => {
    setHasChecked(true);
    
    // Auto next after 2 seconds
    setTimeout(async () => {
      if (currentIdx < soalList.length - 1) {
        setHasChecked(false);
        setCurrentIdx(prev => prev + 1);
      } else {
        // Game Over - Save
        setSaving(true);
        const { score, xp, benar, total, items: finalItems } = hitungScore();
        
        await simpanHasil(user?.id, score, xp, benar, total);
        
        navigate('/games/susun-struktur/hasil', {
          replace: true,
          state: { score, xp, benar, total, finalItems }
        });
      }
    }, 2000);
  };

  const getStatus = (item) => {
    if (!hasChecked) return 'active';
    
    // Determine which container this item is in right now
    let currentContainer = '';
    for (const key in items) {
      if (items[key].find(i => i.id === item.id)) {
        currentContainer = key;
        break;
      }
    }

    if (currentContainer === 'pool') return 'wrong'; // Left in pool is wrong
    return item.struktur_benar === currentContainer ? 'correct' : 'wrong';
  };

  if (loading || saving) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allPlaced = items.pool.length === 0;

  return (
    <PageWrapper>
      <TopBar title="Susun Struktur" showBack backPath="/games" />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="container py-4 px-4 flex flex-col min-h-[calc(100dvh-56px)] pb-24">
          
          {/* Header */}
          <div className="mb-4">
            <h2 className="font-serif font-black text-ink mb-1">{currentSoal?.judul}</h2>
            <p className="font-sans text-[10px] text-ink-muted">Soal {currentIdx + 1} dari {soalList.length}</p>
            <ProgressBar value={(currentIdx / soalList.length) * 100} className="mt-2" />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            
            {/* Slot Area */}
            <div className="flex flex-col gap-3">
              <SlotDrop id="tesis" label="Tesis" colorClass="tesis">
                {items.tesis.map(p => (
                  <ParagrafDrag key={p.id} id={p.id} teks={p.teks} status={getStatus(p)} />
                ))}
              </SlotDrop>
              
              <SlotDrop id="argumentasi" label="Argumentasi" colorClass="argumentasi">
                {items.argumentasi.map(p => (
                  <ParagrafDrag key={p.id} id={p.id} teks={p.teks} status={getStatus(p)} />
                ))}
              </SlotDrop>
              
              <SlotDrop id="penegasan" label="Penegasan Ulang" colorClass="penegasan">
                {items.penegasan.map(p => (
                  <ParagrafDrag key={p.id} id={p.id} teks={p.teks} status={getStatus(p)} />
                ))}
              </SlotDrop>
            </div>

            {/* Paragraf Pool Area */}
            {items.pool.length > 0 && (
              <div>
                <h3 className="font-sans font-bold text-xs text-ink-muted mb-3 uppercase tracking-wider">
                  Pilihan Paragraf
                </h3>
                <SlotDrop id="pool" label="" colorClass="pool">
                  {items.pool.map(p => (
                    <ParagrafDrag key={p.id} id={p.id} teks={p.teks} status={getStatus(p)} />
                  ))}
                </SlotDrop>
              </div>
            )}

          </div>

          {/* Cek Tombol */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-white border-t border-border z-40">
            {hasChecked ? (
              <Button fullWidth disabled className="bg-surface-muted text-ink-muted border-none">
                Menilai...
              </Button>
            ) : (
              <Button 
                fullWidth 
                onClick={handleCekJawaban} 
                disabled={!allPlaced}
                className={allPlaced ? 'bg-secondary hover:bg-secondary-dark border-none text-white' : ''}
              >
                Cek Jawaban
              </Button>
            )}
          </div>

        </div>
      </DndContext>
    </PageWrapper>
  );
}
