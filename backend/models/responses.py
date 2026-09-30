"""Pydantic API response models."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class APIStatusResponse(BaseModel):
    status: str = "healthy"
    system_title: str = "Quantum-Inspired Cyber Threat Detection for Digital Signature Security"
    notice: str = "A quantum-inspired educational/security simulation of a teleportation-based QDS verification workflow"
    quantum_engine: str = "NumPy Matrix Mechanics Simulation"
    ml_used: bool = False
    timestamp: float


class SecurityStatisticsResponse(BaseModel):
    signatures_generated: int
    signatures_verified: int
    threats_detected: int
    forgery_attempts: int
    replay_attempts: int
    impersonation_attempts: int
    channel_manipulations: int
    unauthorized_attempts: int
    current_security_status: str
    recent_events_count: int
    audit_chain_valid: bool
