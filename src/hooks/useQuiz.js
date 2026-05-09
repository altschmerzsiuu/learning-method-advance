// src/hooks/useQuiz.js
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function shuffleArray(arr) {
  if (!arr || !Array.isArray(arr)) return [];
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const [error, setError]             = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch from Supabase with new relational structure
      const { data, error } = await supabase
        .from('quiz_questions')
        .select(`
          id,
          question_text,
          topik_id,
          tingkat,
          pool,
          quiz_contexts (
            id,
            context_text
          ),
          answer_options (
            id,
            option_text,
            is_correct
          )
        `)
        .eq('topik_id', topikId)
        .eq('pool', 'materi');

      if (error) throw error;
      if (!data || data.length === 0) {
        setSessionSoal([]);
        return;
      }

      // 2. Shuffle and take 5 for pre-quiz per materi
      const shuffled = shuffleArray(data).slice(0, 5);

      // 3. Process data for UI
      const processed = shuffled.map(q => {
        const contextObj = q.quiz_contexts;
        const contextText = contextObj ? contextObj.context_text : null;
        
        // Shuffle options from answer_options table
        const shuffledOpts = shuffleArray(q.answer_options || []);
        
        return {
          ...q,
          pertanyaan: q.question_text,
          context: contextText,
          shuffledOptions: shuffledOpts,
          // Store correct option text for checking logic
          correctText: shuffledOpts.find(o => o.is_correct)?.option_text
        };
      });

      setSessionSoal(processed);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      setError(err);
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
    error,
    retry: fetchQuestions
  };
}
