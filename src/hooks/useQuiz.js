// src/hooks/useQuiz.js
import { useState, useCallback } from 'react';
import quizData from '../data/quiz.json';

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function useQuiz(topikId) {
  const topikQuiz = quizData.find(q => q.topik_id === topikId);
  
  // Initialize state with grouped and shuffled questions
  const [sessionSoal, setSessionSoal] = useState(() => {
    const originalSoal = topikQuiz?.soal ?? [];
    
    // 1. Group questions by context (if any)
    const grouped = [];
    const contextMap = new Map();

    originalSoal.forEach(q => {
      if (q.context) {
        if (!contextMap.has(q.context)) {
          contextMap.set(q.context, []);
          grouped.push({ type: 'context', context: q.context, questions: contextMap.get(q.context) });
        }
        contextMap.get(q.context).push(q);
      } else {
        grouped.push({ type: 'standalone', question: q });
      }
    });

    // 2. Shuffle the groups
    const shuffledGroups = shuffleArray(grouped);

    // 3. Select groups until we have ~20 questions
    const selectedQuestions = [];
    let count = 0;
    const MAX_SOAL = 20;

    for (const item of shuffledGroups) {
      if (count >= MAX_SOAL) break;

      if (item.type === 'context') {
        item.questions.forEach(q => {
          selectedQuestions.push(q);
          count++;
        });
      } else {
        selectedQuestions.push(item.question);
        count++;
      }
    }

    // 4. Process selected questions (shuffle options, set correct text)
    return selectedQuestions.map(q => {
      const cleanPilihan = q.pilihan.map(p => p.replace(/^[A-D]\.\s+/, ''));
      const shuffledOptions = shuffleArray(cleanPilihan);
      const originalCorrectLetter = q.jawaban_benar;
      const correctText = q.pilihan.find(p => p.startsWith(originalCorrectLetter + '.'))?.replace(/^[A-D]\.\s+/, '');

      return {
        ...q,
        shuffledOptions,
        correctText
      };
    });
  });

  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selectedLetter, setSelected] = useState(null); // 'A', 'B', etc
  const [isAnswered, setIsAnswered]   = useState(false);
  const [score, setScore]             = useState(0);
  const [results, setResults]         = useState([]); // [{soalId, isCorrect}]
  const [direction, setDirection]     = useState(1);  // for slide animation

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
    direction,
    selectedAnswer: selectedLetter,
    isAnswered,
    score,
    results,
    selectAnswer,
    nextSoal,
    getScorePercent,
  };
}
