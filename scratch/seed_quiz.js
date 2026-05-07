// scratch/seed_quiz.js
// Run this with: node scratch/seed_quiz.js
// Make sure you have your .env configured with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const quizData = JSON.parse(fs.readFileSync('./src/data/quiz.json', 'utf8'));

async function seed() {
  console.log('🚀 Starting seed...');

  // 0. Clear existing data to avoid mixing with dummy data
  console.log('🧹 Clearing old data...');
  await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('quiz_contexts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (const topic of quizData) {
    console.log(`\nProcessing topic: ${topic.topik_id}`);
    
    // Group questions by context for this topic
    const contextGroups = {};
    const standalones = [];

    topic.soal.forEach(q => {
      if (q.context) {
        if (!contextGroups[q.context]) contextGroups[q.context] = [];
        contextGroups[q.context].push(q);
      } else {
        standalones.push(q);
      }
    });

    // 1. Insert Contexts and their questions
    for (const [contextText, questions] of Object.entries(contextGroups)) {
      const { data: contextData, error: contextError } = await supabase
        .from('quiz_contexts')
        .insert({ content: contextText, title: 'Teks Bacaan' })
        .select()
        .single();

      if (contextError) {
        console.error('Error inserting context:', contextError);
        continue;
      }

      console.log(`✅ Inserted context: ${contextText.substring(0, 30)}...`);

      const questionsToInsert = questions.map(q => ({
        context_id: contextData.id,
        topik_id: topic.topik_id,
        question_text: q.pertanyaan,
        options: q.pilihan.map(p => p.replace(/^[A-D]\.\s+/, '')),
        correct_answer: q.pilihan.find(p => p.startsWith(q.jawaban_benar + '.'))?.replace(/^[A-D]\.\s+/, ''),
        explanation: q.penjelasan,
        difficulty: q.tingkat || 'sedang'
      }));

      const { error: qError } = await supabase.from('quiz_questions').insert(questionsToInsert);
      if (qError) console.error('Error inserting grouped questions:', qError);
      else console.log(`   - Inserted ${questions.length} questions for this context.`);
    }

    // 2. Insert Standalone questions
    if (standalones.length > 0) {
      const standaloneInserts = standalones.map(q => ({
        topik_id: topic.topik_id,
        question_text: q.pertanyaan,
        options: q.pilihan.map(p => p.replace(/^[A-D]\.\s+/, '')),
        correct_answer: q.pilihan.find(p => p.startsWith(q.jawaban_benar + '.'))?.replace(/^[A-D]\.\s+/, ''),
        explanation: q.penjelasan,
        difficulty: q.tingkat || 'sedang'
      }));

      const { error: sError } = await supabase.from('quiz_questions').insert(standaloneInserts);
      if (sError) console.error('Error inserting standalones:', sError);
      else console.log(`✅ Inserted ${standalones.length} standalone questions.`);
    }
  }

  console.log('\n✨ Seed complete!');
}

seed();
