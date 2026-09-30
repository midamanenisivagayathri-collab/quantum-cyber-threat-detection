import React from 'react';
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export default function Header({ stats, isConnected }) {
  const getStatusBadge = () => {
    if (!isConnected) {
      return (
        <div className="badge badge-threat">
          <AlertTriangle size={14} /> Backend Disconnected
        </div>
      );
    }
    if (stats?.current_security_status === 'AUDIT_CHAIN_BREACHED') {
      return (
        <div className="badge badge-threat pulse-glow">
          <ShieldAlert size={14} /> AUDIT CHAIN TAMPERED
        </div>
      );
    }
    if (stats?.threats_detected > 0) {
      return (
        <div className="badge badge-warning">
          <ShieldAlert size={14} /> {stats.threats_detected} THREATS DETECTED
        </div>
      );
    }
    return (
      <div className="badge badge-valid">
        <CheckCircle2 size={14} /> ALL SYSTEMS NOMINAL
      </div>
    );
  };

  return (
    <header style={{
      backgroundColor: 'rgba(12, 18, 34, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div>
        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#f8fafc',
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          Quantum-Inspired Cyber Threat Detection for Digital Signature Security
        </h1>
        <div style={{
          fontSize: '0.8rem',
          color: '#06b6d4',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '2px'
        }}>
          <span>Teleportation-Based QDS Security Simulation</span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ color: '#94a3b8' }}>Educational & Cybersecurity Research Prototype</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: isConnected ? '#10b981' : '#ef4444',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <Radio size={13} className={isConnected ? "pulse-glow" : ""} />
          <span>{isConnected ? "Engine Live: Port 8000" : "Engine Offline"}</span>
        </div>

        {getStatusBadge()}
      </div>
    </header>
  );
}
