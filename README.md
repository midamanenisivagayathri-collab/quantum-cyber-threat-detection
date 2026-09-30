# Quantum-Inspired Cyber Threat Detection for Digital Signature Security
### Teleportation-Based Quantum Digital Signature (QDS) Security Simulation

> **Scientific Notice & Educational Simulation Disclaimer:**  
> This project is a **quantum-inspired educational and cybersecurity simulation** of a teleportation-based Quantum Digital Signature (QDS) verification workflow.  
> It does **NOT** implement physical quantum hardware, optical fiber lines, or single-photon detectors. It does **NOT** claim or provide real-world quantum physical security guarantees. All statistical security calculations and forgery probabilities are strictly derived under explicit simulation model assumptions and configurable deterministic thresholds.  
> **NO ARTIFICIAL INTELLIGENCE OR MACHINE LEARNING IS USED.** All threat detection is 100% deterministic, mathematically explainable, and reproducible.

---

## 1. Problem Statement

Modern public-key cryptography (e.g., RSA, ECDSA) relies on mathematical hardness assumptions (integer factorization, discrete logarithms) that can be solved in polynomial time by quantum algorithms such as Shor's algorithm. 

This project explores how a **quantum-inspired digital signature verification workflow** can be simulated in software and how cyber threats can be detected by observing changes in quantum measurement statistics (Pauli eigenstate projections, Bell state teleportation fidelity, Total Variation Distance, and empirical error rates).

The prototype demonstrates deterministic detection of:
1. **Digital Signature Forgery:** Message tampering and hash digest alterations.
2. **Signer Impersonation:** Unregistered or untrusted entity claiming identity.
3. **Replay Attacks:** Re-submission of previously consumed nonces or signature tokens.
4. **Quantum Channel Manipulation:** Bit-flip ($X$) or phase-flip ($Z$) disturbance and classical bit tampering.
5. **Unauthorized Verification Probing:** Rapid automated attempts exceeding session rate limits.
6. **Suspicious Measurement Patterns:** Fluctuations breaching statistical distance and agreement thresholds.

---

## 2. PPT System Architecture Flow

The workflow implements the following logical architecture:

```
[1. User / Input] ──> Signer (Alice) inputs Message, Identity, and Basis
        ↓
[2. Signature & Identity Preparation] ──> SHA-256 Digest + Nonce + Timestamp
        ↓
[3. Quantum Signature Layer] ──> Pauli Eigenstate Preparation + Bell Pair Entanglement
        ↓
[4. Quantum Verification] ──> Bell State Measurement ──(b₀, b₁)──> Bob Pauli Correction ──> Projective Measurement
        ↓
[5. Statistical Analysis] ──> Error Rate (E) + Agreement (A) + Total Variation Distance δ(P, Q) + Forgery Probability
        ↓
[6. Threat Detection Engine] ──> 8 Deterministic Security Rules (No AI/ML)
        ↓
[7. Final Decision & Audit] ──> VALID SIGNATURE or THREAT DETECTED + Security Alert + Cryptographic Hash Chain Block
```

---

## 3. Technology Stack

- **Backend:** Python 3.13, FastAPI, Pydantic, NumPy (pure matrix mechanics simulation), Uvicorn.
- **Frontend:** React 19, Vite, Recharts, Lucide React, modern dark cybersecurity theme.
- **Cryptography & Security:** Classical SHA-256 for digest binding and sequential tamper-evident audit chaining.
- **Testing:** Python `unittest` suite (23 comprehensive tests covering all modules).

---

## 4. Project Directory Structure

```text
quantum-cyber-threat-detection/
│
├── backend/
│   ├── main.py                     # FastAPI application entry point & CORS
│   ├── requirements.txt             # Python backend dependencies
│   │
│   ├── quantum/                    # Quantum simulation module
│   │   ├── __init__.py
│   │   ├── qubit.py                # Single-qubit state, Bloch coordinates, fidelity
│   │   ├── bell_state.py           # Maximally entangled Bell pairs & entropy
│   │   ├── teleportation.py        # 8-step quantum teleportation protocol
│   │   ├── pauli.py                # Pauli spin matrices (I, X, Y, Z, H, S)
│   │   ├── eigenstates.py          # Mutually unbiased bases (Z, X, Y)
│   │   └── measurement.py          # Projective measurements & multinomial sampling
│   │
│   ├── signature/                  # Digital signature layer
│   │   ├── __init__.py
│   │   ├── generator.py            # SHA-256 bound Pauli state signature generation
│   │   └── signature_model.py      # QuantumSignature & StateReference data models
│   │
│   ├── verification/              # Deterministic verification engine
│   │   ├── __init__.py
│   │   ├── verifier.py             # Signature verifier & session tracker
│   │   ├── thresholds.py           # Configurable runtime security thresholds
│   │   └── decision.py             # VerificationResult & trace items
│   │
│   ├── statistics/                 # Mathematical & statistical metrics
│   │   ├── __init__.py
│   │   ├── metrics.py              # Error rate, agreement rate, TVD, KL divergence
│   │   ├── probability.py          # Binomial tail forgery probability estimator
│   │   └── distribution.py         # Comparative histogram formatters
│   │
│   ├── attacks/                    # Cyber attack simulators
│   │   ├── __init__.py
│   │   ├── forgery.py              # Message payload & digest tampering
│   │   ├── impersonation.py        # Untrusted signer identity testing
│   │   ├── replay.py               # Two-stage nonce replay capture
│   │   ├── channel.py              # Variable-intensity Pauli noise channel
│   │   └── unauthorized.py         # Rate-limit probing lockout
│   │
│   ├── security/                   # Rules & audit logging
│   │   ├── __init__.py
│   │   ├── threat_detector.py      # Rule consolidation & explainable alert trace
│   │   ├── security_rules.py       # 8 deterministic evaluation gates
│   │   └── audit_log.py            # Tamper-evident SHA-256 hash pointer chain
│   │
│   ├── experiment/                 # Scientific simulation runners
│   │   └── experiment_runner.py    # Baseline, comparison, what-if, multi-trial, full demo
│   │
│   ├── models/                     # Pydantic schemas
│   │   ├── requests.py
│   │   └── responses.py
│   │
│   ├── api/                        # FastAPI routers
│   │   ├── signature_routes.py
│   │   ├── attack_routes.py
│   │   ├── quantum_routes.py
│   │   └── experiment_routes.py
│   │
│   └── tests/                      # Automated test suite
│       ├── test_quantum.py
│       ├── test_signature.py
│       ├── test_verification.py
│       ├── test_attacks.py
│       ├── test_statistics.py
│       └── test_api.py
│
├── frontend/                       # React + Vite web dashboard
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Master application & Full Demo modal
│       ├── index.css               # Global dark quantum cybersecurity theme
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Header.jsx
│       │   ├── MetricCard.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── QuantumCircuit.jsx
│       │   └── SecurityAlert.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── SignatureVerification.jsx
│       │   ├── QuantumSimulation.jsx
│       │   ├── AttackSimulator.jsx
│       │   ├── SecurityAnalytics.jsx
│       │   ├── SecurityLogs.jsx
│       │   ├── ExperimentLab.jsx
│       │   └── QuantumConcepts.jsx
│       ├── charts/
│       │   ├── AttackChart.jsx
│       │   ├── MeasurementChart.jsx
│       │   └── SecurityChart.jsx
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── formatters.js
│
├── docs/                           # Technical documentation
│   ├── architecture.md
│   ├── quantum_model.md
│   ├── security_model.md
│   ├── attack_model.md
│   ├── experiment_results.md
│   └── presentation_guide.md       # Complete 12-slide PPT outline & Viva Defense guide
│
├── run_tests.py                    # Standalone test runner
├── README.md
└── .gitignore
```

---

## 5. Mathematical & Statistical Model

### Quantum Teleportation Protocol
Given input qubit $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ and pre-shared Bell state $|\Phi^+\rangle = \frac{|00\rangle+|11\rangle}{\sqrt{2}}$, Alice's Bell-state measurement collapses the system into one of 4 classical outcomes $(b_0, b_1) \in \{00, 01, 10, 11\}$. Bob applies unitary Pauli correction:

$$U_{\text{Bob}} = Z^{b_0} X^{b_1}$$

recovering $|\psi'\rangle$ with unit quantum fidelity $F(|\psi\rangle, |\psi'\rangle) = |\langle\psi|\psi'\rangle|^2 = 1.0$ under pristine conditions.

### Statistical Distance & Deterministic Metrics
1. **Error Rate ($E$):** $E = \frac{c_{\text{unexpected}}}{N}$
2. **Agreement Rate ($A$):** $A = \frac{c_{\text{expected}}}{N} = 1 - E$
3. **Total Variation Distance (TVD):** $\delta(P, Q) = \frac{1}{2}\sum_x |P(x) - Q(x)|$
4. **Forgery Probability Bound:** $P_{\text{forgery}} = \left[\sum_{k = \lceil N\theta \rceil}^N \binom{N}{k} p_{\text{guess}}^k (1-p_{\text{guess}})^{N-k}\right]^M$

### Security Rules (Deterministic Gates)
- `RULE-01`: Signer Authorization ($\text{signer\_id} \in \text{TrustRegistry}$)
- `RULE-02`: Hash Digest Match ($\text{SHA256}(\text{msg}) = \text{claimed\_hash}$)
- `RULE-03`: Fresh Nonce & Signature ($\text{nonce} \notin \text{Consumed}$)
- `RULE-04`: Timestamp Window ($\Delta t \le 300\text{s}$)
- `RULE-05`: Attempt Rate Limit ($\text{attempts} \le 3$)
- `RULE-06`: Quantum Error Bound ($E \le 10.0\%$)
- `RULE-07`: Quantum Agreement Bound ($A \ge 90.0\%$)
- `RULE-08`: Total Variation Distance ($\delta \le 0.1500$)

---

## 6. Installation & Execution Guide

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js v22)
- npm 9+

### Backend Setup & Execution
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Backend will start at: `http://localhost:8000`  
   API Interactive Docs: `http://localhost:8000/docs`

### Frontend Setup & Execution
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will start at: `http://localhost:5173`

---

## 7. Automated Test Suite

Run the full automated test suite (23 deterministic tests):
```bash
python run_tests.py
```
Or with Python's built-in test runner:
```bash
python -m unittest discover -s backend/tests -p "test_*.py"
```

All 23 tests execute deterministically in $< 3$ seconds, covering:
- Basis states & normalization
- Pauli X, Y, Z, H, S unitarity and eigenvalues
- Bell state entanglement entropy and concurrence
- Teleportation protocol fidelity
- SHA-256 signature generation and collision resistance
- Deterministic verification rules
- All 5 cyber attack detection vectors
- Total Variation Distance and KL divergence
- Forgery probability calculations
- SHA-256 audit chain integrity & tamper detection
- Reproducible multi-trial experiments with fixed random seeds
- FastAPI REST endpoints

---

## 8. One-Click Full Security Demo

1. Open the web dashboard at `http://localhost:5173`.
2. Click the prominent **"RUN FULL SECURITY DEMO"** button in the sidebar or header.
3. The automated test sequence will sequentially:
   - **Step 1:** Generate legitimate quantum signature for Alice.
   - **Step 2:** Verify legitimate signature $\implies$ `VALID SIGNATURE`.
   - **Step 3:** Perform digital forgery $\implies$ `THREAT DETECTED (FORGERY)`.
   - **Step 4:** Perform replay attack $\implies$ `THREAT DETECTED (REPLAY)`.
   - **Step 5:** Perform impersonation attack $\implies$ `THREAT DETECTED (IMPERSONATION)`.
   - **Step 6:** Perform quantum channel manipulation intensity sweep $\implies$ `THREAT DETECTED (QUANTUM_CHANNEL_MANIPULATION)`.
   - **Step 7:** Verify cryptographic SHA-256 audit chain integrity.
   - **Step 8:** Display the comprehensive audit report modal with FAR, FRR, and latency telemetry.

---

## 9. API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and ML-free assurance |
| `POST` | `/api/signature/generate` | Generate quantum digital signature |
| `POST` | `/api/signature/verify` | Verify signature with deterministic rules |
| `GET` | `/api/signature/{sig_id}` | Retrieve stored signature record |
| `GET` | `/api/attack/types` | List available cyber attack vectors |
| `POST` | `/api/attack/simulate` | Execute simulated attack against signature |
| `GET` | `/api/quantum/pauli` | Pauli matrices, eigenvalues, and gates |
| `GET` | `/api/quantum/eigenstates` | 6 canonical Pauli eigenstates metadata |
| `GET` | `/api/quantum/bell-states` | Bell state vectors and entanglement entropy |
| `POST` | `/api/quantum/teleportation/simulate` | 8-step teleportation protocol simulation |
| `POST` | `/api/quantum/measurement/run` | Projective measurement sampling |
| `POST` | `/api/experiment/run` | Run scientific experiment (Baseline, Sweep, Multi-trial) |
| `POST` | `/api/experiment/full-demo` | One-click master security demonstration |
| `POST` | `/api/experiment/legitimacy-benchmark` | Run 10x repeated valid signature test (0% FRR) |
| `GET` | `/api/thresholds` | Retrieve active verification thresholds |
| `POST` | `/api/thresholds` | Dynamically update verification thresholds |
| `GET` | `/api/security/logs` | Retrieve append-only security event logs |
| `GET` | `/api/security/audit-chain/verify` | Validate cryptographic SHA-256 hash pointers |
| `POST` | `/api/security/audit-chain/simulate-tampering` | Inject simulated log alteration |
| `GET` | `/api/statistics` | Real-time computed SOC dashboard metrics |

---

## 10. Scientific Limitations & Future Scope

### Limitations
- **Simulation Environment:** Operates entirely in classical software using NumPy matrix mechanics; it does not deploy physical quantum key distribution (QKD) hardware or optical quantum repeaters.
- **Physical Channel Realism:** Channel noise is modeled as discrete Pauli channels (bit/phase flips) and classical channel corruption; continuous decoherence models ($T_1$, $T_2^*$ relaxation) are omitted for clarity.
- **Deterministic Trust Registry:** Authorized signer identities are managed via a deterministic public key registry rather than an asymmetric PKI hierarchy.

### Future Scope
- Integration with physical QPU backends (e.g. IBM Quantum Experience via Qiskit Runtime).
- Multi-party quantum digital signature schemes with untrusted arbitrators.
- Simulation of continuous variable (CV) quantum digital signatures using coherent states.
- Hardware security module (HSM) quantum random number generator (QRNG) seed integration.
