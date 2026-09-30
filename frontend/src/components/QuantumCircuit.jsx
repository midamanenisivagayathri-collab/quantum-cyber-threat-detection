import React from 'react';
import { ArrowRight, Activity, Zap } from 'lucide-react';

export default function QuantumCircuit({ currentStep = 8, classicalBits = '00', correction = 'I', fidelity = 1.0 }) {
  const steps = [
    { num: 1, label: 'Input Qubit |ψ⟩', desc: 'Alice state prep' },
    { num: 2, label: 'Bell Pair |Φ⁺⟩', desc: 'Entangled link' },
    { num: 3, label: 'Alice BSM', desc: 'CNOT + H gate' },
    { num: 4, label: `Bits (${classicalBits})`, desc: 'Classical transport' },
    { num: 5, label: `Bob Pauli ${correction}`, desc: 'Unitary recovery' },
    { num: 6, label: 'State |ψ\'⟩', desc: `Fidelity ${(fidelity * 100).toFixed(1)}%` },
    { num: 7, label: 'Projective Meas', desc: 'Statistical check' },
  ];

  return (
    <div style={{
      background: 'rgba(6, 9, 19, 0.7)',
      border: '1px solid rgba(56, 189, 248, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      overflowX: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="#06b6d4" />
          <span>Teleportation Circuit Architecture Flow</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>
          Quantum Channel ── EPR Entanglement ── Classical Link
        </div>
      </div>

      {/* SVG Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '700px', padding: '10px 0' }}>
        {steps.map((st, i) => (
          <React.Fragment key={st.num}>
            <div style={{
              flex: 1,
              background: '#0c1427',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              padding: '12px 10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8',
                fontSize: '0.72rem', fontWeight: 800, margin: '0 auto 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {st.num}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                {st.desc}
              </div>
            </div>

            {i < steps.length - 1 && (
              <ArrowRight size={16} color="#06b6d4" style={{ flexShrink: 0, opacity: 0.6 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Circuit Wire Diagram */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: '#05070e',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        color: '#38bdf8',
        lineHeight: 1.6,
        overflowX: 'auto'
      }}>
        <div>|ψ⟩_Alice ───■──────[ H ]──[ M ] ════ b₀ ════════════════════════ (Classical Channel)</div>
        <div>            │                                    ║                                     </div>
        <div>|0⟩_Alice ──X──[ M ] ════════════════ b₁ ═══════╬═════════════════════                </div>
        <div>            │                                    ║       ║                             </div>
        <div>|0⟩_Bob ────┼────────────────────────────────────╫───────╫──────[ Z^b₀ X^b₁ ]───&gt; |ψ'⟩_Bob</div>
        <div style={{ color: '#64748b', marginTop: '6px' }}>
          └─ EPR Distribution (|Φ⁺⟩ = (|00⟩+|11⟩)/√2) ────────┘       └─ Bob applies Pauli Correction
        </div>
      </div>
    </div>
  );
}
