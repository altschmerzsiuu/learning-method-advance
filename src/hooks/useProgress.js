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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function syncProgress() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

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
      setLoading(false);
    }
    syncProgress();
  }, [user]);

  const completeTopik = useCallback(async (topikId) => {
    if (!user) return;

    const sorted = [...materiData].sort((a, b) => a.urutan - b.urutan);
    const idx = sorted.findIndex(t => t.id === topikId);

    // 1. Check if current topik already exists in DB
    const { data: currentData } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('topik_id', topikId);
      
    const existingCurrent = currentData && currentData.length > 0 ? currentData[0] : null;

    if (existingCurrent) {
      await supabase.from('user_progress').update({
        status: 'done',
        completed_at: new Date().toISOString()
      }).eq('id', existingCurrent.id);
    } else {
      await supabase.from('user_progress').insert({
        user_id: user.id,
        topik_id: topikId,
        status: 'done',
        completed_at: new Date().toISOString()
      });
    }

    // 2. Update Next Topik to 'active' if it exists
    if (sorted[idx + 1]) {
      const nextId = sorted[idx + 1].id;
      const { data: nextData } = await supabase
        .from('user_progress')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('topik_id', nextId);
        
      const existingNext = nextData && nextData.length > 0 ? nextData[0] : null;
        
      if (existingNext) {
        if (existingNext.status === 'locked') {
          await supabase.from('user_progress').update({ status: 'active' }).eq('id', existingNext.id);
        }
      } else {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          topik_id: nextId,
          status: 'active'
        });
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

  return { progress, getTopikStatus, completeTopik, getCompletedCount, loading };
}
