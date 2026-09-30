"""Pydantic API request models."""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class GenerateSignatureRequest(BaseModel):
    signer_id: str = Field(default="Alice")
    message: str = Field(default="Smart Grid SCADA Authorization: Switch Node 42 to Standby")
    measurement_basis: str = Field(default="Z")
    preferred_state: Optional[str] = None


class VerifySignatureRequest(BaseModel):
    signature_id: Optional[str] = None
    signature_data: Optional[Dict[str, Any]] = None
    claimed_message: str
    claimed_signer_id: str = "Alice"
    shots: int = Field(default=1000, ge=10, le=50000)
    bit_flip_prob: float = Field(default=0.0, ge=0.0, le=1.0)
    phase_flip_prob: float = Field(default=0.0, ge=0.0, le=1.0)
    classical_bit_tamper: bool = False
    session_id: Optional[str] = None
    seed: Optional[int] = None


class AttackSimulateRequest(BaseModel):
    attack_type: str = Field(default="FORGERY")  # FORGERY, IMPERSONATION, REPLAY, QUANTUM_CHANNEL_MANIPULATION, UNAUTHORIZED_VERIFICATION
    intensity: float = Field(default=0.25, ge=0.0, le=1.0)
    signature_id: Optional[str] = None
    attacker_id: Optional[str] = "Eve_Mallory"
    tampered_message: Optional[str] = None
    manipulation_type: Optional[str] = "BIT_FLIP"
    shots: int = Field(default=1000, ge=10, le=50000)
    seed: Optional[int] = None


class TeleportationSimulateRequest(BaseModel):
    alpha_real: float = 1.0
    alpha_imag: float = 0.0
    beta_real: float = 0.0
    beta_imag: float = 0.0
    basis: str = "Z"
    shots: int = 1000
    bit_flip_prob: float = 0.0
    phase_flip_prob: float = 0.0
    classical_tamper: bool = False
    seed: Optional[int] = None


class MeasurementRunRequest(BaseModel):
    state_label: str = "|0>"
    basis: str = "Z"
    shots: int = 1000
    seed: Optional[int] = None


class ExperimentRunRequest(BaseModel):
    mode: str = "BASELINE"  # BASELINE, ATTACK_COMPARISON, WHAT_IF, MULTI_TRIAL, FULL_DEMO
    attack_type: str = "QUANTUM_CHANNEL_MANIPULATION"
    intensity: float = 0.25
    shots: int = 1000
    num_trials: int = 10
    basis: str = "Z"
    threshold_max_error: float = 0.10
    seed: Optional[int] = 42


class ThresholdUpdateRequest(BaseModel):
    max_error_rate: Optional[float] = None
    min_agreement_rate: Optional[float] = None
    max_statistical_distance: Optional[float] = None
    replay_time_window_seconds: Optional[float] = None
    max_verification_attempts: Optional[int] = None
