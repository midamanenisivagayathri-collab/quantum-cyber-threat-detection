# System Architecture: Quantum-Inspired Cyber Threat Detection

## 1. System Overview

This software system represents an educational and cybersecurity simulation of a teleportation-based Quantum Digital Signature (QDS) verification workflow. The architecture demonstrates how non-classical quantum state correlation and measurement statistics can detect classical forgeries, identity impersonation, replay attacks, channel eavesdropping, and tampering deterministically without using artificial intelligence or machine learning.

```mermaid
flowchart TD
    subgraph S1 ["1. Input & Signer Layer"]
        A1["Alice (Signer)"] --> A2["Message Payload + Timestamp + Nonce"]
        A2 --> A3["Cryptographic Digest (SHA-256)"]
    end

    subgraph S2 ["2. Quantum Preparation Layer"]
        A3 --> B1["Pauli Eigenstate Preparation (|0⟩, |1⟩, |+⟩, |-⟩, |+i⟩, |-i⟩)"]
        B1 --> B2["Bell State Entanglement (|Φ⁺⟩ = (|00⟩+|11⟩)/√2)"]
        B2 --> B3["Quantum Teleportation Protocol"]
    end

    subgraph S3 ["3. Transmission & Channel Layer"]
        B3 --> C1["Classical Channel (b₀, b₁)"]
        B3 --> C2["Quantum State Transport (Bob's Carrier)"]
        C1 -.-> C3["Adversary Interception Points"]
        C2 -.-> C3
    end

    subgraph S4 ["4. Quantum Verification Layer"]
        C1 --> D1["Bob Unitary Pauli Correction (Z^{b₀} X^{b₁})"]
        C2 --> D1
        D1 --> D2["Recovered Qubit State |ψ'⟩"]
        D2 --> D3["Projective Measurement M_B (N shots)"]
    end

    subgraph S5 ["5. Deterministic Statistical Engine"]
        D3 --> E1["Error Rate E = errors / N"]
        D3 --> E2["Agreement Rate A = successes / N"]
        D3 --> E3["Total Variation Distance δ(P, Q)"]
        D3 --> E4["Binomial Forgery Probability Bound"]
    end

    subgraph S6 ["6. Deterministic Security Rules Engine"]
        E1 --> F1["RULE-01: Signer Identity Authorization"]
        E2 --> F2["RULE-02: Cryptographic Digest Integrity"]
        E3 --> F3["RULE-03: Nonce & Signature Replay Check"]
        E4 --> F4["RULE-04: Timestamp Freshness Window"]
        F1 --> F5["RULE-05: Verification Attempts Throttling"]
        F2 --> F6["RULE-06: Quantum Error Rate Threshold"]
        F3 --> F7["RULE-07: Quantum Agreement Rate Bound"]
        F4 --> F8["RULE-08: Statistical Distance (TVD) Limit"]
    end

    subgraph S7 ["7. Decision & Tamper-Evident Audit Chain"]
        F5 & F6 & F7 & F8 --> G1{"All Rules Passed?"}
        G1 -- YES --> G2["VALID SIGNATURE"]
        G1 -- NO --> G3["THREAT DETECTED + Security Alert + Exact Reason"]
        G2 & G3 --> H1["SHA-256 Cryptographic Hash Chain Audit Block"]
    end
```

## 2. Logical Components

### Frontend (React + Vite)
- **Port:** `5173`
- **Dashboard:** Real-time SOC dashboard displaying live operational statistics, attack telemetry, and recent audit logs.
- **Signature Verification:** Interface for generating signatures and verifying claimed documents against quantum state references.
- **Quantum Simulation:** Educational interactive lab featuring the Bloch sphere, Pauli gate transformations, Bell state density matrices, and sequential 8-step teleportation traces.
- **Attack Simulator:** Interactive cyber attack workbench with adjustable disturbance intensity sliders (0% to 50%) for all 5 threat vectors.
- **Security Analytics:** Quantitative charts assessing Error Rates, False Acceptance Rates (FAR), False Rejection Rates (FRR), and asymptotic security margins.
- **Security Logs & Audit Chain:** Append-only ledger secured by a SHA-256 cryptographic hash pointer chain with one-click verification and tamper simulation.
- **Experiment Lab:** Reproducible scientific testbed with configurable random seeds, trial runners, and JSON export.
- **Quantum Concepts:** Comprehensive educational guide with mathematical formulas and simulation roles.

### Backend (FastAPI + Pydantic + NumPy)
- **Port:** `8000`
- **Quantum Engine:** Pure matrix-mechanics simulation implemented in NumPy adhering to the postulates of quantum mechanics.
- **Hashing Engine:** Standard SHA-256 for document integrity verification.
- **Statistical Engine:** Computes empirical frequencies, Error Rate ($E$), Agreement Rate ($A$), Total Variation Distance ($\delta(P, Q)$), and Kullback-Leibler Divergence ($D_{KL}$).
- **Security Rules Engine:** Eight deterministic evaluation gates with explicit threshold bounds.
- **Tamper-Evident Audit Log:** In-memory append-only blockchain-style ledger linked via SHA-256 hashes ($H_i = \text{SHA256}(H_{i-1} \parallel \text{Event}_i)$).
