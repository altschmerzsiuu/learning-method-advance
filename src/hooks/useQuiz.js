// src/hooks/useQuiz.js
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function useQuiz(topikId) {
  const [sessionSoal, setSessionSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selectedLetter, setSelected] = useState(null);
  const [isAnswered, setIsAnswered]   = useState(false);
  const [score, setScore]             = useState(0);
  const [results, setResults]         = useState([]); 
  const [direction, setDirection]     = useState(1);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch from Supabase
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*, quiz_contexts(*)');

      if (error) throw error;

      // 2. Filter by topikId
      const filtered = data.filter(q => q.topik_id === topikId);

      // 3. Group questions by context
      const grouped = [];
      const contextMap = new Map();

      filtered.forEach(q => {
        if (q.context_id) {
          if (!contextMap.has(q.context_id)) {
            contextMap.set(q.context_id, []);
            grouped.push({ 
              type: 'context', 
              context: q.quiz_contexts?.content || '', 
              questions: contextMap.get(q.context_id) 
            });
          }
          contextMap.get(q.context_id).push(q);
        } else {
          grouped.push({ type: 'standalone', question: q });
        }
      });

      // 4. Shuffle the groups
      const shuffledGroups = shuffleArray(grouped);

      // 5. Select groups until we have ~20 questions
      const selectedQuestions = [];
      let count = 0;
      const MAX_SOAL = 20;

      for (const item of shuffledGroups) {
        if (count >= MAX_SOAL) break;
        if (item.type === 'context') {
          item.questions.forEach(q => {
            selectedQuestions.push({ ...q, context: item.context });
            count++;
          });
        } else {
          selectedQuestions.push(item.question);
          count++;
        }
      }

      // 6. Process selected questions (shuffle options)
      const processed = selectedQuestions.map(q => {
        // q.options is already a clean array from my seed script
        const shuffledOptions = shuffleArray(q.options);
        return {
          ...q,
          pertanyaan: q.question_text, // mapping to original field name if used in UI
          shuffledOptions,
          correctText: q.correct_answer
        };
      });

      setSessionSoal(processed);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    } finally {
      setLoading(false);
    }
  }, [topikId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentSoal = sessionSoal[currentIdx] ?? null;
  const isLast      = currentIdx === sessionSoal.length - 1;
  const total       = sessionSoal.length;

  const selectAnswer = useCallback((letter, text) => {
    if (isAnswered) return;
    setSelected(letter);
    setIsAnswered(true);

    const isCorrect = text === currentSoal?.correctText;
    if (isCorrect) setScore(s => s + 1);
    setResults(r => [...r, { soalId: currentSoal?.id, isCorrect }]);
  }, [isAnswered, currentSoal]);

  const nextSoal = useCallback(() => {
    if (!isLast) {
      setDirection(1);
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setIsAnswered(false);
    }
  }, [isLast]);

  const getScorePercent = useCallback(() => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  }, [score, total]);

  return {
    soalList: sessionSoal,
    currentSoal,
    currentIdx,
    total,
    isLast,
    loading,
    direction,
    selectedAnswer: selectedLetter,
    isAnswered,
    score,
    results,
    selectAnswer,
    nextSoal,
    getScorePercent,
    retry: fetchQuestions
  };
}
