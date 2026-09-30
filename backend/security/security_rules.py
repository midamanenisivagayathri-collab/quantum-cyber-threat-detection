"""Deterministic rule definitions for threat detection."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from ..verification.thresholds import SecurityThresholds
from ..verification.decision import ThreatType


class RuleEvaluation(BaseModel):
    rule_id: str
    rule_name: str
    passed: bool
    observed_value: Any
    allowed_value: Any
    threat_type: ThreatType
    message: str
    gate_inequality: str = ""


class SecurityRulesEngine:
    """Evaluates deterministic security rules without machine learning."""

    AUTHORIZED_SIGNERS = {"Alice", "Alice_Gov", "Alice_Enterprise", "Authorized_Signer_1"}

    @classmethod
    def evaluate_all(
        cls,
        message: str,
        claimed_hash: str,
        signer_id: str,
        signature_id: str,
        nonce: str,
        timestamp: float,
        current_time: float,
        used_signatures: set,
        used_nonces: set,
        attempt_count: int,
        error_rate: float,
        agreement_rate: float,
        statistical_distance: float,
        expected_distribution: Dict[str, float],
        observed_distribution: Dict[str, float],
        thresholds: SecurityThresholds,
        computed_hash: str
    ) -> List[RuleEvaluation]:
        evaluations: List[RuleEvaluation] = []

        # Rule 1: Signer Identity / Impersonation
        is_signer_authorized = signer_id in cls.AUTHORIZED_SIGNERS
        evaluations.append(RuleEvaluation(
            rule_id="RULE-01-SIGNER-IDENTITY",
            rule_name="Signer Identity Authorization",
            passed=is_signer_authorized,
            observed_value=signer_id,
            allowed_value=list(cls.AUTHORIZED_SIGNERS),
            threat_type=ThreatType.IMPERSONATION,
            message="Signer identity verified against public trust registry." if is_signer_authorized
                    else f"Unauthorized signer '{signer_id}' detected. Identity not in trust registry.",
            gate_inequality=f"signer_id ('{signer_id}') ∈ TrustRegistry → {'PASS' if is_signer_authorized else 'FAIL'}"
        ))

        # Rule 2: Message Hash Integrity / Forgery
        hash_matches = (claimed_hash.lower() == computed_hash.lower())
        evaluations.append(RuleEvaluation(
            rule_id="RULE-02-HASH-INTEGRITY",
            rule_name="Cryptographic Digest Verification",
            passed=hash_matches,
            observed_value=claimed_hash[:16] + "...",
            allowed_value=computed_hash[:16] + "...",
            threat_type=ThreatType.FORGERY,
            message="Classical SHA-256 message hash matches message contents." if hash_matches
                    else "SHA-256 hash mismatch: digital message or digest has been forged/altered.",
            gate_inequality=f"SHA256(msg) == claimed_hash → {'PASS' if hash_matches else 'FAIL'}"
        ))

        # Rule 3: Replay Prevention (Nonce & Signature ID reuse)
        is_replay_sig = signature_id in used_signatures
        is_replay_nonce = nonce in used_nonces
        replay_detected = is_replay_sig or is_replay_nonce
        evaluations.append(RuleEvaluation(
            rule_id="RULE-03-REPLAY-NONCE",
            rule_name="Nonce & Signature Uniqueness (Replay Prevention)",
            passed=(not replay_detected),
            observed_value=f"Sig: {signature_id}, Nonce: {nonce}",
            allowed_value="Unique unconsumed nonce & signature token",
            threat_type=ThreatType.REPLAY,
            message="Fresh signature nonce and identifier." if not replay_detected
                    else f"Replay attack detected: token or nonce '{nonce}' was previously consumed.",
            gate_inequality=f"nonce ('{nonce[:8]}...') ∉ SpentNonceRegistry → {'PASS' if not replay_detected else 'FAIL'}"
        ))

        # Rule 4: Timestamp Freshness Window
        elapsed = max(0.0, current_time - timestamp)
        within_window = (elapsed <= thresholds.replay_time_window_seconds)
        evaluations.append(RuleEvaluation(
            rule_id="RULE-04-TIMESTAMP-WINDOW",
            rule_name="Session Timestamp Freshness",
            passed=within_window,
            observed_value=f"{elapsed:.1f}s elapsed",
            allowed_value=f"<= {thresholds.replay_time_window_seconds:.1f}s window",
            threat_type=ThreatType.REPLAY,
            message="Signature timestamp is within allowable freshness window." if within_window
                    else f"Timestamp expired: {elapsed:.1f}s elapsed exceeds max window of {thresholds.replay_time_window_seconds}s.",
            gate_inequality=f"Δt ({elapsed:.1f}s) ≤ Window ({thresholds.replay_time_window_seconds:.0f}s) → {'PASS' if within_window else 'FAIL'}"
        ))

        # Rule 5: Verification Attempts Lockout
        attempts_allowed = (attempt_count <= thresholds.max_verification_attempts)
        evaluations.append(RuleEvaluation(
            rule_id="RULE-05-VERIFICATION-ATTEMPTS",
            rule_name="Rate-Limit & Attempt Throttling",
            passed=attempts_allowed,
            observed_value=attempt_count,
            allowed_value=f"<= {thresholds.max_verification_attempts}",
            threat_type=ThreatType.UNAUTHORIZED_VERIFICATION,
            message="Verification attempt count within permitted session limit." if attempts_allowed
                    else f"Exceeded maximum verification attempts ({attempt_count} > {thresholds.max_verification_attempts}). Verification blocked.",
            gate_inequality=f"attempts ({attempt_count}) ≤ MaxAttempts ({thresholds.max_verification_attempts}) → {'PASS' if attempts_allowed else 'FAIL'}"
        ))

        # Rule 6: Quantum Error Rate Threshold
        error_rate_ok = (error_rate <= thresholds.max_error_rate)
        evaluations.append(RuleEvaluation(
            rule_id="RULE-06-ERROR-RATE",
            rule_name="Quantum Measurement Error Rate Bound",
            passed=error_rate_ok,
            observed_value=round(error_rate, 4),
            allowed_value=round(thresholds.max_error_rate, 4),
            threat_type=ThreatType.QUANTUM_CHANNEL_MANIPULATION,
            message=f"Measurement error rate ({error_rate:.4f}) within tolerance (<= {thresholds.max_error_rate:.4f})." if error_rate_ok
                    else f"Quantum channel manipulation detected: error rate {error_rate:.4f} exceeds threshold {thresholds.max_error_rate:.4f}.",
            gate_inequality=f"ErrorRate ({error_rate*100:.2f}%) ≤ MaxError ({thresholds.max_error_rate*100:.1f}%) → {'PASS' if error_rate_ok else 'FAIL'}"
        ))

        # Rule 7: Quantum Agreement Rate Threshold
        agreement_rate_ok = (agreement_rate >= thresholds.min_agreement_rate)
        evaluations.append(RuleEvaluation(
            rule_id="RULE-07-AGREEMENT-RATE",
            rule_name="Quantum Measurement Agreement Rate Bound",
            passed=agreement_rate_ok,
            observed_value=round(agreement_rate, 4),
            allowed_value=round(thresholds.min_agreement_rate, 4),
            threat_type=ThreatType.SUSPICIOUS_MEASUREMENT,
            message=f"Measurement agreement rate ({agreement_rate:.4f}) meets requirement (>= {thresholds.min_agreement_rate:.4f})." if agreement_rate_ok
                    else f"Suspicious measurement pattern: agreement rate {agreement_rate:.4f} fell below minimum {thresholds.min_agreement_rate:.4f}.",
            gate_inequality=f"AgreementRate ({agreement_rate*100:.2f}%) ≥ MinAgreement ({thresholds.min_agreement_rate*100:.1f}%) → {'PASS' if agreement_rate_ok else 'FAIL'}"
        ))

        # Rule 8: Statistical Distance (Total Variation Distance)
        distance_ok = (statistical_distance <= thresholds.max_statistical_distance)
        evaluations.append(RuleEvaluation(
            rule_id="RULE-08-STATISTICAL-DISTANCE",
            rule_name="Total Variation Distance (TVD) Limit",
            passed=distance_ok,
            observed_value=round(statistical_distance, 4),
            allowed_value=round(thresholds.max_statistical_distance, 4),
            threat_type=ThreatType.QUANTUM_CHANNEL_MANIPULATION,
            message=f"Statistical distance ({statistical_distance:.4f}) within limit (<= {thresholds.max_statistical_distance:.4f})." if distance_ok
                    else f"Significant distribution divergence: TVD {statistical_distance:.4f} exceeds maximum {thresholds.max_statistical_distance:.4f}.",
            gate_inequality=f"TVD δ(P, Q) ({statistical_distance:.4f}) ≤ MaxTVD ({thresholds.max_statistical_distance:.4f}) → {'PASS' if distance_ok else 'FAIL'}"
        ))

        return evaluations
