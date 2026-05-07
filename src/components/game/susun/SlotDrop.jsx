import { useDroppable } from '@dnd-kit/core';

export default function SlotDrop({ id, label, children, colorClass }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  let bg = 'bg-surface-muted';
  let border = 'border-border';
  let textColor = 'text-ink-muted';

  if (colorClass === 'tesis') {
    bg = 'bg-[#F0FAFF]'; border = 'border-[#B9ECFF]'; textColor = 'text-[#00A3E8]';
  } else if (colorClass === 'argumentasi') {
    bg = 'bg-[#FFF0F6]'; border = 'border-[#FFD6E8]'; textColor = 'text-[#E8508A]';
  } else if (colorClass === 'penegasan') {
    bg = 'bg-[#FFFBEB]'; border = 'border-[#FFE9A0]'; textColor = 'text-[#E8B800]';
  }

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 p-3 min-h-[100px] flex flex-col gap-2 transition-colors
        ${bg} ${isOver ? 'border-primary-400 border-dashed bg-white/50' : border}
      `}
    >
      <h3 className={`font-sans font-black text-[10px] uppercase tracking-wider mb-1 ${textColor}`}>
        {label}
      </h3>
      <div className="flex-1 flex flex-col gap-2">
        {children}
        {(!children || (Array.isArray(children) && children.length === 0)) && (
          <div className="flex-1 flex items-center justify-center opacity-50 border border-dashed border-current rounded-xl py-4">
            <span className={`text-[10px] font-bold ${textColor}`}>Drop paragraf di sini</span>
          </div>
        )}
      </div>
    </div>
  );
}
