// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const addXP = useCallback(async (amount) => {
    if (!user || !supabase || !profile) return;

    const newXP = (profile.total_xp || 0) + amount;
    // Simple level logic: every 500 XP = 1 level
    const newLevel = Math.floor(newXP / 500) + 1;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          total_xp: newXP, 
          level: newLevel,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      // Optimistic update
      setProfile(prev => ({ ...prev, total_xp: newXP, level: newLevel }));
    } catch (err) {
      console.error('Error updating XP:', err.message);
    }
  }, [user, profile]);

  return { profile, user, loading, addXP, refresh: fetchProfile };
}
