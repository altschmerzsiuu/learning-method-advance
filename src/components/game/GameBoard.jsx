import GameCell from './GameCell';

export default function GameBoard({ board, mysteryBoxes, winLine, onCellClick, skillTargetMode, activeSkill, currentTurn }) {
  return (
    <div className="relative grid grid-cols-3 gap-3 w-full max-w-[350px] mx-auto p-4 bg-surface-card rounded-2xl shadow-none-none border border-border">
      {board.map((val, idx) => (
        <GameCell
          key={idx}
          idx={idx}
          value={val}
          isWinner={winLine?.includes(idx)}
          isMysteryBox={mysteryBoxes.includes(idx)}
          onClick={onCellClick}
          isTargetMode={skillTargetMode}
          activeSkill={activeSkill}
          currentTurn={currentTurn}
        />
      ))}
      
      {/* Optional: Add SVG WinLine overlay here if needed */}
    </div>
  );
}
