import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  Lock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Bug
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { formatTime, formatHash } from '../utils/formatters';

export default function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [auditStatus, setAuditStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const [logsData, chainData] = await Promise.all([
        api.getSecurityLogs(100),
        api.verifyAuditChain()
      ]);
      setLogs(logsData);
      setAuditStatus(chainData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleVerifyChain = async () => {
    try {
      setVerifying(true);
      const res = await api.verifyAuditChain();
      setAuditStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateTamper = async () => {
    try {
      await api.simulateAuditTampering();
      // Re-verify immediately to show detection
      const res = await api.verifyAuditChain();
      setAuditStatus(res);
      // Refresh logs
      const freshLogs = await api.getSecurityLogs(100);
      setLogs(freshLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === 'ALL') return true;
    if (filterType === 'THREATS') return log.decision === 'THREAT_DETECTED';
    if (filterType === 'VALID') return log.decision === 'VALID_SIGNATURE';
    return log.attack_type === filterType;
  });

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Tamper-Evident Security Event Log
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            Sequential append-only audit trail cryptographically linked via SHA-256 hash pointers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchLogs} disabled={loading} className="btn btn-secondary">
            <RefreshCw size={15} />
            Refresh
          </button>
          <button onClick={handleVerifyChain} disabled={verifying} className="btn btn-primary">
            <ShieldCheck size={16} />
            {verifying ? 'Verifying Chain...' : 'VERIFY AUDIT CHAIN'}
          </button>
          <button onClick={handleSimulateTamper} className="btn btn-danger" style={{ fontSize: '0.82rem' }}>
            <Bug size={15} />
            Simulate Tampering
          </button>
        </div>
      </div>

      {/* Audit Chain Verification Banner */}
      {auditStatus && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: auditStatus.is_valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${auditStatus.is_valid ? '#10b981' : '#ef4444'}`,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {auditStatus.is_valid ? (
              <CheckCircle2 size={28} color="#34d399" />
            ) : (
              <ShieldAlert size={28} color="#f87171" />
            )}
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: auditStatus.is_valid ? '#34d399' : '#f87171' }}>
                {auditStatus.is_valid ? 'CRYPTOGRAPHIC AUDIT CHAIN VERIFIED INTACT' : 'AUDIT CHAIN INTEGRITY BREACH DETECTED!'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                {auditStatus.message || auditStatus.reason}
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>
            Total Chain Blocks: <strong style={{ color: '#f8fafc' }}>{auditStatus.chain_length}</strong>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'THREATS', 'VALID', 'FORGERY', 'REPLAY', 'IMPERSONATION', 'QUANTUM_CHANNEL_MANIPULATION'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: filterType === tab ? '#06b6d4' : 'rgba(255, 255, 255, 0.04)',
              color: filterType === tab ? '#ffffff' : '#94a3b8',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Log Table Card */}
      <div className="q-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="q-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Event ID</th>
                <th>Signer</th>
                <th>Threat / Event</th>
                <th>Basis</th>
                <th>Error Rate</th>
                <th>Agreement</th>
                <th>Decision</th>
                <th>Current SHA-256 Hash</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.event_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {log.formatted_time || formatTime(log.timestamp)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                      {log.event_id}
                    </td>
                    <td>{log.signer_id}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px', borderRadius: '4px',
                        background: log.attack_type === 'NONE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.15)',
                        color: log.attack_type === 'NONE' ? '#34d399' : '#f87171',
                        fontSize: '0.72rem', fontWeight: 700
                      }}>
                        {log.attack_type}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{log.measurement_basis}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: log.error_rate > 0.10 ? '#f87171' : '#f1f5f9' }}>
                      {(log.error_rate * 100).toFixed(1)}%
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: log.agreement_rate >= 0.90 ? '#34d399' : '#f87171' }}>
                      {(log.agreement_rate * 100).toFixed(1)}%
                    </td>
                    <td>
                      <StatusBadge decision={log.decision} threatType={log.attack_type} />
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b' }}>
                      {formatHash(log.current_hash, 6)}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.reason}>
                      {log.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
