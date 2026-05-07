import { useState, useCallback, useRef, useEffect } from 'react';
import quizData from '../data/quiz.json';
import { checkWinner, getAvailableCells, getWeightedRandom } from '../lib/gameUtils.js';
import { getAiMove } from '../lib/minimax.js';
import { MYSTERY_REWARDS, validateSkillTarget } from '../lib/skillUtils.js';

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function getSoalPool(mode, difficulty) {
  const allSoal = quizData.flatMap(t => t.soal);
  if (mode === 'solo') {
    return difficulty === 'mudah'
      ? allSoal.filter(s => s.tingkat === 'mudah' || s.tingkat === 'sedang')
      : allSoal.filter(s => s.tingkat === 'sedang' || s.tingkat === 'susah');
  }
  return allSoal;
}

function getRandomSoal(pool, usedIds) {
  let available = pool.filter(s => !usedIds.includes(s.id));
  if (available.length === 0) available = pool;
  const q = available[Math.floor(Math.random() * available.length)];
  const cleanPilihan = q.pilihan.map(p => p.replace(/^[A-D]\.\s+/, ''));
  const shuffledOptions = shuffleArray(cleanPilihan);
  const correctText = q.pilihan.find(p => p.startsWith(q.jawaban_benar + '.'))?.replace(/^[A-D]\.\s+/, '');
  return { ...q, shuffledOptions, correctText };
}

function initMysteryBoxes(mode) {
  if (mode === 'solo') return [];
  const cells = [0,1,2,3,4,5,6,7,8];
  const shuffled = shuffleArray(cells);
  return [shuffled[0], shuffled[1]];
}

export function useGame(setupData) {
  const { mode = 'solo', difficulty = 'mudah', teamX = 'Pemain', teamO = 'AI' } = setupData || {};
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [gameStatus, setGameStatus] = useState('playing');
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [mysteryBoxes, setMysteryBoxes] = useState(() => initMysteryBoxes(mode));
  
  const [showSoal, setShowSoal] = useState(false);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [currentSoal, setCurrentSoal] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [mysteryReward, setMysteryReward] = useState(null);
  
  const [skills, setSkills] = useState({ X: [], O: [] });
  const [consecutiveCorrect, setConsecutiveCorrect] = useState({ X: 0, O: 0 });
  const [activeSkill, setActiveSkill] = useState(null);
  const [skillTargetMode, setSkillTargetMode] = useState(false);
  const [shieldActive, setShieldActive] = useState({ X: false, O: false });
  const [doubleActive, setDoubleActive] = useState({ X: false, O: false });
  
  const usedQIds = useRef([]);
  const soalPool = useRef(getSoalPool(mode, difficulty));
  
  const addSkill = useCallback((player, skillValue) => {
    setSkills(prev => {
      const pSkills = prev[player];
      if (pSkills.length < 2) return { ...prev, [player]: [...pSkills, skillValue] };
      return prev;
    });
  }, []);

  const switchTurn = useCallback(() => setCurrentTurn(p => p === 'X' ? 'O' : 'X'), []);

  const checkGameEnd = useCallback((currentBoard) => {
    const res = checkWinner(currentBoard);
    if (res) {
      setWinner(res.winner);
      setWinLine(res.line);
      setGameStatus('finished');
      return true;
    }
    return false;
  }, []);

  const executeAiTurn = useCallback((currentBoard) => {
    if (mode !== 'solo' || gameStatus === 'finished') return;
    setIsAiThinking(true);
    setTimeout(() => {
      const move = getAiMove(currentBoard, difficulty);
      if (move !== null && move !== undefined) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        setBoard(newBoard);
        if (!checkGameEnd(newBoard)) setCurrentTurn('X');
      }
      setIsAiThinking(false);
    }, 800 + Math.random() * 400);
  }, [mode, gameStatus, difficulty, checkGameEnd]);

  const handleCellClick = useCallback((idx) => {
    if (gameStatus !== 'playing' || board[idx] !== null) return;
    if (mode === 'solo' && currentTurn === 'O') return;
    
    if (skillTargetMode && activeSkill) {
      if (validateSkillTarget(board, idx, activeSkill, currentTurn)) {
        const newBoard = [...board];
        if (activeSkill === 'erase') newBoard[idx] = null;
        else if (activeSkill === 'steal') newBoard[idx] = currentTurn;
        setBoard(newBoard);
        setSkillTargetMode(false);
        setActiveSkill(null);
        setSkills(s => ({ ...s, [currentTurn]: s[currentTurn].filter((v, i) => i !== s[currentTurn].indexOf(activeSkill)) }));
        if (!checkGameEnd(newBoard)) {
          // Stay on current turn so they can still make a move if they want
        }
      }
      return;
    }

    if (mysteryBoxes.includes(idx)) {
      setMysteryBoxes(prev => prev.filter(i => i !== idx));
      setMysteryReward(getWeightedRandom(MYSTERY_REWARDS));
      setShowMysteryBox(true);
      return;
    }

    setSelectedCell(idx);
    const q = getRandomSoal(soalPool.current, usedQIds.current);
    usedQIds.current.push(q.id);
    setCurrentSoal(q);
    setShowSoal(true);
  }, [gameStatus, board, mode, currentTurn, skillTargetMode, activeSkill, mysteryBoxes, checkGameEnd, executeAiTurn, switchTurn]);

  const applyMysteryReward = useCallback(() => {
    setShowMysteryBox(false);
    if (!mysteryReward) return;
    if (mysteryReward.type === 'skill') {
      addSkill(currentTurn, mysteryReward.value);
      switchTurn();
      if (mode === 'solo' && currentTurn === 'X') executeAiTurn([...board]);
    } else {
      if (mysteryReward.value === 'swap') {
        switchTurn();
        if (mode === 'solo' && currentTurn === 'X') executeAiTurn([...board]);
      } else {
        switchTurn();
        if (mode === 'solo' && currentTurn === 'X') executeAiTurn([...board]);
      }
    }
    setMysteryReward(null);
  }, [mysteryReward, currentTurn, addSkill, switchTurn, mode, executeAiTurn, board]);

  const handleAnswer = useCallback((isCorrect) => {
    setShowSoal(false);
    const newBoard = [...board];
    
    if (isCorrect) {
      newBoard[selectedCell] = currentTurn;
      if (doubleActive[currentTurn]) {
        const available = getAvailableCells(newBoard);
        if (available.length > 0) newBoard[available[Math.floor(Math.random() * available.length)]] = currentTurn;
        setDoubleActive(prev => ({...prev, [currentTurn]: false}));
      }
      setConsecutiveCorrect(prev => {
        const count = prev[currentTurn] + 1;
        if (count >= 2) {
          addSkill(currentTurn, getWeightedRandom(MYSTERY_REWARDS.filter(r => r.type === 'skill')).value);
          return { ...prev, [currentTurn]: 0 };
        }
        return { ...prev, [currentTurn]: count };
      });
    } else {
      setConsecutiveCorrect(prev => ({ ...prev, [currentTurn]: 0 }));
      if (shieldActive[currentTurn]) {
        setShieldActive(prev => ({...prev, [currentTurn]: false}));
        setBoard(newBoard);
        setSelectedCell(null);
        return; 
      }
    }

    setBoard(newBoard);
    setSelectedCell(null);
    if (!checkGameEnd(newBoard)) {
      switchTurn();
      if (mode === 'solo' && currentTurn === 'X') executeAiTurn(newBoard);
    }
  }, [board, selectedCell, currentTurn, doubleActive, shieldActive, addSkill, checkGameEnd, switchTurn, mode, executeAiTurn]);

  const activateSkill = useCallback((skill) => {
    if (skill === 'shield' || skill === 'double') {
      if (skill === 'shield') setShieldActive(prev => ({...prev, [currentTurn]: true}));
      if (skill === 'double') setDoubleActive(prev => ({...prev, [currentTurn]: true}));
      setSkills(s => {
        const idx = s[currentTurn].indexOf(skill);
        return { ...s, [currentTurn]: s[currentTurn].filter((_, i) => i !== idx) };
      });
      setShowSkillModal(false);
    } else {
      setActiveSkill(skill);
      setSkillTargetMode(true);
      setShowSkillModal(false);
    }
  }, [currentTurn]);

  return {
    board, currentTurn, gameStatus, winner, winLine,
    showSoal, setShowSoal, showMysteryBox, showSkillModal, setShowSkillModal,
    currentSoal, selectedCell, isAiThinking, mysteryReward,
    skills, consecutiveCorrect, skillTargetMode, activeSkill, setSkillTargetMode, setActiveSkill,
    shieldActive, doubleActive, mysteryBoxes,
    handleCellClick, handleAnswer, applyMysteryReward, activateSkill, teamX, teamO, mode, difficulty
  };
}
