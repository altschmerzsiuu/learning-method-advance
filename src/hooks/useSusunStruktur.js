import { useState, useEffect } from 'react';
import susunData from '../data/susun-struktur.json';
import { supabase } from '../lib/supabase';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function useSusunStruktur() {
  const [soalList, setSoalList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // DND state for current soal
  const [items, setItems] = useState({
    pool: [],
    tesis: [],
    argumentasi: [],
    penegasan: []
  });

  useEffect(() => {
    // Ambil 3 soal acak
    const shuffled = shuffleArray([...susunData]).slice(0, 3);
    setSoalList(shuffled);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (soalList.length > 0 && currentIdx < soalList.length) {
      const currentSoal = soalList[currentIdx];
      setItems({
        pool: shuffleArray([...currentSoal.paragraf]),
        tesis: [],
        argumentasi: [],
        penegasan: []
      });
    }
  }, [currentIdx, soalList]);

  const currentSoal = soalList[currentIdx];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Cari letak item asal
    let sourceContainer;
    let activeItem;
    
    for (const key in items) {
      const found = items[key].find(item => item.id === activeId);
      if (found) {
        sourceContainer = key;
        activeItem = found;
        break;
      }
    }

    if (!sourceContainer) return;

    let targetContainer = overId;
    if (['tesis', 'argumentasi', 'penegasan', 'pool'].includes(overId)) {
      targetContainer = overId;
    } else {
      for (const key in items) {
        if (items[key].find(item => item.id === overId)) {
          targetContainer = key;
          break;
        }
      }
    }

    // FIX: Jika asal dan tujuan sama, jangan lakukan apa-apa (mencegah duplikasi)
    if (sourceContainer === targetContainer) return;

    // Hanya argumentasi dan pool yang boleh berisi lebih dari 1
    if (targetContainer === 'tesis' && items.tesis.length >= 1 && sourceContainer !== 'tesis') {
      // Pindahkan item yg ada di tesis balik ke pool
      const existing = items.tesis[0];
      setItems(prev => ({
        ...prev,
        tesis: [activeItem],
        [sourceContainer]: prev[sourceContainer].filter(i => i.id !== activeId),
        pool: [...prev.pool, existing]
      }));
      return;
    }

    if (targetContainer === 'penegasan' && items.penegasan.length >= 1 && sourceContainer !== 'penegasan') {
      const existing = items.penegasan[0];
      setItems(prev => ({
        ...prev,
        penegasan: [activeItem],
        [sourceContainer]: prev[sourceContainer].filter(i => i.id !== activeId),
        pool: [...prev.pool, existing]
      }));
      return;
    }

    // Move normally
    setItems(prev => {
      const newSource = prev[sourceContainer].filter(i => i.id !== activeId);
      const newTarget = [...prev[targetContainer], activeItem];
      return {
        ...prev,
        [sourceContainer]: newSource,
        [targetContainer]: newTarget
      };
    });
  };

  const hitungScore = () => {
    let benar = 0;
    const total = currentSoal.paragraf.length;
    
    const cekBenar = (container, label) => {
      items[container].forEach(p => {
        if (p.struktur_benar === label) benar++;
      });
    };

    cekBenar('tesis', 'tesis');
    cekBenar('argumentasi', 'argumentasi');
    cekBenar('penegasan', 'penegasan');

    const score = Math.round((benar / total) * 100);
    const xp = score === 100 ? 60 : score >= 75 ? 40 : score >= 50 ? 20 : 5;

    return { score, benar, total, xp, items };
  };

  const simpanHasil = async (userId, score, xp, benar, total) => {
    if (!userId) return;
    try {
      await supabase.from('game_history').insert({
        user_id: userId,
        mode: 'susun_struktur',
        result: score >= 75 ? 'menang' : 'kalah',
        xp_earned: xp,
        soal_benar: benar,
        soal_total: total,
      });
      await supabase.rpc('increment_xp', { user_id: userId, amount: xp });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    soalList,
    currentIdx,
    setCurrentIdx,
    currentSoal,
    items,
    handleDragEnd,
    loading,
    hitungScore,
    simpanHasil
  };
}
