import React from 'react';
import { CheckCircle2, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { getThreatBadgeStyle } from '../utils/formatters';

export default function StatusBadge({ decision, threatType }) {
  const isThreat = decision === 'THREAT_DETECTED' || (threatType && threatType !== 'NONE');
  const style = getThreatBadgeStyle(isThreat ? (threatType || 'THREAT_DETECTED') : 'NONE');

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`
      }}
    >
      {isThreat ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
      <span>{isThreat ? `${style.label}` : 'VALID SIGNATURE'}</span>
    </div>
  );
}
