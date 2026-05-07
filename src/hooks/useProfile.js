import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    
    const [profRes, streakRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_streak').select('*').eq('user_id', userId).single()
    ]);

    if (profRes.data) setProfile(profRes.data);
    if (streakRes.data) setStreak(streakRes.data);
    
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProfile = async (updates) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) throw error;
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const uploadAvatar = async (file) => {
    if (file.size > 2 * 1024 * 1024) throw new Error('Foto maksimal 2MB');
    if (!file.type.startsWith('image/')) throw new Error('Harus berupa gambar');

    const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 400 });
    const ext = file.name.split('.').pop();
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('avatars').upload(path, compressed, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);

    await updateProfile({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() });
    return data.publicUrl;
  };

  return { profile, streak, loading, updateProfile, uploadAvatar, refresh: fetchData };
}
