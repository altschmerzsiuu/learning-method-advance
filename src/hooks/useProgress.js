import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import materiData from '../data/materi.json';

function getInitialProgress() {
  return materiData.reduce((acc, topik, idx) => {
    acc[topik.id] = { status: idx === 0 ? 'active' : 'locked', xp_earned: 0 };
    return acc;
  }, {});
}

export function useProgress() {
  const [progress, setProgress] = useState(getInitialProgress());
  const { user } = useAuth();

  useEffect(() => {
    async function syncProgress() {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (data && !error) {
        const dbProgress = getInitialProgress();
        data.forEach(p => {
          dbProgress[p.topik_id] = { status: p.status, xp_earned: p.xp_earned, completed_at: p.completed_at };
        });
        setProgress(dbProgress);
      }
    }
    syncProgress();
  }, [user]);

  const completeTopik = useCallback(async (topikId) => {
    if (!user) return;

    // 1. Update Current Topik to 'done'
    const sorted = [...materiData].sort((a, b) => a.urutan - b.urutan);
    const idx = sorted.findIndex(t => t.id === topikId);
    
    await supabase.from('user_progress').upsert({
      user_id: user.id,
      topik_id: topikId,
      status: 'done',
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id, topik_id' });

    // 2. Update Next Topik to 'active' if it exists and is locked
    if (sorted[idx + 1]) {
      const nextId = sorted[idx + 1].id;
      // We don't overwrite if it's already done
      const { data } = await supabase.from('user_progress').select('status').eq('user_id', user.id).eq('topik_id', nextId).single();
      if (!data || data.status === 'locked') {
        await supabase.from('user_progress').upsert({
          user_id: user.id,
          topik_id: nextId,
          status: 'active'
        }, { onConflict: 'user_id, topik_id' });
      }
    }

    // Refresh state
    const { data: newData } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
    if (newData) {
      const newP = getInitialProgress();
      newData.forEach(p => { newP[p.topik_id] = { status: p.status, xp_earned: p.xp_earned, completed_at: p.completed_at }; });
      setProgress(newP);
    }

  }, [user]);

  const getTopikStatus = useCallback((id) => progress[id]?.status ?? 'locked', [progress]);
  const getCompletedCount = useCallback(() => Object.values(progress).filter(p => p.status === 'done').length, [progress]);

  return { progress, getTopikStatus, completeTopik, getCompletedCount };
}
