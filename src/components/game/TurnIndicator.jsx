export default function TurnIndicator({ mode, currentTurn, teamX, teamO }) {
  if (mode === 'solo') {
    return (
      <div className="flex items-center justify-center py-4">
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${currentTurn === 'X' ? 'bg-primary-100 text-primary-700' : 'bg-surface-muted text-ink-muted'}`}>
          {currentTurn === 'X' ? teamX : 'AI Berpikir...'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4 gap-4">
      <div className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${currentTurn === 'X' ? 'bg-primary-100 text-primary-700 scale-110 shadow-sm' : 'bg-surface-muted text-ink-muted'}`}>
        Tim X: {teamX}
      </div>
      <span className="text-xl">⚔️</span>
      <div className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${currentTurn === 'O' ? 'bg-rose-100 text-rose-700 scale-110 shadow-sm' : 'bg-surface-muted text-ink-muted'}`}>
        Tim O: {teamO}
      </div>
    </div>
  );
}
