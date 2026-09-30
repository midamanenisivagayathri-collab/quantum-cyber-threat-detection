import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Zap,
  Info,
  Clock,
  ShieldX,
  Radio,
  Play
} from 'lucide-react';
import SecurityAlert from '../components/SecurityAlert';
import AttackChart from '../charts/AttackChart';
import MeasurementChart from '../charts/MeasurementChart';
import { api } from '../services/api';

export default function AttackSimulator() {
  const [attackType, setAttackType] = useState('FORGERY');
  const [intensity, setIntensity] = useState(0.25);
  const [tamperedMessage, setTamperedMessage] = useState('Tampered Directive: Divert $500,000 to Adversary Account #99');
  const [attackerId, setAttackerId] = useState('Eve_Mallory');
  const [shots, setShots] = useState(1000);

  const [attackResult, setAttackResult] = useState(null);
  const [sweepData, setSweepData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const executeSpecificAttack = async (type, customIntensity = 0.25) => {
    try {
      setIsRunning(true);
      setError(null);
      setAttackType(type);

      const res = await api.simulateAttack({
        attack_type: type,
        intensity: customIntensity,
        tampered_message: tamperedMessage,
        attacker_id: attackerId,
        shots: Number(shots)
      });
      setAttackResult(res);

      if (type === 'QUANTUM_CHANNEL_MANIPULATION') {
        const sweep = await api.runExperiment({
          mode: 'WHAT_IF',
          shots: Number(shots),
          seed: 42
        });
        setSweepData(sweep.curve_data || []);
      } else {
        setSweepData([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const runAttack = () => executeSpecificAttack(attackType, Number(intensity));

  const handleReset = () => {
    setAttackResult(null);
    setSweepData([]);
    setError(null);
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Adversarial Cyber Threat Simulator
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
          Simulate real physical attacks altering cryptographic digests, signer identities, nonces, and quantum channels.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '0.85rem',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Explicit One-Click Showcase Demonstration Cards */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          Quick Showcase: Explicit Threat Detection Demonstrations
        </div>
        <div className="grid-3" style={{ gap: '14px' }}>
          <div
            onClick={() => executeSpecificAttack('REPLAY')}
            className="q-card"
            style={{
              cursor: 'pointer',
              border: attackType === 'REPLAY' && attackResult ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.25)',
              background: 'rgba(245, 158, 11, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
              <Clock size={16} />
              <span>1. Replay Attack Demo</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
              Demonstrates 2-stage verification: Alice token consumed &rarr; Eve's replayed token rejected via spent nonce rule.
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
              &rarr; Click to Trigger Replay Demo
            </div>
          </div>

          <div
            onClick={() => executeSpecificAttack('UNAUTHORIZED_VERIFICATION')}
            className="q-card"
            style={{
              cursor: 'pointer',
              border: attackType === 'UNAUTHORIZED_VERIFICATION' && attackResult ? '1px solid #ea580c' : '1px solid rgba(234, 88, 12, 0.25)',
              background: 'rgba(234, 88, 12, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb923c', fontWeight: 700, fontSize: '0.9rem' }}>
              <ShieldX size={16} />
              <span>2. Unauthorized Probing Demo</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
              Demonstrates rate-limiting: Rapid automated requests 1-3 pass &rarr; 4th attempt triggers immediate session lockout.
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#fb923c', fontWeight: 600 }}>
              &rarr; Click to Trigger Lockout Demo
            </div>
          </div>

          <div
            onClick={() => executeSpecificAttack('QUANTUM_CHANNEL_MANIPULATION', 0.30)}
            className="q-card"
            style={{
              cursor: 'pointer',
              border: attackType === 'QUANTUM_CHANNEL_MANIPULATION' && attackResult ? '1px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.25)',
              background: 'rgba(168, 85, 247, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '0.9rem' }}>
              <Radio size={16} />
              <span>3. Quantum Noise Demo</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
              Injects 30% Pauli bit/phase flips into carrier qubits &rarr; Error rate rises to ~30%, breaching the 10.0% threshold.
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>
              &rarr; Click to Trigger Channel Noise Demo
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel Card */}
      <div className="q-card" style={{ marginBottom: '24px' }}>
        <div className="q-card-title">
          <Sliders size={18} color="#ef4444" />
          <span>Manual Attack Vector Configuration</span>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Target Attack Vector</label>
            <select
              className="q-select"
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
            >
              <option value="FORGERY">1. Digital Signature Forgery (Message Hash Mismatch)</option>
              <option value="IMPERSONATION">2. Signer Impersonation (Untrusted Actor ID)</option>
              <option value="REPLAY">3. Replay Attack (Nonce & Signature Reuse)</option>
              <option value="QUANTUM_CHANNEL_MANIPULATION">4. Quantum Channel Manipulation (Pauli Noise)</option>
              <option value="UNAUTHORIZED_VERIFICATION">5. Unauthorized Probing (Rate Limit Lockout)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Attack Intensity: {(intensity * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              <span>0% (Clean)</span>
              <span>10% (Tolerance)</span>
              <span>25% (Critical)</span>
              <span>50% (Max Noise)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Measurement Shots (N)</label>
            <select
              className="q-select"
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
            >
              <option value={100}>100 Shots</option>
              <option value={500}>500 Shots</option>
              <option value={1000}>1,000 Shots (Standard)</option>
              <option value={5000}>5,000 Shots</option>
            </select>
          </div>
        </div>

        {/* Dynamic Context Fields based on Attack */}
        {attackType === 'FORGERY' && (
          <div className="form-group">
            <label className="form-label">Tampered Message Payload (Adversary Modified)</label>
            <input
              type="text"
              className="q-input"
              value={tamperedMessage}
              onChange={(e) => setTamperedMessage(e.target.value)}
            />
          </div>
        )}

        {attackType === 'IMPERSONATION' && (
          <div className="form-group">
            <label className="form-label">Unauthorized Adversary Signer ID</label>
            <input
              type="text"
              className="q-input"
              value={attackerId}
              onChange={(e) => setAttackerId(e.target.value)}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={runAttack}
            disabled={isRunning}
            className="btn btn-danger"
            style={{ flex: 1 }}
          >
            <Flame size={16} />
            {isRunning ? 'Injecting Attack...' : 'EXECUTE CYBER ATTACK'}
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Attack Result Display */}
      {attackResult && (
        <div style={{ marginBottom: '24px' }}>
          {/* Forgery or Impersonation or Channel */}
          {attackResult.verification_result && (
            <SecurityAlert result={attackResult.verification_result} />
          )}

          {/* Replay 2-step Visual */}
          {attackResult.attack_type === 'REPLAY' && (
            <div className="grid-2" style={{ marginTop: '20px' }}>
              <div className="q-card" style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>
                    Stage 1: Initial Legitimate Submission
                  </div>
                  <span className="badge badge-valid">PERMITTED</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Signer: <strong style={{ color: '#f8fafc' }}>Alice (Authorized)</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  Nonce: <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{attackResult.nonce}</span> (First use)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  Decision: <strong style={{ color: '#34d399' }}>{attackResult.first_attempt.decision}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px', lineHeight: 1.5 }}>
                  {attackResult.first_attempt.reason}
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  &check; Token consumed & added to Spent Nonce Registry.
                </div>
              </div>

              <div className="q-card" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.95rem' }}>
                    Stage 2: Intercepted Replay by Eve
                  </div>
                  <span className="badge badge-threat">THREAT DETECTED</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Signer: <strong style={{ color: '#f8fafc' }}>Eve retransmitting Alice's token</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  Nonce: <span style={{ fontFamily: 'var(--font-mono)', color: '#f87171' }}>{attackResult.nonce}</span> (DUPLICATE)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  Decision: <strong style={{ color: '#f87171' }}>{attackResult.second_attempt.decision}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '8px', lineHeight: 1.5, fontWeight: 500 }}>
                  Rule Triggered: RULE-03-REPLAY-NONCE. Nonce previously consumed.
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                  &cross; Deterministic lockout: Replay attack thwarted.
                </div>
              </div>
            </div>
          )}

          {/* Unauthorized Attempts History */}
          {attackResult.attack_type === 'UNAUTHORIZED_VERIFICATION' && (
            <div className="q-card" style={{ marginTop: '20px' }}>
              <div className="q-card-title">
                <ShieldX size={18} color="#ea580c" />
                <span>Rapid Probing Session Lockout Telemetry</span>
              </div>
              <div className="q-card-subtitle">
                Verifier limits sessions to maximum 3 attempts. Attempt #4 immediately triggers security lockout.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {attackResult.attempts_history?.map((att) => {
                  const isBlocked = att.threat_type === 'UNAUTHORIZED_VERIFICATION';
                  return (
                    <div
                      key={att.attempt_number}
                      style={{
                        padding: '12px 16px',
                        background: isBlocked ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.05)',
                        border: `1px solid ${isBlocked ? '#ef4444' : 'rgba(16, 185, 129, 0.2)'}`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isBlocked ? '#f87171' : '#38bdf8' }}>
                          Attempt #{att.attempt_number}
                        </span>
                        <span style={{ color: isBlocked ? '#f87171' : '#94a3b8' }}>
                          {isBlocked ? 'Exceeded allowable quota (4 > 3 attempts)' : `Session quota used: ${att.attempt_number} / 3`}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: isBlocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isBlocked ? '#f87171' : '#34d399',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {isBlocked ? 'BLOCKED: RULE-05-VERIFICATION-ATTEMPTS' : 'PERMITTED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sensitivity Chart for Channel Noise */}
          {sweepData.length > 0 && (
            <div className="q-card" style={{ marginTop: '20px' }}>
              <AttackChart data={sweepData} maxErrorThreshold={0.10} />
            </div>
          )}

          {/* Measurement Histogram */}
          {attackResult.verification_result?.distribution_comparison && (
            <div className="q-card" style={{ marginTop: '20px' }}>
              <MeasurementChart
                data={attackResult.verification_result.distribution_comparison.comparison_points || []}
                title="Measurement Outcome Perturbation Caused by Attack"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
