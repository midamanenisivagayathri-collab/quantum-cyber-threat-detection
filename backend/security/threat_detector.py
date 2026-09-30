"""Deterministic threat detector compiling rules and emitting security alerts."""

from typing import Dict, Any, List, Tuple
from .security_rules import RuleEvaluation
from ..verification.decision import DecisionType, ThreatType, VerificationTraceItem
from .audit_log import AuditLogManager


class ThreatDetector:
    """Consolidates deterministic rule evaluations into explainable security decisions."""

    # Threat precedence ranking for consistent prioritization
    PRECEDENCE = [
        ThreatType.FORGERY,
        ThreatType.IMPERSONATION,
        ThreatType.REPLAY,
        ThreatType.UNAUTHORIZED_VERIFICATION,
        ThreatType.QUANTUM_CHANNEL_MANIPULATION,
        ThreatType.SUSPICIOUS_MEASUREMENT
    ]

    @classmethod
    def analyze(
        cls,
        evaluations: List[RuleEvaluation],
        signer_id: str,
        signature_id: str,
        measurement_basis: str,
        error_rate: float,
        agreement_rate: float,
        statistical_distance: float,
        max_error_threshold: float,
        record_audit_log: bool = True
    ) -> Tuple[DecisionType, ThreatType, List[str], str, List[VerificationTraceItem]]:
        failed_evals = [e for e in evaluations if not e.passed]
        trace: List[VerificationTraceItem] = []

        for e in evaluations:
            trace.append(VerificationTraceItem(
                check_name=e.rule_name,
                passed=e.passed,
                description=e.message,
                observed_value=e.observed_value,
                threshold_value=e.allowed_value,
                rule_id=e.rule_id,
                gate_inequality=e.gate_inequality
            ))

        if not failed_evals:
            decision = DecisionType.VALID_SIGNATURE
            threat_type = ThreatType.NONE
            triggered_rules = []
            reason = "All deterministic integrity and quantum statistical checks passed within configured thresholds."
            severity = "INFO"
        else:
            decision = DecisionType.THREAT_DETECTED
            # Select primary threat type based on precedence
            triggered_rules = [e.rule_id for e in failed_evals]
            
            # Map failed threat types
            failed_threats = {e.threat_type for e in failed_evals}
            threat_type = ThreatType.SUSPICIOUS_MEASUREMENT
            for p in cls.PRECEDENCE:
                if p in failed_threats:
                    threat_type = p
                    break

            reasons_list = [f"{e.rule_name}: {e.message}" for e in failed_evals]
            reason = " | ".join(reasons_list)
            severity = "CRITICAL" if threat_type in [ThreatType.FORGERY, ThreatType.IMPERSONATION, ThreatType.REPLAY] else "WARNING"

        if record_audit_log:
            AuditLogManager.log_event(
                signer_id=signer_id,
                event_type="SIGNATURE_VERIFICATION",
                decision=decision.value,
                reason=reason,
                attack_type=threat_type.value,
                measurement_basis=measurement_basis,
                error_rate=error_rate,
                agreement_rate=agreement_rate,
                statistical_distance=statistical_distance,
                threshold_max_error=max_error_threshold,
                severity=severity
            )

        return decision, threat_type, triggered_rules, reason, trace
