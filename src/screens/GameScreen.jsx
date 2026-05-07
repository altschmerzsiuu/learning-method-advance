import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, TopBar } from '../components/ui';
import TurnIndicator from '../components/game/TurnIndicator';
import SkillBar from '../components/game/SkillBar';
import GameBoard from '../components/game/GameBoard';
import SoalModal from '../components/game/SoalModal';
import MysteryBoxModal from '../components/game/MysteryBoxModal';
import SkillModal from '../components/game/SkillModal';
import { useGame } from '../hooks/useGame';
import { useEffect, useState } from 'react';

export default function GameScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const setupData = location.state;
  
  const [modalSkillId, setModalSkillId] = useState(null);

  const {
    board, currentTurn, gameStatus, winner,
    showSoal, setShowSoal, showMysteryBox, showSkillModal, setShowSkillModal,
    currentSoal, isAiThinking, mysteryReward,
    skills, skillTargetMode, activeSkill, setSkillTargetMode, setActiveSkill,
    mysteryBoxes,
    handleCellClick, handleAnswer, applyMysteryReward, activateSkill, teamX, teamO, mode
  } = useGame(setupData);

  useEffect(() => {
    if (!setupData) navigate('/latihan/think-tac-toe', { replace: true });
  }, [setupData, navigate]);

  useEffect(() => {
    if (gameStatus === 'finished') {
      setTimeout(() => {
        navigate('/latihan/think-tac-toe/hasil', {
          state: { winner, teamX, teamO, mode, difficulty: setupData?.difficulty },
          replace: true
        });
      }, 1500);
    }
  }, [gameStatus, winner, navigate, teamX, teamO, mode, setupData?.difficulty]);

  const handleBack = () => {
    if (window.confirm('Yakin ingin keluar? Game yang sedang berjalan akan hilang.')) {
      navigate('/latihan/think-tac-toe', { replace: true });
    }
  };

  if (!setupData) return null;

  return (
    <PageWrapper>
      <TopBar title="Think-Tac-Toe" onBack={handleBack} backIcon="×" />
      
      <div className="flex flex-col h-[calc(100vh-52px)] bg-bg-light relative">
        <TurnIndicator mode={mode} currentTurn={currentTurn} teamX={teamX} teamO={teamO} />
        
        <div className="px-4 mb-2">
          <SkillBar 
            skills={skills} 
            currentTurn={currentTurn} 
            onSkillClick={(id) => { setModalSkillId(id); setShowSkillModal(true); }} 
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
          <GameBoard 
            board={board} 
            mysteryBoxes={mysteryBoxes} 
            winLine={null} // Can compute win line inside useGame if needed, but simple is fine
            onCellClick={handleCellClick}
            skillTargetMode={skillTargetMode}
            activeSkill={activeSkill}
            currentTurn={currentTurn}
          />
          
          <div className="mt-8 text-center h-12">
            {skillTargetMode ? (
              <p className="text-warning-600 font-bold animate-pulse">Pilih kotak lawan untuk skill!</p>
            ) : isAiThinking ? (
              <div className="flex items-center gap-1 justify-center">
                <span className="text-sm font-bold text-ink-muted">AI sedang berpikir</span>
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-ink-muted"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  />
                ))}
              </div>
            ) : mode === 'team' && currentTurn === 'O' ? (
              <p className="text-sm font-bold text-rose-500 animate-pulse">Tim O, giliranmu! Serahkan HP ke temanmu 🤝</p>
            ) : mode === 'team' && currentTurn === 'X' ? (
              <p className="text-sm font-bold text-primary-500 animate-pulse">Tim X, giliranmu! Serahkan HP ke temanmu 🤝</p>
            ) : (
              <p className="text-sm text-ink-muted">Klik kotak untuk menjawab soal</p>
            )}
          </div>
        </div>

        <SoalModal 
          isOpen={showSoal} 
          soal={currentSoal} 
          onAnswer={handleAnswer} 
        />
        
        <MysteryBoxModal 
          isOpen={showMysteryBox} 
          reward={mysteryReward} 
          onClose={applyMysteryReward} 
        />
        
        <SkillModal 
          isOpen={showSkillModal} 
          skillId={modalSkillId} 
          onConfirm={activateSkill} 
          onCancel={() => setShowSkillModal(false)} 
        />

        {skillTargetMode && (
          <button 
            onClick={() => { setSkillTargetMode(false); setActiveSkill(null); }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-surface-card px-4 py-2 rounded-full shadow-lg border border-border text-xs font-bold text-ink-muted z-20"
          >
            Batal Pakai Skill
          </button>
        )}
      </div>
    </PageWrapper>
  );
}
