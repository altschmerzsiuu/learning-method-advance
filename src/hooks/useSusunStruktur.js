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

    // FITUR REARRANGE: Jika asal dan tujuan sama, tapi dilempar di atas item lain
    if (sourceContainer === targetContainer) {
      if (activeId !== overId && overId !== targetContainer) {
        const oldIndex = items[sourceContainer].findIndex(i => i.id === activeId);
        const newIndex = items[sourceContainer].findIndex(i => i.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          setItems(prev => {
            const newArray = [...prev[sourceContainer]];
            const [removed] = newArray.splice(oldIndex, 1);
            newArray.splice(newIndex, 0, removed);
            return {
              ...prev,
              [sourceContainer]: newArray
            };
          });
        }
      }
      return;
    }

    // Move normally
    setItems(prev => {
      // 1. Amhapus item dari container asal
      const newSource = prev[sourceContainer].filter(i => i.id !== activeId);
      
      // 2. Tambahkan item ke container tujuan
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
