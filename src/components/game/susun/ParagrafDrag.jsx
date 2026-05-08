import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function ParagrafDrag({ id, teks, status }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled: status !== 'active',
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none', // Prevent screen scrolling when dragging on mobile
  };

  let bgClass = "bg-white border-border text-ink";
  let iconClass = "text-ink-muted";

  if (status === 'correct') {
    bgClass = "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]";
    iconClass = "text-[#22C55E]";
  } else if (status === 'wrong') {
    bgClass = "bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]";
    iconClass = "text-[#F43F5E]";
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-3 rounded-xl border shadow-sm flex items-start gap-2 select-none mb-2
        ${bgClass}
        ${isDragging ? 'shadow-lg ring-2 ring-primary-300 ring-opacity-50 z-50 scale-[1.02]' : 'z-10'}
        ${status === 'active' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
      `}
      {...attributes}
      {...listeners}
    >
      <div className={`mt-0.5 cursor-grab active:cursor-grabbing shrink-0 ${iconClass}`}>
        {status === 'active' ? <GripVertical size={16} /> : null}
        {status === 'correct' ? <span className="text-[10px] font-bold">✓</span> : null}
        {status === 'wrong' ? <span className="text-[10px] font-bold">X</span> : null}
      </div>
      <p className="font-sans text-xs leading-relaxed flex-1">{teks}</p>
    </div>
  );
}
