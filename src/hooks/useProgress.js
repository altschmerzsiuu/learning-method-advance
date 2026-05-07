// src/hooks/useProgress.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import materiData from '../data/materi.json';

const STORAGE_KEY = 'eksposilab_progress';

function getLocalProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return materiData.reduce((acc, topik, idx) => {
    acc[topik.id] = { status: idx === 0 ? 'active' : 'locked', xp_earned: 0 };
    return acc;
  }, {});
}

export function useProgress() {
  const [progress, setProgress] = useState(getLocalProgress);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // Sync with Supabase on load
  useEffect(() => {
    async function syncProgress() {
      if (!user || !supabase) return;

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id);

      if (data && !error) {
        const dbProgress = { ...getLocalProgress() };
        data.forEach(p => {
          dbProgress[p.topik_id] = { status: 'done', xp_earned: 0, completed_at: p.completed_at };
        });
        
        // Unlock next topics based on what's done
        const sorted = [...materiData].sort((a, b) => a.urutan - b.urutan);
        sorted.forEach((t, i) => {
          if (dbProgress[t.id]?.status === 'done' && sorted[i+1]) {
            const nextId = sorted[i+1].id;
            if (dbProgress[nextId].status === 'locked') dbProgress[nextId].status = 'active';
          }
        });

        setProgress(dbProgress);
      }
    }
    syncProgress();
  }, [user]);

  const completeTopik = useCallback(async (topikId, xpEarned = 0) => {
    // 1. Update Local
    setProgress(prev => {
      const updated = { ...prev };
      updated[topikId] = { ...updated[topikId], status: 'done', completed_at: new Date().toISOString() };
      const sorted = [...materiData].sort((a, b) => a.urutan - b.urutan);
      const idx = sorted.findIndex(t => t.id === topikId);
      if (sorted[idx + 1] && updated[sorted[idx + 1].id]?.status === 'locked') {
        updated[sorted[idx + 1].id].status = 'active';
      }
      return updated;
    });

    // 2. Update Supabase
    if (user && supabase) {
      await supabase.from('progress').upsert({
        user_id: user.id,
        topik_id: topikId,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id, topik_id' });
    }
  }, [user]);

  const getTopikStatus = useCallback((id) => progress[id]?.status ?? 'locked', [progress]);
  const getTotalXP = useCallback(() => Object.values(progress).reduce((s, p) => s + (p.xp_earned || 0), 0), [progress]);
  const getCompletedCount = useCallback(() => Object.values(progress).filter(p => p.status === 'done').length, [progress]);

  return { progress, getTopikStatus, completeTopik, getTotalXP, getCompletedCount };
}
