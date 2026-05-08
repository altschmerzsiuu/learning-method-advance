import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [weekDots, setWeekDots] = useState(Array(7).fill({ isActive: false }));

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    
    // We get last 7 days of activity from quiz_results and game_history
    const today = new Date();
    today.setHours(0,0,0,0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const { data: streakDataArray } = await supabase.from('user_streak').select('*').eq('user_id', user.id).limit(1);
    const streakData = streakDataArray && streakDataArray.length > 0 ? streakDataArray[0] : null;

    if (streakData) {
      setStreak(streakData.streak_count || 0);
      setTotalXP(streakData.total_xp || 0);
    }

    // Determine week dots (very simple mock based on streak count for now)
    // A real implementation would query daily activity, but here we just fill based on streak
    const dots = Array(7).fill({ isActive: false });
    const count = Math.min(7, streakData?.streak_count || 0);
    for (let i = 0; i < count; i++) {
      dots[6 - i] = { isActive: true }; // fill from today backwards
    }
    setWeekDots(dots);

  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const level = Math.floor(totalXP / 500) + 1;
  let levelLabel = 'Pemula';
  if (level === 2) levelLabel = 'Pembelajar';
  if (level === 3) levelLabel = 'Bintang';
  if (level === 4) levelLabel = 'On Fire';
  if (level >= 5) levelLabel = 'Master';

  return { streak, totalXP, level, levelLabel, weekDots, refresh: fetchStreak };
}
