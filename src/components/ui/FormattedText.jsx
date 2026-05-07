// src/components/ui/FormattedText.jsx
import React from 'react';

/**
 * Renders simple markdown-like formatting:
 * **bold** -> <strong>
 * *italic* -> <em>
 * [u]underline[/u] -> <u>
 */
export default function FormattedText({ text }) {
  if (!text) return null;

  // Split by bold (**), italic (*), or underline ([u][/u])
  // We use capturing group to keep the delimiters in the array
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[u\].*?\[\/u\])/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-extrabold text-ink drop-shadow-none-[0_0_0.1px_rgba(0,0,0,0.1)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={i} className="italic font-medium text-ink/90">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith('[u]') && part.endsWith('[/u]')) {
          return (
            <u key={i} className="underline decoration-primary-300 decoration-2 underline-offset-2">
              {part.slice(3, -4)}
            </u>
          );
        }
        return part;
      })}
    </>
  );
}
