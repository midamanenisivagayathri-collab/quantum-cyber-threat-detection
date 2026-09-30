# Cyber Threat Attack Models & Detection Mechanics

## 1. Digital Signature Forgery

- **Adversary Goal:** Alter the contents of a signed message (e.g. modify a financial transfer amount or SCADA command) while retaining the signer's legitimate signature token.
- **Physical Manifestation:** The attacker submits $m' \ne m$. The verifier recomputes $h' = \text{SHA256}(m')$ and compares it against the stored message hash $h$ bound to the signature.
- **Detection Gate:** `RULE-02-HASH-INTEGRITY` flags a digest mismatch.
- **Alert:** `THREAT_DETECTED (FORGERY)`.

## 2. Signer Impersonation

- **Adversary Goal:** Claim to be an authorized entity without holding authentic cryptographic credentials in the public trust registry.
- **Physical Manifestation:** The attacker submits a signature claiming $\text{signer\_id} = \text{"Eve"}$ when only authorized entities (e.g. Alice) are trusted.
- **Detection Gate:** `RULE-01-SIGNER-IDENTITY` checks the signer against the trusted identity registry.
- **Alert:** `THREAT_DETECTED (IMPERSONATION)`.

## 3. Replay Attack

- **Adversary Goal:** Intercept a legitimate previously authenticated signature token and retransmit it at a later time to duplicate an action.
- **Physical Manifestation:** The verifier maintains a cache of consumed signature IDs and nonces. When the token is re-submitted, the nonce is identified as already spent.
- **Detection Gate:** `RULE-03-REPLAY-NONCE` and `RULE-04-TIMESTAMP-WINDOW`.
- **Alert:** `THREAT_DETECTED (REPLAY)`.

## 4. Quantum Channel Manipulation

- **Adversary Goal:** Intercept, perturb, or corrupt the quantum carrier qubits or classical correction bits during teleportation transit.
- **Physical Manifestation:**
  - **Bit-Flip Noise ($X$ error):** Swaps $|0\rangle \leftrightarrow |1\rangle$ with probability $p$.
  - **Phase-Flip Noise ($Z$ error):** Swaps $|+\rangle \leftrightarrow |-\rangle$ with probability $q$.
  - **Classical Channel Tampering:** Inverts $(b_0, b_1)$, causing Bob to apply the wrong Pauli correction.
- **Statistical Consequence:**
  - In a clean channel, Error Rate $E \approx 0.0$ and Agreement Rate $A \approx 1.0$.
  - Under channel manipulation with intensity $p$, $E$ increases to approximately $p$, and Statistical Distance $\delta(P, Q)$ climbs past 0.15.
- **Detection Gate:** `RULE-06-ERROR-RATE` ($E > \theta_{\text{error}}$) and `RULE-08-STATISTICAL-DISTANCE` ($\delta > \theta_{\text{tvd}}$).
- **Alert:** `THREAT_DETECTED (QUANTUM_CHANNEL_MANIPULATION)`.

## 5. Unauthorized Verification Probing

- **Adversary Goal:** Execute high-frequency automated verification queries to probe the verifier's thresholds or brute-force state alignments.
- **Physical Manifestation:** The verifier tracks verification attempts per session key. Attempts beyond $N_{\text{max\_attempts}} = 3$ trigger an immediate security lockout.
- **Detection Gate:** `RULE-05-VERIFICATION-ATTEMPTS`.
- **Alert:** `THREAT_DETECTED (UNAUTHORIZED_VERIFICATION)`.
