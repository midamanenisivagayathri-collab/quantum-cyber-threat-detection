import React from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Atom,
  ShieldAlert,
  BarChart3,
  ScrollText,
  FlaskConical,
  BookOpen,
  PlayCircle,
  Cpu
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, onRunFullDemo, isDemoRunning }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verification', label: 'Signature & Verification', icon: KeyRound },
    { id: 'quantum', label: 'Quantum Simulation', icon: Atom },
    { id: 'attacks', label: 'Attack Simulator', icon: ShieldAlert },
    { id: 'analytics', label: 'Security Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Audit Log & Chain', icon: ScrollText },
    { id: 'lab', label: 'Experiment Lab', icon: FlaskConical },
    { id: 'concepts', label: 'Quantum Concepts', icon: BookOpen },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#090e1c',
      borderRight: '1px solid rgba(56, 189, 248, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
          }}>
            <Atom size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '0.02em', color: '#f8fafc' }}>
              QDS SECURITY
            </div>
            <div style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 600, letterSpacing: '0.05em' }}>
              QUANTUM-INSPIRED
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Simulation Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.05))' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid #06b6d4' : '3px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#06b6d4' : '#64748b'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Demo CTA */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <button
          onClick={onRunFullDemo}
          disabled={isDemoRunning}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '0.82rem', padding: '10px 12px' }}
        >
          <PlayCircle size={17} />
          {isDemoRunning ? 'Running Demo...' : 'RUN FULL DEMO'}
        </button>

        <div style={{
          marginTop: '12px',
          padding: '8px 10px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: '#64748b'
        }}>
          <Cpu size={14} color="#10b981" />
          <span>Deterministic Matrix Simulation (No AI/ML)</span>
        </div>
      </div>
    </aside>
  );
}
