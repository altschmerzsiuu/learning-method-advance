// src/components/ui/Card.jsx
import { motion } from 'framer-motion';

/**
 * Card component — EksposiLab Design System
 * No shadows — border only.
 */
export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'p-4',
  ...props
}) {
  const hasBg = className.includes('bg-');
  const base = `${hasBg ? '' : 'bg-surface-card'} border border-border rounded-md ${padding} transition-colors duration-150`;
  const hover = hoverable ? 'cursor-pointer hover:border-primary-300' : '';

  if (onClick || hoverable) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={onClick}
        className={`${base} ${hover} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
