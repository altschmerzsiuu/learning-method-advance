import { supabase } from './supabase';

/**
 * Helper untuk mengacak urutan array (Fisher-Yates Shuffle)
 */
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

/**
 * 1. Ambil soal untuk Quiz Materi (Pool: 'materi')
 * Mengambil 5 soal untuk topik tertentu
 */
export const getMateriQuiz = async (topikId) => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select(`
        *,
        quiz_contexts (id, title, content),
        answer_options (*)
      `)
      .eq('topik_id', topikId)
      .eq('pool', 'materi');

    if (error) throw error;
    if (!data || data.length === 0) return [];

    // Acak soal dan ambil 5 teratas
    const shuffledQuestions = shuffleArray(data).slice(0, 5);

    // Format data agar siap dirender ke UI
    return shuffledQuestions.map(q => ({
      ...q,
      // Pastikan pilihan jawaban juga diacak biar nggak A terus jawabannya hehe
      options: shuffleArray(q.answer_options || []),
      context: q.quiz_contexts // Alias agar lebih mudah diakses di UI
    }));
  } catch (error) {
    console.error('Gagal mengambil soal materi:', error.message);
    return [];
  }
};

/**
 * 2. Ambil soal untuk Latihan Umum (Pool: 'latihan')
 * Mengambil 20 soal random dari semua topik
 */
export const getLatihanQuiz = async () => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select(`
        *,
        quiz_contexts (id, title, content),
        answer_options (*)
      `)
      .eq('pool', 'latihan');

    if (error) throw error;
    if (!data || data.length === 0) return [];

    // Acak soal dari semua bank soal latihan dan ambil 20
    const shuffledQuestions = shuffleArray(data).slice(0, 20);

    return shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.answer_options || []),
      context: q.quiz_contexts
    }));
  } catch (error) {
    console.error('Gagal mengambil soal latihan:', error.message);
    return [];
  }
};
