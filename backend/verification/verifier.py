"""Quantum-Inspired Signature Verifier engine."""

import time
import hashlib
from typing import Dict, Any, Optional, Set
from .thresholds import ThresholdManager, SecurityThresholds
from .decision import VerificationResult, DecisionType, ThreatType, ComputationalComplexityMetrics
from ..signature.signature_model import QuantumSignature
from ..signature.generator import SignatureGenerator
from ..quantum.qubit import Qubit
from ..quantum.eigenstates import BasisType, Eigenstates
from ..quantum.teleportation import QuantumTeleportation
from ..statistics.metrics import StatisticalMetrics
from ..statistics.probability import ForgeryProbabilityEstimator
from ..statistics.distribution import DistributionAnalyzer
from ..security.security_rules import SecurityRulesEngine
from ..security.threat_detector import ThreatDetector


class SignatureVerifier:
    """Deterministic verifier for teleportation-based quantum digital signatures."""

    _consumed_signatures: Set[str] = set()
    _consumed_nonces: Set[str] = set()
    _session_attempt_counts: Dict[str, int] = {}

    @classmethod
    def reset_replay_cache(cls) -> None:
        cls._consumed_signatures.clear()
        cls._consumed_nonces.clear()
        cls._session_attempt_counts.clear()

    @classmethod
    def mark_signature_consumed(cls, signature_id: str, nonce: str) -> None:
        cls._consumed_signatures.add(signature_id)
        cls._consumed_nonces.add(nonce)

    @classmethod
    def verify(
        cls,
        signature: QuantumSignature,
        claimed_message: str,
        claimed_signer_id: str,
        shots: int = 1000,
        bit_flip_prob: float = 0.0,
        phase_flip_prob: float = 0.0,
        classical_bit_tamper: bool = False,
        session_id: Optional[str] = None,
        custom_thresholds: Optional[SecurityThresholds] = None,
        record_audit: bool = True,
        seed: Optional[int] = None
    ) -> VerificationResult:
        start_time = time.perf_counter()
        current_time = time.time()
        thresholds = custom_thresholds or ThresholdManager.get_thresholds()

        # Session tracking for attempt throttling
        sess_key = session_id or signature.signature_id
        current_attempts = cls._session_attempt_counts.get(sess_key, 0) + 1
        cls._session_attempt_counts[sess_key] = current_attempts

        # 1. Classical Hash Check
        computed_hash = hashlib.sha256(claimed_message.encode("utf-8")).hexdigest()
        hash_match = (computed_hash.lower() == signature.message_hash.lower())

        # 2. Quantum Teleportation and Projective Measurement Simulation
        basis_enum = BasisType(signature.measurement_basis.upper())
        ref_vec = signature.quantum_state_reference.vector
        alpha = complex(ref_vec["alpha"]["real"], ref_vec["alpha"]["imag"])
        beta = complex(ref_vec["beta"]["real"], ref_vec["beta"]["imag"])
        input_qubit = Qubit(alpha, beta)

        # Run teleportation
        teleport_res = QuantumTeleportation.simulate(
            input_qubit=input_qubit,
            measurement_basis=basis_enum.value,
            shots=shots,
            bit_flip_prob=bit_flip_prob,
            phase_flip_prob=phase_flip_prob,
            classical_bit_tamper=classical_bit_tamper,
            seed=seed
        )

        # 3. Statistical Analysis of Measurement Outcomes
        expected_dist = signature.expected_measurement_statistics
        meas_info = teleport_res.projective_measurement
        observed_counts = meas_info["empirical_counts"]
        observed_dist = meas_info["empirical_frequencies"]

        # Calculate successes vs errors:
        # Success = outcomes matching the state's theoretical dominant outcome
        # If eigenstate |0⟩, outcome |0⟩ is success; outcome |1⟩ is error.
        most_likely_label = max(expected_dist, key=expected_dist.get)
        successes = observed_counts.get(most_likely_label, 0)
        errors = shots - successes

        error_rate, agreement_rate = StatisticalMetrics.calculate_rates(errors, successes, shots)
        dist_comp = DistributionAnalyzer.format_distribution_comparison(expected_dist, observed_counts, shots)
        tvd = dist_comp["total_variation_distance"]

        # 4. Forgery Probability Estimation
        forgery_est = ForgeryProbabilityEstimator.estimate_forgery_probability(
            shots=shots,
            min_agreement_threshold=thresholds.min_agreement_rate,
            num_quantum_tokens=1
        )
        forgery_prob = forgery_est["forgery_probability"]

        # 5. Deterministic Security Rules Evaluation
        evaluations = SecurityRulesEngine.evaluate_all(
            message=claimed_message,
            claimed_hash=signature.message_hash,
            signer_id=claimed_signer_id,
            signature_id=signature.signature_id,
            nonce=signature.nonce,
            timestamp=signature.timestamp,
            current_time=current_time,
            used_signatures=cls._consumed_signatures,
            used_nonces=cls._consumed_nonces,
            attempt_count=current_attempts,
            error_rate=error_rate,
            agreement_rate=agreement_rate,
            statistical_distance=tvd,
            expected_distribution=expected_dist,
            observed_distribution=observed_dist,
            thresholds=thresholds,
            computed_hash=computed_hash
        )

        # 6. Consolidate into Decision
        decision, threat_type, triggered_rules, reason, trace = ThreatDetector.analyze(
            evaluations=evaluations,
            signer_id=claimed_signer_id,
            signature_id=signature.signature_id,
            measurement_basis=basis_enum.value,
            error_rate=error_rate,
            agreement_rate=agreement_rate,
            statistical_distance=tvd,
            max_error_threshold=thresholds.max_error_rate,
            record_audit_log=record_audit
        )

        # If valid and this is the first use, record as consumed
        if decision == DecisionType.VALID_SIGNATURE:
            cls.mark_signature_consumed(signature.signature_id, signature.nonce)
            SignatureGenerator.mark_used(signature.signature_id)

        duration_ms = (time.perf_counter() - start_time) * 1000.0

        complexity = ComputationalComplexityMetrics(
            execution_time_ms=round(duration_ms, 2),
            time_complexity_class=f"O(N) with N={shots} measurement shots",
            space_complexity_class="O(1) auxiliary state bounds",
            memory_footprint_bytes=int(4096 + shots * 8)
        )

        return VerificationResult(
            decision=decision,
            threat_type=threat_type,
            threat_detected=(decision == DecisionType.THREAT_DETECTED),
            signer_id=claimed_signer_id,
            signature_id=signature.signature_id,
            message_hash_match=hash_match,
            error_rate=error_rate,
            agreement_rate=agreement_rate,
            statistical_distance=tvd,
            forgery_probability=forgery_prob,
            forgery_probability_details=forgery_est,
            complexity_metrics=complexity,
            threshold_applied=thresholds.to_dict(),
            triggered_rules=triggered_rules,
            reason=reason,
            trace=trace,
            quantum_teleportation_details=teleport_res.model_dump(),
            distribution_comparison=dist_comp,
            timestamp=current_time,
            verification_duration_ms=round(duration_ms, 2)
        )
