// src/lib/rateLimit.js

const attempts = new Map();

/**
 * Rate Limiting Sederhana (Client Side)
 * Mencegah spam klik/pencet tombol berulang kali
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const userAttempts = attempts.get(key) || [];

  // Hapus percobaan yang sudah di luar jendela waktu
  const recentAttempts = userAttempts.filter(time => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    const oldestAttempt = recentAttempts[0];
    const waitTime = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
    throw new Error(`Terlalu banyak percobaan. Silakan coba lagi dalam ${waitTime} detik.`);
  }

  recentAttempts.push(now);
  attempts.set(key, recentAttempts);
  return true;
}
