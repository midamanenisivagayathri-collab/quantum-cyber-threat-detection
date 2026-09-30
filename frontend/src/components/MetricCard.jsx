import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'cyan', change = null }) {
  const colorMap = {
    cyan: { text: '#38bdf8', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)' },
    green: { text: '#34d399', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' },
    red: { text: '#f87171', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)' },
    amber: { text: '#fbbf24', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)' },
    purple: { text: '#c084fc', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.25)' },
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div className="q-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {value}
          </div>
        </div>
        {Icon && (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} color={theme.text} />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {change && <span style={{ color: theme.text, fontWeight: 600 }}>{change}</span>}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
