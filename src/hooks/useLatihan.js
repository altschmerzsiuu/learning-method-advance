import { supabase } from '../lib/supabase';
import { checkAndAwardBadges, triggerBadgeToast } from '../lib/badgeChecker';

export async function getSoalLatihan() {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select(`
        id,
        question_text,
        topik_id,
        tingkat,
        pool,
        options,
        correct_answer,
        quiz_contexts (
          content
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Tidak ada soal tersedia');
    }

    // Filter pool: latihan or both
    const filtered = data.filter(q =>
      !q.pool || q.pool === 'latihan' || q.pool === 'both'
    );
    const pool = filtered.length >= 20 ? filtered : data;

    // Shuffle dan ambil 20
    const selected = shuffleArray(pool).slice(0, 20);

    // Normalize: transform options string-array into answer_options-like objects
    return selected.map(q => {
      const opts = Array.isArray(q.options) ? q.options : [];
      const answer_options = shuffleArray(opts).map((text, i) => ({
        id: `${q.id}_${i}`,
        option_text: text,
        is_correct: text === q.correct_answer,
      }));
      return { ...q, answer_options };
    });
  } catch (err) {
    console.error('getSoalLatihan error:', err);
    throw err;
  }
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function simpanHasilLatihan(userId, jawabanUser, soalList) {
  const totalSoal = soalList.length;
  let benar = 0;

  const detail = soalList.map((soal, i) => {
    // answer_options is now normalized by getSoalLatihan
    const jawabanBenar = soal.answer_options.find(o => o.is_correct);
    const pilihanUser = jawabanUser[i];
    const isBenar = pilihanUser?.id === jawabanBenar?.id;
    if (isBenar) benar++;
    return {
      soal_id: soal.id,
      pilihan_user: pilihanUser?.option_text,
      jawaban_benar: jawabanBenar?.option_text,
      is_benar: isBenar,
    };
  });

  const score = Math.round((benar / totalSoal) * 100);
  const xpEarned = Math.round(score * 0.5); // max 50 XP dari latihan

  // Grade
  const grade =
    score >= 90 ? 'A' :
    score >= 80 ? 'B' :
    score >= 70 ? 'C' :
    score >= 60 ? 'D' : 'E';

  // Insert ke quiz_results
  const { error } = await supabase.from('quiz_results').insert({
    user_id: userId,
    topik_id: null,           // null = latihan umum
    tipe: 'latihan',
    score,
    grade,                    // tambah field ini ke schema
    total_soal: totalSoal,
    soal_benar: benar,        // tambah field ini ke schema
    xp_earned: xpEarned,
    detail_jawaban: detail,   // tambah field jsonb ini ke schema
    created_at: new Date().toISOString(),
  });

  if (error) throw error;

  // Update XP user
  await supabase.rpc('increment_xp', { user_id: userId, amount: xpEarned });

  // Cek badge
  const b1 = await checkAndAwardBadges(userId, { type: 'quiz_done', value: 1 });
  const b2 = await checkAndAwardBadges(userId, { type: 'score', value: score });
  
  const allBadges = [...b1, ...b2];
  allBadges.forEach(b => triggerBadgeToast(b));

  return { score, grade, benar, totalSoal, xpEarned, detail };
}
