"""Deterministic verification decision structures and trace models."""

import enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class DecisionType(str, enum.Enum):
    VALID_SIGNATURE = "VALID_SIGNATURE"
    THREAT_DETECTED = "THREAT_DETECTED"


class ThreatType(str, enum.Enum):
    NONE = "NONE"
    FORGERY = "FORGERY"
    IMPERSONATION = "IMPERSONATION"
    REPLAY = "REPLAY"
    QUANTUM_CHANNEL_MANIPULATION = "QUANTUM_CHANNEL_MANIPULATION"
    UNAUTHORIZED_VERIFICATION = "UNAUTHORIZED_VERIFICATION"
    SUSPICIOUS_MEASUREMENT = "SUSPICIOUS_MEASUREMENT"


class VerificationTraceItem(BaseModel):
    check_name: str
    passed: bool
    description: str
    observed_value: Any
    threshold_value: Any
    rule_id: str
    gate_inequality: str = ""


class ComputationalComplexityMetrics(BaseModel):
    execution_time_ms: float
    time_complexity_class: str = "O(N) where N = measurement shots"
    space_complexity_class: str = "O(1) memory bound"
    memory_footprint_bytes: int = 4096
    classical_digest_complexity: str = "O(L) SHA-256"
    quantum_matrix_complexity: str = "O(1) 2x2 unitary"
    statistical_evaluation_complexity: str = "O(|Ω|) binary"
    low_complexity_justification: str = "Lightweight arithmetic on binary outcome statistics without matrix inversion or deep neural layers."


class VerificationResult(BaseModel):
    decision: DecisionType
    threat_type: ThreatType = ThreatType.NONE
    threat_detected: bool = False
    signer_id: str
    signature_id: str
    message_hash_match: bool
    error_rate: float
    agreement_rate: float
    statistical_distance: float
    forgery_probability: float
    forgery_probability_details: Optional[Dict[str, Any]] = None
    complexity_metrics: Optional[ComputationalComplexityMetrics] = None
    threshold_applied: Dict[str, Any]
    triggered_rules: List[str] = Field(default_factory=list)
    reason: str
    trace: List[VerificationTraceItem] = Field(default_factory=list)
    quantum_teleportation_details: Optional[Dict[str, Any]] = None
    distribution_comparison: Optional[Dict[str, Any]] = None
    timestamp: float
    verification_duration_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
