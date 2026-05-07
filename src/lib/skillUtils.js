export const SKILL_DATA = {
  erase:  { id: 'erase',  icon: '🧹', label: 'Erase', desc: 'Hapus 1 kotak lawan.' },
  shield: { id: 'shield', icon: '🛡️', label: 'Shield', desc: 'Aman jika salah jawab.' },
  double: { id: 'double', icon: '⚡', label: 'Double', desc: 'Klaim 2 kotak jika benar.' },
  steal:  { id: 'steal',  icon: '🎯', label: 'Steal', desc: 'Ambil 1 kotak lawan.' }
};

export const MYSTERY_REWARDS = [
  { type: 'skill', value: 'erase',  label: '🧹 Dapat Skill Erase!',  weight: 25 },
  { type: 'skill', value: 'shield', label: '🛡️ Dapat Skill Shield!', weight: 25 },
  { type: 'skill', value: 'steal',  label: '🎯 Dapat Skill Steal!',  weight: 20 },
  { type: 'skill', value: 'double', label: '⚡ Dapat Skill Double!', weight: 15 },
  { type: 'zonk',  value: 'skip',   label: '😵 Zonk! Skip giliran',  weight: 10 },
  { type: 'zonk',  value: 'swap',   label: '🔄 Zonk! Tukar giliran', weight: 5  }
];

export function validateSkillTarget(board, targetIdx, skill, currentPlayer) {
  if (targetIdx === null || targetIdx < 0 || targetIdx > 8) return false;
  const opponent = currentPlayer === 'X' ? 'O' : 'X';
  if (skill === 'erase' || skill === 'steal') return board[targetIdx] === opponent;
  return false;
}
