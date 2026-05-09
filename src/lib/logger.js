// src/lib/logger.js

const isDev = import.meta.env.DEV;

/**
 * Logger Wrapper
 * Hanya mencetak log di mode development (npm run dev)
 * Di mode production (build), console log akan bersih.
 */
export const logger = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => isDev && console.error(...args),
  warn: (...args) => isDev && console.warn(...args),
};
