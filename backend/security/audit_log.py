"""Tamper-evident security audit log and cryptographic hash chain."""

import hashlib
import json
import time
import uuid
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class SecurityEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: f"EVT-{uuid.uuid4().hex[:10].upper()}")
    timestamp: float = Field(default_factory=time.time)
    formatted_time: str
    signer_id: str
    verifier_id: str = "Bob (Verifier)"
    event_type: str  # e.g., "SIGNATURE_VERIFICATION", "ATTACK_SIMULATION", "THRESHOLD_CHANGE"
    attack_type: str = "NONE"
    measurement_basis: str
    error_rate: float
    agreement_rate: float
    statistical_distance: float
    threshold_max_error: float
    decision: str  # "VALID_SIGNATURE" or "THREAT_DETECTED"
    severity: str  # "INFO", "WARNING", "CRITICAL"
    reason: str
    previous_hash: str
    current_hash: str

    def canonical_data_string(self) -> str:
        """Returns deterministic string representation for cryptographic hashing."""
        data = {
            "event_id": self.event_id,
            "timestamp": f"{self.timestamp:.4f}",
            "signer_id": self.signer_id,
            "event_type": self.event_type,
            "attack_type": self.attack_type,
            "measurement_basis": self.measurement_basis,
            "error_rate": f"{self.error_rate:.6f}",
            "agreement_rate": f"{self.agreement_rate:.6f}",
            "statistical_distance": f"{self.statistical_distance:.6f}",
            "threshold_max_error": f"{self.threshold_max_error:.4f}",
            "decision": self.decision,
            "severity": self.severity,
            "reason": self.reason,
            "previous_hash": self.previous_hash
        }
        return json.dumps(data, sort_keys=True)


class AuditLogManager:
    """Manages sequential append-only security logs with a cryptographic SHA-256 hash chain."""

    GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
    _chain: List[SecurityEvent] = []

    @classmethod
    def compute_hash(cls, prev_hash: str, canonical_content: str) -> str:
        payload = f"{prev_hash}::{canonical_content}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()

    @classmethod
    def log_event(
        cls,
        signer_id: str,
        event_type: str,
        decision: str,
        reason: str,
        attack_type: str = "NONE",
        measurement_basis: str = "Z",
        error_rate: float = 0.0,
        agreement_rate: float = 1.0,
        statistical_distance: float = 0.0,
        threshold_max_error: float = 0.10,
        severity: str = "INFO",
        verifier_id: str = "Bob"
    ) -> SecurityEvent:
        """Appends a new verified event to the tamper-evident audit chain."""
        prev_hash = cls._chain[-1].current_hash if cls._chain else cls.GENESIS_HASH
        
        now = time.time()
        import datetime
        formatted_time = datetime.datetime.fromtimestamp(now, datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        # Temporarily create event to extract canonical content
        event_id = f"EVT-{uuid.uuid4().hex[:10].upper()}"
        dummy_event = SecurityEvent(
            event_id=event_id,
            timestamp=now,
            formatted_time=formatted_time,
            signer_id=signer_id,
            verifier_id=verifier_id,
            event_type=event_type,
            attack_type=attack_type,
            measurement_basis=measurement_basis,
            error_rate=error_rate,
            agreement_rate=agreement_rate,
            statistical_distance=statistical_distance,
            threshold_max_error=threshold_max_error,
            decision=decision,
            severity=severity,
            reason=reason,
            previous_hash=prev_hash,
            current_hash=""
        )

        canonical = dummy_event.canonical_data_string()
        curr_hash = cls.compute_hash(prev_hash, canonical)
        dummy_event.current_hash = curr_hash

        cls._chain.append(dummy_event)
        return dummy_event

    @classmethod
    def get_logs(cls, limit: int = 100) -> List[Dict[str, Any]]:
        """Returns recent logs in reverse chronological order."""
        return [evt.model_dump() for evt in reversed(cls._chain[-limit:])]

    @classmethod
    def get_all_logs(cls) -> List[SecurityEvent]:
        return cls._chain

    @classmethod
    def verify_audit_chain(cls) -> Dict[str, Any]:
        """Validates cryptographic integrity of entire audit log history.
        
        Recalculates each block's SHA-256 hash using the previous block's hash.
        If any record has been modified or deleted, detects the exact location.
        """
        if not cls._chain:
            return {
                "status": "AUDIT_CHAIN_VALID",
                "is_valid": True,
                "chain_length": 0,
                "message": "Audit chain is empty. Genesis state intact."
            }

        prev_hash = cls.GENESIS_HASH
        for idx, evt in enumerate(cls._chain):
            # Check previous hash pointer
            if evt.previous_hash != prev_hash:
                return {
                    "status": "AUDIT_CHAIN_TAMPERED",
                    "is_valid": False,
                    "tampered_index": idx,
                    "event_id": evt.event_id,
                    "reason": f"Previous hash mismatch at block #{idx}. Expected '{prev_hash}', got '{evt.previous_hash}'."
                }

            # Recalculate hash
            expected_current_hash = cls.compute_hash(prev_hash, evt.canonical_data_string())
            if evt.current_hash != expected_current_hash:
                return {
                    "status": "AUDIT_CHAIN_TAMPERED",
                    "is_valid": False,
                    "tampered_index": idx,
                    "event_id": evt.event_id,
                    "reason": f"Hash mismatch at block #{idx}. Recalculated hash does not match stored hash."
                }

            prev_hash = evt.current_hash

        return {
            "status": "AUDIT_CHAIN_VALID",
            "is_valid": True,
            "chain_length": len(cls._chain),
            "latest_block_hash": cls._chain[-1].current_hash,
            "message": f"All {len(cls._chain)} security audit log blocks verified with cryptographic SHA-256 integrity."
        }

    @classmethod
    def simulate_tampering(cls, index: int = -1) -> bool:
        """Simulates an attacker tampering with an audit log entry for demonstration."""
        if not cls._chain:
            return False
        target_idx = index if index >= 0 else len(cls._chain) + index
        if 0 <= target_idx < len(cls._chain):
            # Modify reason without updating current_hash
            cls._chain[target_idx].reason += " [TAMPERED_RECORD]"
            return True
        return False

    @classmethod
    def clear(cls) -> None:
        cls._chain.clear()
