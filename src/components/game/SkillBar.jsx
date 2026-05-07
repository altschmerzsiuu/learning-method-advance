import { SKILL_DATA } from '../../lib/skillUtils';

export default function SkillBar({ skills, currentTurn, onSkillClick }) {
  const currentSkills = skills[currentTurn] || [];

  return (
    <div className="flex justify-center gap-3 py-2 min-h-[48px]">
      {currentSkills.length === 0 ? (
        <span className="text-xs text-ink-faint italic flex items-center">Belum ada skill</span>
      ) : (
        currentSkills.map((skillId, i) => {
          const skill = SKILL_DATA[skillId];
          return (
            <button
              key={`${skillId}-${i}`}
              onClick={() => onSkillClick(skillId)}
              className="px-3 py-1.5 bg-surface-card border border-border rounded-full shadow-none-none flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-sm">{skill.icon}</span>
              <span className="text-xs font-bold text-ink">{skill.label}</span>
            </button>
          );
        })
      )}
    </div>
  );
}
