/**
 * Formatting and display helper utilities for Quantum Digital Signature simulation.
 */

export function formatHash(hash, length = 12) {
  if (!hash) return '';
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

export function formatPercent(rate, decimals = 1) {
  if (rate === undefined || rate === null || isNaN(rate)) return '0.0%';
  return `${(rate * 100).toFixed(decimals)}%`;
}

export function formatProb(prob) {
  if (prob === undefined || prob === null || isNaN(prob)) return '0.0000';
  if (prob < 1e-4 && prob > 0) {
    return prob.toExponential(2);
  }
  return Number(prob).toFixed(4);
}

export function formatTime(timestamp) {
  if (!timestamp) return '—';
  try {
    const d = new Date(timestamp * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return String(timestamp);
  }
}

export function getThreatBadgeStyle(threatType) {
  const type = String(threatType).toUpperCase();
  switch (type) {
    case 'NONE':
      return { label: 'SECURE', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '#10b981' };
    case 'FORGERY':
      return { label: 'FORGERY DETECTED', bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '#ef4444' };
    case 'IMPERSONATION':
      return { label: 'IMPERSONATION', bg: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', border: '#f43f5e' };
    case 'REPLAY':
      return { label: 'REPLAY ATTACK', bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '#f59e0b' };
    case 'QUANTUM_CHANNEL_MANIPULATION':
      return { label: 'CHANNEL NOISE / ATTACK', bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '#a855f7' };
    case 'UNAUTHORIZED_VERIFICATION':
      return { label: 'UNAUTHORIZED PROBING', bg: 'rgba(234, 88, 12, 0.2)', color: '#fb923c', border: '#ea580c' };
    default:
      return { label: type, bg: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: '#06b6d4' };
  }
}
