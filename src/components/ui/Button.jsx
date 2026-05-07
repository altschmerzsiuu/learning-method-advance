// src/components/ui/Button.jsx
import { motion } from 'framer-motion';

/**
 * Button component — EksposiLab Design System
 * Variants: primary | ghost | danger
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-bold rounded-[10px] transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-5 py-3',
    lg: 'text-base px-6 py-3.5',
  };

  const variants = {
    primary:   'bg-primary-300 hover:bg-primary-600 text-ink',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white',
    accent:    'bg-accent hover:bg-accent-dark text-ink',
    ghost:     'bg-transparent hover:bg-primary-50 text-primary-600 border-[1.5px] border-primary-200',
    outline:   'bg-transparent hover:bg-primary-50 text-ink border-[1.5px] border-border',
    danger:    'bg-danger hover:bg-rose-600 text-white',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ translateY: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
