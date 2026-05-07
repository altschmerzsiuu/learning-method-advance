import { supabase } from './supabase';

// Global event emitter for badges
export const badgeEmitter = new EventTarget();

export function triggerBadgeToast(badge) {
  const event = new CustomEvent('new_badge', { detail: badge });
  badgeEmitter.dispatchEvent(event);
}

export async function checkAndAwardBadges(userId, context) {
  // context: { type: 'quiz_done'|'streak'|'xp'|'game_win'|'topics_done'|'score'|'login', value: number }
  
  const { data: allBadges, error: badgeErr } = await supabase.from('badges').select('*');
  if (badgeErr || !allBadges) return [];

  const { data: userBadges, error: ubadgeErr } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);
  
  if (ubadgeErr || !userBadges) return [];

  const earned = userBadges.map(b => b.badge_id);
  const newBadges = [];

  for (const badge of allBadges) {
    if (earned.includes(badge.id)) continue;
    
    let kondisiStr = badge.kondisi;
    let k;
    try {
      k = typeof kondisiStr === 'string' ? JSON.parse(kondisiStr) : kondisiStr;
    } catch (e) {
      continue;
    }

    if (!k || k.type !== context.type) continue;

    if (context.value >= k.value) {
      const { error: insertErr } = await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id });
      if (!insertErr) {
        newBadges.push(badge);
      }
    }
  }
  
  return newBadges;
}
