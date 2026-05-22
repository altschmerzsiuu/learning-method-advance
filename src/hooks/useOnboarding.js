import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook untuk manajemen onboarding tour.
 * Cek kolom has_seen_tour di tabel profiles.
 * Perlu migration: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_seen_tour BOOLEAN DEFAULT FALSE;
 */
export function useOnboarding() {
  const { user } = useAuth();
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user || checked) return;
    async function checkTour() {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('has_seen_tour')
          .eq('id', user.id)
          .single();

        setChecked(true);
        // Jika kolom belum ada (null) atau false → tampilkan tour
        if (data && !data.has_seen_tour) {
          setShouldAutoStart(true);
        }
      } catch {
        setChecked(true); // Jangan blokir app jika kolom belum ada
      }
    }
    checkTour();
  }, [user, checked]);

  const markTourSeen = useCallback(async () => {
    if (!user) return;
    try {
      await supabase
        .from('profiles')
        .update({ has_seen_tour: true })
        .eq('id', user.id);
    } catch (err) {
      console.warn('Could not mark tour as seen:', err);
    }
  }, [user]);

  return { shouldAutoStart, markTourSeen };
}

/** Trigger tour dari mana saja (misalnya tombol ? di sidebar) */
export const triggerTour = () => {
  window.dispatchEvent(new CustomEvent('explay:start-tour'));
};
