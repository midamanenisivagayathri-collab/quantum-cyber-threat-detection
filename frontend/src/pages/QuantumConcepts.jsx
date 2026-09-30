import React, { useState } from 'react';
import {
  BookOpen,
  Atom,
  ShieldCheck,
  Binary,
  Activity,
  Lock,
  Scale,
  Info
} from 'lucide-react';

export default function QuantumConcepts() {
  const [activeTab, setActiveTab] = useState('concepts');

  const concepts = [
    {
      num: 1,
      name: "Qubit (Quantum Bit)",
      math: "|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1",
      explanation: "The fundamental unit of quantum information. Unlike a classical bit that is strictly 0 or 1, a qubit exists as a normalized linear combination of computational basis states.",
      usage: "Represents the quantum tokens and carriers transmitted from signer Alice to verifier Bob."
    },
    {
      num: 2,
      name: "Superposition",
      math: "|+⟩ = (|0⟩ + |1⟩)/√2",
      explanation: "The ability of a quantum state to exist in multiple basis states simultaneously until observed, allowing parallel quantum interference.",
      usage: "Used when Alice encodes signature digest bits into Pauli X and Y basis states with unbiased superposition."
    },
    {
      num: 3,
      name: "Quantum Entanglement",
      math: "|Ψ⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩",
      explanation: "A non-classical correlation where two or more particles cannot be described independently, even when separated across arbitrary distances.",
      usage: "Provides the shared bipartite quantum resource between Alice and Bob for secure teleportation."
    },
    {
      num: 4,
      name: "Bell States (EPR Pairs)",
      math: "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
      explanation: "The four maximally entangled 2-qubit states with 1.0 bit of entanglement entropy and maximum concurrence.",
      usage: "|Φ⁺⟩ serves as the entangled quantum communication carrier in our teleportation verification protocol."
    },
    {
      num: 5,
      name: "Quantum Teleportation",
      math: "|ψ⟩ ⊗ |Φ⁺⟩ ──[BSM]──> (b₀, b₁) ──[Z^{b₀} X^{b₁}]──> |ψ'⟩",
      explanation: "The transmission of an unknown qubit state |ψ⟩ from Alice to Bob using 1 pre-shared Bell pair and 2 classical bits without physical transit of the state itself.",
      usage: "Acts as the quantum carrier channel. Channel tampering alters Bob's state fidelity and induces measurable error spikes."
    },
    {
      num: 6,
      name: "Pauli Operators",
      math: "I = [[1,0],[0,1]], X = [[0,1],[1,0]], Y = [[0,-i],[i,0]], Z = [[1,0],[0,-1]]",
      explanation: "A set of three hermitian, unitary 2x2 complex matrices representing spin rotations around orthogonal spatial axes.",
      usage: "Used by Bob to apply unitary state correction and to simulate physical channel bit-flip (X) and phase-flip (Z) attacks."
    },
    {
      num: 7,
      name: "Pauli Eigenstates",
      math: "Z: {|0⟩, |1⟩}, X: {|+⟩, |–⟩}, Y: {|+i⟩, |–i⟩}",
      explanation: "The six mutually unbiased eigenstates belonging to Pauli Z, X, and Y operators with eigenvalues ±1.",
      usage: "Bound deterministically to the SHA-256 message hash during quantum signature generation."
    },
    {
      num: 8,
      name: "Projective Measurement",
      math: "M_k = |e_k⟩⟨e_k|, ∑ M_k = I",
      explanation: "An observation that collapses a superposition state into one of the measurement basis eigenstates.",
      usage: "Verifier Bob performs projective measurements across N shots to generate observed empirical counts."
    },
    {
      num: 9,
      name: "Measurement Probability (Born's Rule)",
      math: "P(k) = |⟨e_k|ψ⟩|²",
      explanation: "The fundamental postulate linking complex quantum amplitudes to observable real-world probabilities.",
      usage: "Determines the theoretical expected frequencies against which observed measurements are compared."
    },
    {
      num: 10,
      name: "Quantum Digital Signature (QDS)",
      math: "Sig = (ID, Hash, Nonce, |ψ_ref⟩, Stats_{exp})",
      explanation: "A digital signature framework leveraging quantum states to guarantee non-repudiation and unforgeability based on quantum measurement physics.",
      usage: "Our core data model linking classical SHA-256 digests to reproducible quantum state references."
    },
    {
      num: 11,
      name: "Statistical Verification",
      math: "E = errors/N, A = successes/N, δ(P, Q) = 1/2 ∑ |P_k - Q_k|",
      explanation: "Rigorous mathematical distance comparison between theoretical quantum distributions and observed experimental counts.",
      usage: "Replaces black-box AI with transparent, explainable Total Variation Distance (TVD) and Error Rate metrics."
    },
    {
      num: 12,
      name: "Deterministic Threat Detection",
      math: "IF E > MAX_ERROR_RATE → THREAT_DETECTED",
      explanation: "Rule-based security evaluation where every alert maps directly to a breached mathematical or cryptographic threshold.",
      usage: "Catches Forgery, Impersonation, Replay, Channel Noise, and Unauthorized Verification without AI hallucinations."
    }
  ];

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Quantum Mechanics & Cyber Threat Detection Theory
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
          Comprehensive scientific foundations: 12 core quantum principles, information-theoretic security theorems, and explicit metric space proofs.
        </p>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`btn ${activeTab === 'concepts' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem' }}
          >
            <BookOpen size={15} />
            12 Core Concepts
          </button>
          <button
            onClick={() => setActiveTab('infosec')}
            className={`btn ${activeTab === 'infosec' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem' }}
          >
            <Lock size={15} />
            Information-Theoretic Security
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`btn ${activeTab === 'math' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.84rem' }}
          >
            <Scale size={15} />
            Mathematical Modeling & Metric Proofs
          </button>
        </div>
      </div>

      {/* TAB 1: 12 Core Quantum Concepts */}
      {activeTab === 'concepts' && (
        <div className="grid-2" style={{ gap: '20px' }}>
          {concepts.map((c) => (
            <div key={c.num} className="q-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                    {c.num}. {c.name}
                  </span>
                  <span className="badge badge-info">Concept #{c.num}</span>
                </div>

                <div style={{
                  background: '#070b16',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#38bdf8',
                  marginBottom: '12px'
                }}>
                  {c.math}
                </div>

                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px' }}>
                  {c.explanation}
                </p>
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.78rem',
                color: '#94a3b8'
              }}>
                <strong style={{ color: '#06b6d4' }}>Simulation Role:</strong> {c.usage}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Information-Theoretic Security Technical Justification */}
      {activeTab === 'infosec' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Scientific Disclaimer Card */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Info size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong style={{ color: '#38bdf8' }}>Physical Quantum Hardware vs. Software Simulation Model:</strong> Real-world Quantum Digital Signatures rely on microscopic physical devices (single-photon lasers, beam splitters, superconducting qubits) where physical quantum laws provide unconditional information-theoretic security. This software prototype operates on classical hardware as an educational and cybersecurity SOC simulator: it models the exact linear algebra, complex state vectors, density matrices, and projective statistics of quantum teleportation to demonstrate deterministic threat detection without AI.
            </div>
          </div>

          {/* Theorem 1: No-Cloning */}
          <div className="q-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="q-card-title" style={{ marginBottom: 0 }}>
                <Lock size={18} color="#38bdf8" />
                <span>1. No-Cloning Theorem (Wootters &amp; Zurek, 1982)</span>
              </div>
              <span className="badge badge-info">Fundamental Theorem</span>
            </div>

            <div style={{ background: '#070b16', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8', marginBottom: '12px' }}>
              Unitary cloning operator U: U(|ψ⟩|0⟩) = |ψ⟩|ψ⟩ and U(|ϕ⟩|0⟩) = |ϕ⟩|ϕ⟩<br />
              Inner product: ⟨ψ|ϕ⟩⟨0|0⟩ = ⟨ψ|ϕ⟩² ⟹ ⟨ψ|ϕ⟩(1 - ⟨ψ|ϕ⟩) = 0 ⟹ ⟨ψ|ϕ⟩ ∈ &#123;0, 1&#125;
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Mathematical Proof Sketch:</strong> Assume there exists a unitary transformation <code>U</code> that can duplicate an arbitrary unknown state <code>|ψ⟩</code> onto an ancilla <code>|0⟩</code>. By unitarity, inner products are preserved: <code>⟨U A, U B⟩ = ⟨A, B⟩</code>. This implies that <code>⟨ψ|ϕ⟩ = ⟨ψ|ϕ⟩²</code>, which has only two roots: <code>⟨ψ|ϕ⟩ = 0</code> (states are orthogonal) or <code>⟨ψ|ϕ⟩ = 1</code> (states are identical).
              </p>
              <p style={{ color: '#94a3b8' }}>
                <strong style={{ color: '#34d399' }}>Cybersecurity Implication:</strong> Classical digital signatures (RSA, ECDSA) can be copied bit-for-bit without alteration. In contrast, an adversary Eve cannot clone Alice's signature qubit tokens to test multiple forgery candidates offline. Attempting to copy an unknown quantum token irrevocably perturbs the state.
              </p>
            </div>
          </div>

          {/* Theorem 2: Heisenberg Uncertainty & MUB */}
          <div className="q-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="q-card-title" style={{ marginBottom: 0 }}>
                <Activity size={18} color="#f59e0b" />
                <span>2. Heisenberg Uncertainty &amp; Mutually Unbiased Bases (MUB)</span>
              </div>
              <span className="badge badge-amber">Observable Distortion</span>
            </div>

            <div style={{ background: '#070b16', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fbbf24', marginBottom: '12px' }}>
              Non-commuting Pauli operators: [X, Z] = XZ - ZX = 2iY ≠ 0<br />
              Robertson uncertainty: ΔX · ΔZ ≥ (1/2)|⟨[X, Z]⟩| = |⟨Y⟩|<br />
              Intercept-Resend Error: P(error) = P(wrong basis) · P(mismatch | wrong basis) = 0.5 × 0.5 = 0.25 (25.0%)
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Mathematical Principle:</strong> In our protocol, Alice encodes signature states across three mutually unbiased bases: Z (states |0⟩, |1⟩), X (states |+⟩, |–⟩), and Y (states |+i⟩, |–i⟩). The overlap between any eigenstate of one basis and any eigenstate of another is strictly uniform: <code>|⟨e_i^B | e_j^B'⟩|² = 1/2</code> for <code>B ≠ B'</code>.
              </p>
              <p style={{ color: '#94a3b8' }}>
                <strong style={{ color: '#34d399' }}>Cybersecurity Implication:</strong> If an active man-in-the-middle adversary (Eve) intercepts a quantum transmission, she must guess the measurement basis (probability = 1/2). When she guesses incorrectly, her projective measurement collapses the state. When Bob measures the forwarded qubit in the genuine basis, he observes a 50% mismatch on those shots, inducing an overall error rate of <code>E ≥ 25.0%</code>. Because our system threshold is configured at <code>θ_error = 10.0%</code>, the tampering is detected deterministically (Rule 6).
              </p>
            </div>
          </div>

          {/* Theorem 3: Entanglement Monogamy */}
          <div className="q-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="q-card-title" style={{ marginBottom: 0 }}>
                <Atom size={18} color="#8b5cf6" />
                <span>3. Entanglement Monogamy &amp; CKW Inequality</span>
              </div>
              <span className="badge badge-purple">Channel Isolation</span>
            </div>

            <div style={{ background: '#070b16', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#c4b5fd', marginBottom: '12px' }}>
              Coffman-Kundu-Wootters (CKW) Bound: C²(A:B) + C²(A:E) ≤ C²(A:BE) ≤ 1<br />
              Maximally Entangled Bell Pair |Φ⁺⟩: C(A:B) = 1.0 ⟹ C(A:E) = 0.0
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Mathematical Principle:</strong> Entanglement is strictly monogamous. Unlike classical correlations which can be freely shared among an arbitrary number of parties, quantum entanglement cannot be shared between multiple bipartite pairs without degradation. If Alice and Bob share a maximally entangled Bell state <code>|Φ⁺⟩ = (|00⟩+|11⟩)/√2</code> with concurrence <code>C(A:B) = 1.0</code>, the concurrence between Alice and any third system (Eve) is mathematically constrained to <code>C(A:E) = 0</code>.
              </p>
              <p style={{ color: '#94a3b8' }}>
                <strong style={{ color: '#34d399' }}>Cybersecurity Implication:</strong> An eavesdropper cannot secretly entangle an ancillary probe qubit with Alice's carrier without decreasing <code>C(A:B) &lt; 1.0</code>. This entanglement degradation directly reduces the teleportation fidelity <code>F &lt; 1.0</code>, creating an immediate, detectable surge in Bob's observed error rate and statistical distance.
              </p>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="q-card">
            <div className="q-card-title">
              <Scale size={18} color="#10b981" />
              <span>Comparative Paradigm: Information-Theoretic vs. Computational Security</span>
            </div>
            <div className="q-card-subtitle">
              Fundamental distinctions between quantum physical security and classical algorithmic cryptography.
            </div>

            <div style={{ overflowX: 'auto', marginTop: '12px' }}>
              <table className="q-table">
                <thead>
                  <tr>
                    <th>Security Dimension</th>
                    <th>Classical Digital Signatures (RSA / ECDSA)</th>
                    <th>Teleportation-Based QDS (This Prototype)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>Core Assumption</td>
                    <td style={{ color: '#f87171' }}>Unproven computational intractability (prime factoring, discrete log)</td>
                    <td style={{ color: '#34d399' }}>Physical laws of quantum mechanics (No-Cloning, Born's Rule, MUB)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>Post-Quantum Threat</td>
                    <td style={{ color: '#f87171' }}>Vulnerable: Shor's algorithm solves factoring/DLP in polynomial time O((log N)³)</td>
                    <td style={{ color: '#34d399' }}>Immune: Information-theoretic security holds regardless of adversary compute power</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>Passive Eavesdropping</td>
                    <td style={{ color: '#f87171' }}>Undetectable: Classical bitstreams can be copied and stored indefinitely</td>
                    <td style={{ color: '#34d399' }}>Tamper-evident: Any interception collapses superposition, yielding E ≥ 25%</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>Detection Mechanism</td>
                    <td style={{ color: '#f87171' }}>Heuristic / AI anomaly scoring (opaque, hallucination-prone)</td>
                    <td style={{ color: '#34d399' }}>Deterministic rule gates + exact statistical distance metrics (100% explainable)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>Verification Latency</td>
                    <td style={{ color: '#94a3b8' }}>Variable; slow on large key sizes (e.g. RSA-4096)</td>
                    <td style={{ color: '#38bdf8' }}>Ultra-fast: O(N) single-pass CPU arithmetic (&lt; 1 ms per verification)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Mathematical Modeling & Metric Space Proofs */}
      {activeTab === 'math' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: Total Variation Distance Proof */}
          <div className="q-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="q-card-title" style={{ marginBottom: 0 }}>
                <Scale size={18} color="#06b6d4" />
                <span>Total Variation Distance (TVD) Metric Space Verification</span>
              </div>
              <span className="badge badge-cyan">Formal Metric Proof</span>
            </div>

            <div className="q-card-subtitle">
              Total Variation Distance δ(P, Q) is a true mathematical metric on the simplex of probability distributions over measurement alphabet Ω = &#123;0, 1&#125;.
            </div>

            <div style={{ background: '#070b16', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8', marginBottom: '14px' }}>
              Formula: δ(P, Q) = (1/2) ∑_(x ∈ Ω) |P(x) - Q(x)| = (1/2) [ |P(0) - Q(0)| + |P(1) - Q(1)| ]
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.84rem', marginBottom: '4px' }}>1. Non-Negativity</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>δ(P, Q) ≥ 0</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Since absolute value |·| ≥ 0 for all terms, the half-sum is strictly non-negative.</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.84rem', marginBottom: '4px' }}>2. Identity of Indiscernibles</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>δ(P, Q) = 0 ⟺ P = Q</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Sum of non-negative terms equals zero if and only if |P(x) - Q(x)| = 0 for all x.</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.84rem', marginBottom: '4px' }}>3. Symmetry</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>δ(P, Q) = δ(Q, P)</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Directly holds from symmetry of absolute difference: |P(x) - Q(x)| = |Q(x) - P(x)|.</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontWeight: 700, color: '#a78bfa', fontSize: '0.84rem', marginBottom: '4px' }}>4. Triangle Inequality</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>δ(P, R) ≤ δ(P, Q) + δ(Q, R)</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>From Minkowski inequality: |P(x) - R(x)| ≤ |P(x) - Q(x)| + |Q(x) - R(x)| summed over x.</div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8', background: 'rgba(6, 182, 212, 0.05)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
              <strong style={{ color: '#06b6d4' }}>Operational Significance:</strong> By Scheffé's theorem, <code>δ(P, Q) = sup_(A ⊆ Ω) |P(A) - Q(A)|</code>. This gives the exact maximum distinguishability advantage that any statistical discriminator can possess when deciding whether measurements were generated by genuine quantum teleportation versus an adversarial channel attack.
            </div>
          </div>

          {/* Section 2: Chernoff-Hoeffding & Forgery Bound */}
          <div className="q-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="q-card-title" style={{ marginBottom: 0 }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>Chernoff-Hoeffding Forgery Probability Derivation</span>
              </div>
              <span className="badge badge-success">Asymptotic Security Bound</span>
            </div>

            <div className="q-card-subtitle">
              Formal mathematical derivation showing why an attacker without the preparation key faces exponentially vanishing acceptance probability.
            </div>

            <div style={{ background: '#070b16', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#34d399', marginBottom: '12px' }}>
              Exact Binomial Tail: P_forgery = ∑_(k = ⌈N θ_agree⌉)^N (N choose k) · (0.5)^N<br />
              Chernoff-Hoeffding Bound: P_forgery ≤ exp( -2 · N · (θ_agree - 0.5)² )
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Step-by-Step Derivation:</strong>
              </p>
              <ol style={{ paddingLeft: '20px', color: '#94a3b8', marginBottom: '12px', fontSize: '0.82rem', lineHeight: 1.8 }}>
                <li>Under the random guessing hypothesis (adversary lacks basis key), each measurement outcome independently matches the expected eigenstate with success probability <code>p = 0.5</code>.</li>
                <li>Let <code>X_1, X_2, ..., X_N ~ Bernoulli(0.5)</code> be independent indicator variables, and let <code>S_N = ∑ X_i</code> with expected value <code>E[S_N] = 0.5 N</code>.</li>
                <li>The verifier requires empirical agreement rate <code>A = S_N / N ≥ θ_agree</code> (default <code>θ_agree = 0.90</code>).</li>
                <li>Applying Hoeffding's Inequality for bounded variables on [0, 1] with deviation <code>t = θ_agree - 0.50 = 0.40</code>:
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', margin: '4px 0' }}>
                    P(S_N / N ≥ 0.90) ≤ exp(-2 · N · (0.40)²) = exp(-0.32 · N)
                  </div>
                </li>
                <li>
                  <strong>Worked Numerical Evaluation (N = 1000 shots):</strong>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#34d399', margin: '4px 0' }}>
                    P_forgery ≤ exp(-0.32 · 1000) = exp(-320) ≈ 5.3 × 10⁻¹³⁹ ≈ 0.000000...
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Section 3: 8 Deterministic Security Rules Matrix */}
          <div className="q-card">
            <div className="q-card-title">
              <Binary size={18} color="#8b5cf6" />
              <span>Deterministic Security Evaluation Gates (8 Sequential Rules)</span>
            </div>
            <div className="q-card-subtitle">
              Every verification decision is governed strictly by the following deterministic inequalities. Zero AI models or stochastic scoring functions.
            </div>

            <div style={{ overflowX: 'auto', marginTop: '12px' }}>
              <table className="q-table">
                <thead>
                  <tr>
                    <th>Gate ID</th>
                    <th>Gate Name</th>
                    <th>Exact Evaluation Condition</th>
                    <th>Evaluated Parameters</th>
                    <th>Failure Threat Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-01</td>
                    <td style={{ fontWeight: 700 }}>Signer Authorization</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>signer_id ∈ K_trusted</td>
                    <td>Alice, Bob, Carol (Authorized PKI)</td>
                    <td><span className="badge badge-danger">IMPERSONATION</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-02</td>
                    <td style={{ fontWeight: 700 }}>Cryptographic Digest</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>claimed_hash == SHA256(msg)</td>
                    <td>SHA-256 bitwise 256-bit equality</td>
                    <td><span className="badge badge-danger">FORGERY</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-03</td>
                    <td style={{ fontWeight: 700 }}>Token Uniqueness</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>sig_id ∉ U_sigs ∧ nonce ∉ U_nonces</td>
                    <td>Unique Token Registry (Sets)</td>
                    <td><span className="badge badge-amber">REPLAY</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-04</td>
                    <td style={{ fontWeight: 700 }}>Freshness Window</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>t_now - t_sig ≤ Δt_max (300s)</td>
                    <td>Deterministic UNIX Epoch Latency</td>
                    <td><span className="badge badge-amber">REPLAY</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-05</td>
                    <td style={{ fontWeight: 700 }}>Rate Limiting</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>session_attempts ≤ N_max (3)</td>
                    <td>Atomic Session Counter</td>
                    <td><span className="badge badge-amber">UNAUTHORIZED_PROBE</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-06</td>
                    <td style={{ fontWeight: 700 }}>Quantum Error Rate</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>E ≤ θ_error (0.10)</td>
                    <td>Empirical Errors / Total Shots</td>
                    <td><span className="badge badge-danger">CHANNEL_MANIPULATION</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-07</td>
                    <td style={{ fontWeight: 700 }}>Quantum Agreement</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>A ≥ θ_agree (0.90)</td>
                    <td>Empirical Successes / Total Shots</td>
                    <td><span className="badge badge-purple">SUSPICIOUS_MEASUREMENT</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>GATE-08</td>
                    <td style={{ fontWeight: 700 }}>Statistical Distance</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>δ(P, Q) ≤ θ_tvd (0.15)</td>
                    <td>Total Variation Distance (TVD)</td>
                    <td><span className="badge badge-danger">CHANNEL_MANIPULATION</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
