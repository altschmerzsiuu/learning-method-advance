import { checkWinner, getAvailableCells } from './gameUtils.js';

export function minimax(board, isMaximizing, depth = 0) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }

  const available = getAvailableCells(board);
  if (isMaximizing) {
    let best = -Infinity;
    for (const i of available) {
      board[i] = 'O';
      best = Math.max(best, minimax(board, false, depth + 1));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of available) {
      board[i] = 'X';
      best = Math.min(best, minimax(board, true, depth + 1));
      board[i] = null;
    }
    return best;
  }
}

export function getAiMove(board, difficulty) {
  if (difficulty === 'mudah') {
    const available = getAvailableCells(board);
    return available[Math.floor(Math.random() * available.length)];
  }
  const available = getAvailableCells(board);
  let bestScore = -Infinity, bestMove = available[0];
  for (const i of available) {
    board[i] = 'O';
    const score = minimax(board, false);
    board[i] = null;
    if (score > bestScore) { bestScore = score; bestMove = i; }
  }
  return bestMove;
}
