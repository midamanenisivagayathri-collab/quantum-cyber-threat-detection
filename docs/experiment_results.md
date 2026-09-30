# Experimental Results & Quantitative Benchmarks

## 1. Baseline Control Benchmark

Simulation parameters: $N = 1000$ shots, Basis = $Z$, Seed = 42, Noise = 0.0.

| Metric | Measured Value | Threshold Target | Status |
|---|---|---|---|
| Error Rate ($E$) | 0.00% | $\le 10.0\%$ | PASSED |
| Agreement Rate ($A$) | 100.00% | $\ge 90.0\%$ | PASSED |
| Statistical Distance ($\delta$) | 0.0000 | $\le 0.1500$ | PASSED |
| State Fidelity ($F$) | 1.0000 | $\ge 0.9900$ | PASSED |
| Verification Decision | `VALID_SIGNATURE` | `VALID_SIGNATURE` | PASSED |

## 2. Multi-Vector Attack Benchmark

Simulated across identical base signatures with $N = 1000$ shots:

| Attack Vector | Parameter Injected | Observed Error Rate | Observed TVD | Detection Decision | Triggered Rule |
|---|---|---|---|---|---|
| **Normal Baseline** | None | 0.00% | 0.0000 | `VALID_SIGNATURE` | None (All Passed) |
| **Digital Forgery** | Tampered message | 0.00% | 0.0000 | `THREAT_DETECTED` | `RULE-02-HASH-INTEGRITY` |
| **Impersonation** | Untrusted ID (Eve) | 0.00% | 0.0000 | `THREAT_DETECTED` | `RULE-01-SIGNER-IDENTITY` |
| **Replay Attack** | Nonce duplicate | 0.00% | 0.0000 | `THREAT_DETECTED` | `RULE-03-REPLAY-NONCE` |
| **Channel Attack** | Bit-Flip Noise (25%) | 24.80% | 0.2480 | `THREAT_DETECTED` | `RULE-06-ERROR-RATE` |
| **Unauthorized Probe** | 4th Attempt | 0.00% | 0.0000 | `THREAT_DETECTED` | `RULE-05-VERIFICATION-ATTEMPTS` |

## 3. What-If Parametric Sensitivity Sweep

Parametric sweep of channel noise intensity $p$ against fixed threshold $\theta_{\text{error}} = 10.0\%$:

| Attack Intensity | Observed Error Rate | Observed Agreement | TVD Distance | Decision |
|---|---|---|---|---|
| 0% (Clean) | 0.00% | 100.00% | 0.0000 | `VALID_SIGNATURE` |
| 10% (Boundary) | 10.20% | 89.80% | 0.1020 | `THREAT_DETECTED` |
| 20% (Perturbed) | 19.80% | 80.20% | 0.1980 | `THREAT_DETECTED` |
| 30% (Severe) | 30.50% | 69.50% | 0.3050 | `THREAT_DETECTED` |
| 40% (Critical) | 39.40% | 60.60% | 0.3940 | `THREAT_DETECTED` |
| 50% (Max Entropic) | 49.70% | 50.30% | 0.4970 | `THREAT_DETECTED` |

## 4. Reproducibility Benchmark

Running the multi-trial runner across 10 trials with `Seed = 42`:
- **Detection Rate:** 100.0%
- **Average Error Rate (at 20% intensity):** 20.14%
- **Average Total Variation Distance:** 0.2014
- **Verification Execution Time per Session:** 8.4 ms
- **False Acceptance Rate (FAR):** 0.00%
- **False Rejection Rate (FRR):** 0.00%
