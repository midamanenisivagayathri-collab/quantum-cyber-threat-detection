import React, { useState, useEffect } from 'react';
import {
  Atom,
  Zap,
  Layers,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function QuantumSimulation() {
  const [activeTab, setActiveTab] = useState('teleportation'); // 'teleportation', 'bloch', 'pauli', 'bell'
  const [eigenstates, setEigenstates] = useState([]);
  const [pauliMatrices, setPauliMatrices] = useState([]);
  const [bellStates, setBellStates] = useState([]);
  
  // Qubit state for Bloch sphere
  const [thetaDeg, setThetaDeg] = useState(60);
  const [phiDeg, setPhiDeg] = useState(45);
  
  // Teleportation simulation state
  const [selectedStateLabel, setSelectedStateLabel] = useState('|+>');
  const [teleportBasis, setTeleportBasis] = useState('Z');
  const [channelNoise, setChannelNoise] = useState(0.0);
  const [teleportResult, setTeleportResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getEigenstates(),
      api.getPauliMatrices(),
      api.getBellStates()
    ]).then(([states, paulis, bells]) => {
      setEigenstates(states);
      setPauliMatrices(paulis);
      setBellStates(bells);
    }).catch(console.error);
  }, []);

  const runTeleportation = async () => {
    try {
      setIsSimulating(true);
      // Map state label to alpha/beta
      const st = eigenstates.find(s => s.label === selectedStateLabel) || eigenstates[0];
      const alpha_re = st?.vector?.alpha?.real ?? 1.0;
      const alpha_im = st?.vector?.alpha?.imag ?? 0.0;
      const beta_re = st?.vector?.beta?.real ?? 0.0;
      const beta_im = st?.vector?.beta?.imag ?? 0.0;

      const res = await api.simulateTeleportation({
        alpha_real: alpha_re,
        alpha_imag: alpha_im,
        beta_real: beta_re,
        beta_imag: beta_im,
        basis: teleportBasis,
        shots: 1000,
        bit_flip_prob: Number(channelNoise)
      });
      setTeleportResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (eigenstates.length > 0 && !teleportResult) {
      runTeleportation();
    }
  }, [eigenstates]);

  // Compute 2D Bloch sphere projection for visualization
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const phiRad = (phiDeg * Math.PI) / 180;
  const xCoord = Math.sin(thetaRad) * Math.cos(phiRad);
  const yCoord = Math.sin(thetaRad) * Math.sin(phiRad);
  const zCoord = Math.cos(thetaRad);

  // SVG projection constants
  const cx = 130;
  const cy = 130;
  const r = 100;
  // Isometric projection
  const px = cx + r * (xCoord * Math.cos(Math.PI / 6) - yCoord * Math.cos(Math.PI / 6));
  const py = cy - r * (zCoord - 0.5 * (xCoord * Math.sin(Math.PI / 6) + yCoord * Math.sin(Math.PI / 6)));

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Quantum Mechanics Simulation Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
          Rigorous mathematical simulation of Pauli operators, Bell state entanglement, and teleportation protocol.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        {[
          { id: 'teleportation', label: 'Quantum Teleportation', icon: Zap },
          { id: 'bloch', label: 'Bloch Sphere & Qubit State', icon: Atom },
          { id: 'pauli', label: 'Pauli Matrices & Gates', icon: Layers },
          { id: 'bell', label: 'Bell State Entanglement', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                background: active ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'rgba(255, 255, 255, 0.03)',
                color: active ? '#ffffff' : '#94a3b8',
                border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.85rem',
                padding: '8px 16px'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Quantum Teleportation */}
      {activeTab === 'teleportation' && (
        <div>
          {/* Controls */}
          <div className="q-card" style={{ marginBottom: '20px' }}>
            <div className="q-card-title">
              <Zap size={18} color="#06b6d4" />
              <span>Simulate Quantum Teleportation Protocol</span>
            </div>

            <div className="grid-3" style={{ alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Input Qubit State |ψ⟩</label>
                <select
                  className="q-select"
                  value={selectedStateLabel}
                  onChange={(e) => setSelectedStateLabel(e.target.value)}
                >
                  <option value="|0⟩">|0⟩ (Ground State)</option>
                  <option value="|1⟩">|1⟩ (Excited State)</option>
                  <option value="|+⟩">|+⟩ = (|0⟩+|1⟩)/√2</option>
                  <option value="|–⟩">|–⟩ = (|0⟩-|1⟩)/√2</option>
                  <option value="|+i⟩">|+i⟩ = (|0⟩+i|1⟩)/√2</option>
                  <option value="|–i⟩">|–i⟩ = (|0⟩-i|1⟩)/√2</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Channel Disturbance (Noise Intensity: {(channelNoise * 100).toFixed(0)}%)</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={channelNoise}
                  onChange={(e) => setChannelNoise(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#06b6d4' }}
                />
              </div>

              <button
                onClick={runTeleportation}
                disabled={isSimulating}
                className="btn btn-primary"
                style={{ width: '100%', height: '42px' }}
              >
                <Play size={16} />
                {isSimulating ? 'Simulating...' : 'RUN TELEPORTATION'}
              </button>
            </div>
          </div>

          {/* Teleportation Execution Result */}
          {teleportResult && (
            <div className="grid-2" style={{ marginBottom: '24px' }}>
              {/* Teleportation Steps */}
              <div className="q-card">
                <div className="q-card-title">
                  <span>Sequential 8-Step Teleportation Protocol</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                  {teleportResult.steps.map((st) => (
                    <div
                      key={st.step_number}
                      style={{
                        padding: '12px 14px',
                        background: '#070b16',
                        borderRadius: '8px',
                        border: '1px solid rgba(56, 189, 248, 0.15)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                          Step {st.step_number}: {st.title}
                        </div>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
                          {st.equation}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                        {st.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#10b981', marginTop: '4px' }}>
                        State: {st.state_description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantum Teleportation Metrics */}
              <div className="q-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="q-card-title">
                    <span>Teleportation Fidelity & Classical Bits</span>
                  </div>

                  <div style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Quantum State Fidelity</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: teleportResult.fidelity >= 0.99 ? '#34d399' : '#f87171', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
                      {(teleportResult.fidelity * 100).toFixed(2)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: teleportResult.fidelity >= 0.99 ? '#10b981' : '#f87171' }}>
                      {teleportResult.fidelity >= 0.99 ? 'Exact state transfer (Ideal channel)' : 'State disturbed by channel manipulation'}
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#070b16', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Alice Classical Bits</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        ({teleportResult.classical_bits})
                      </div>
                    </div>

                    <div style={{ background: '#070b16', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Bob Pauli Correction</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        U = {teleportResult.correction_applied}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.05)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    lineHeight: 1.6
                  }}>
                    <strong style={{ color: '#f8fafc' }}>Educational Teleportation Insight:</strong> Teleportation transfers the unknown quantum state |ψ⟩ using 1 pre-shared EPR Bell pair and 2 classical bits. No faster-than-light signalling occurs because Bob cannot reconstruct the state until receiving Alice's classical bits.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bloch Sphere */}
      {activeTab === 'bloch' && (
        <div className="grid-2">
          {/* Bloch Sphere Interactive Visual */}
          <div className="q-card" style={{ textAlign: 'center' }}>
            <div className="q-card-title">
              <Atom size={18} color="#06b6d4" />
              <span>Bloch Sphere Qubit State |ψ⟩</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <svg width="260" height="260" viewBox="0 0 260 260">
                {/* Outer sphere circle */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                {/* Equator ellipse */}
                <ellipse cx={cx} cy={cy} rx={r} ry={25} fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="4 4" />
                {/* Axis lines */}
                {/* Z axis (vertical) */}
                <line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke="#64748b" strokeWidth="1.5" />
                {/* X axis (diagonal down-left) */}
                <line x1={cx} y1={cy} x2={cx - r * 0.8} y2={cy + r * 0.5} stroke="#64748b" strokeWidth="1.5" />
                {/* Y axis (diagonal down-right) */}
                <line x1={cx} y1={cy} x2={cx + r * 0.9} y2={cy + r * 0.3} stroke="#64748b" strokeWidth="1.5" />

                {/* Axis Labels */}
                <text x={cx + 8} y={cy - r - 6} fill="#38bdf8" fontSize="12" fontWeight="700">|0⟩ (+z)</text>
                <text x={cx + 8} y={cy + r + 16} fill="#38bdf8" fontSize="12" fontWeight="700">|1⟩ (-z)</text>
                <text x={cx - r * 0.8 - 14} y={cy + r * 0.5 + 4} fill="#a855f7" fontSize="11">|+⟩ (x)</text>
                <text x={cx + r * 0.9 + 4} y={cy + r * 0.3 + 4} fill="#10b981" fontSize="11">|+i⟩ (y)</text>

                {/* Qubit State Vector */}
                <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f43f5e" strokeWidth="3" />
                <circle cx={px} cy={py} r="6" fill="#f43f5e" />
              </svg>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#f1f5f9', marginTop: '10px' }}>
              Vector: [{xCoord.toFixed(3)}, {yCoord.toFixed(3)}, {zCoord.toFixed(3)}]
            </div>
          </div>

          {/* Controls & Coordinates */}
          <div className="q-card">
            <div className="q-card-title">
              <span>Spherical Parameters & Amplitudes</span>
            </div>

            <div className="form-group">
              <label className="form-label">Polar Angle θ (0° to 180°): {thetaDeg}°</label>
              <input
                type="range" min="0" max="180" value={thetaDeg}
                onChange={(e) => setThetaDeg(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Azimuthal Angle φ (0° to 360°): {phiDeg}°</label>
              <input
                type="range" min="0" max="360" value={phiDeg}
                onChange={(e) => setPhiDeg(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            <div style={{
              background: '#070b16',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.8
            }}>
              <div style={{ color: '#38bdf8' }}>|ψ⟩ = cos(θ/2)|0⟩ + e^&#123;iφ&#125; sin(θ/2)|1⟩</div>
              <div style={{ color: '#f1f5f9' }}>α = {Math.cos(thetaRad/2).toFixed(4)}</div>
              <div style={{ color: '#f1f5f9' }}>β = {(Math.sin(thetaRad/2) * Math.cos(phiRad)).toFixed(4)} + {(Math.sin(thetaRad/2) * Math.sin(phiRad)).toFixed(4)}i</div>
              <div style={{ color: '#34d399', marginTop: '8px' }}>P(0) = |α|² = {(Math.cos(thetaRad/2)**2).toFixed(4)}</div>
              <div style={{ color: '#34d399' }}>P(1) = |β|² = {(Math.sin(thetaRad/2)**2).toFixed(4)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pauli Matrices */}
      {activeTab === 'pauli' && (
        <div className="grid-3">
          {pauliMatrices.map((op) => (
            <div key={op.name} className="q-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  Pauli {op.name}
                </span>
                <span className="badge badge-info">{op.is_unitary ? 'Unitary' : ''}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', minHeight: '40px' }}>
                {op.description}
              </div>

              {/* 2x2 Matrix Grid */}
              <div style={{
                margin: '16px 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                background: '#070b16',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                <div>{op.real_matrix[0][0]} {op.imag_matrix[0][0] !== 0 ? `${op.imag_matrix[0][0]}i` : ''}</div>
                <div>{op.real_matrix[0][1]} {op.imag_matrix[0][1] !== 0 ? `${op.imag_matrix[0][1]}i` : ''}</div>
                <div>{op.real_matrix[1][0]} {op.imag_matrix[1][0] !== 0 ? `${op.imag_matrix[1][0]}i` : ''}</div>
                <div>{op.real_matrix[1][1]} {op.imag_matrix[1][1] !== 0 ? `${op.imag_matrix[1][1]}i` : ''}</div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Eigenvalues: [{op.eigenvalues.join(', ')}]
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Bell States */}
      {activeTab === 'bell' && (
        <div className="grid-2">
          {bellStates.map((b) => (
            <div key={b.type} className="q-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                  {b.description}
                </span>
                <span className="badge badge-valid">Max Entangled</span>
              </div>

              <div style={{
                background: '#070b16',
                padding: '12px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                margin: '12px 0',
                color: '#38bdf8'
              }}>
                <pre>{b.circuit_ascii}</pre>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <div>Entropy: <strong style={{ color: '#34d399' }}>{b.entanglement_entropy} bit</strong></div>
                <div>Concurrence: <strong style={{ color: '#38bdf8' }}>{b.concurrence}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
