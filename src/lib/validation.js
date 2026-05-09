// src/lib/validation.js

/**
 * Validasi Format Email
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validasi Kekuatan Password (min 8 karakter)
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
}

/**
 * Validasi Nama (2-100 karakter)
 */
export function validateNama(nama) {
  if (!nama || typeof nama !== 'string') return false;
  const trimmed = nama.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * Validasi Pilihan Kelas
 */
export function validateKelas(kelas) {
  return ['VII', 'VIII', 'IX'].includes(kelas);
}

/**
 * Pembersihan Teks (Anti-XSS Sederhana)
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
}
