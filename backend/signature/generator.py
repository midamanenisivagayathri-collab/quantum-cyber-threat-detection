"""Quantum-Inspired Signature Generator.

Generates quantum-inspired digital signatures tying classical SHA-256 message digests
to prepared Pauli eigenstates and theoretical measurement expectations.
"""

import hashlib
import time
import uuid
import datetime
from typing import Dict, Any, Optional
from .signature_model import QuantumSignature, QuantumStateReference
from ..quantum.eigenstates import Eigenstates, BasisType
from ..quantum.qubit import Qubit


class SignatureGenerator:
    """Generates quantum-inspired digital signatures with cryptographic hashing."""

    # In-memory storage for generated signatures (can also be queried by SQLite)
    _signature_store: Dict[str, QuantumSignature] = {}

    @classmethod
    def compute_sha256(cls, message: str) -> str:
        """Computes classical SHA-256 message digest."""
        return hashlib.sha256(message.encode("utf-8")).hexdigest()

    @classmethod
    def select_quantum_state_for_message(
        cls, message_hash: str, basis: BasisType, preferred_state: Optional[str] = None
    ) -> Qubit:
        """Deterministically selects or prepares the quantum state for the signature.
        
        If preferred_state is explicitly specified (e.g. '|0>', '|+>', etc.), uses it.
        Otherwise maps the hash's least significant bit/nibble to a canonical eigenstate.
        """
        if preferred_state:
            return Eigenstates.get_state(preferred_state)

        # Deterministic mapping from hash parity to eigenstate in chosen basis
        hash_val = int(message_hash[-2:], 16)
        bit = hash_val % 2

        if basis == BasisType.Z:
            return Eigenstates.get_state("|0>" if bit == 0 else "|1>")
        elif basis == BasisType.X:
            return Eigenstates.get_state("|+>" if bit == 0 else "|->")
        elif basis == BasisType.Y:
            return Eigenstates.get_state("|+i>" if bit == 0 else "|-i>")
        return Eigenstates.get_state("|0>")

    @classmethod
    def generate(
        cls,
        signer_id: str,
        message: str,
        measurement_basis: str = "Z",
        preferred_state: Optional[str] = None,
        custom_nonce: Optional[str] = None
    ) -> QuantumSignature:
        """Generates a complete Quantum-Inspired Digital Signature."""
        basis_enum = BasisType(measurement_basis.upper())
        msg_hash = cls.compute_sha256(message)
        
        qubit = cls.select_quantum_state_for_message(msg_hash, basis_enum, preferred_state)
        x, y, z = qubit.bloch_coordinates()
        
        # State label
        state_label = preferred_state
        if not state_label:
            # Infer label
            if np_close := (abs(z - 1.0) < 1e-4):
                state_label = "|0⟩"
            elif abs(z + 1.0) < 1e-4:
                state_label = "|1⟩"
            elif abs(x - 1.0) < 1e-4:
                state_label = "|+⟩"
            elif abs(x + 1.0) < 1e-4:
                state_label = "|–⟩"
            elif abs(y - 1.0) < 1e-4:
                state_label = "|+i⟩"
            else:
                state_label = "|–i⟩"

        expected_stats = Eigenstates.theoretical_probabilities(qubit, basis_enum)

        state_ref = QuantumStateReference(
            state_label=state_label,
            basis=basis_enum.value,
            vector={
                "alpha": {"real": float(qubit.alpha.real), "imag": float(qubit.alpha.imag)},
                "beta": {"real": float(qubit.beta.real), "imag": float(qubit.beta.imag)}
            },
            bloch_coordinates={"x": round(x, 4), "y": round(y, 4), "z": round(z, 4)},
            purity=1.0
        )

        now = time.time()
        formatted_time = datetime.datetime.fromtimestamp(now, datetime.timezone.utc).isoformat()
        sig_id = f"SIG-{uuid.uuid4().hex[:12].upper()}"
        nonce = custom_nonce or uuid.uuid4().hex[:16]

        sig = QuantumSignature(
            signature_id=sig_id,
            signer_id=signer_id,
            message=message,
            message_hash=msg_hash,
            quantum_state_reference=state_ref,
            measurement_basis=basis_enum.value,
            expected_measurement_statistics=expected_stats,
            timestamp=now,
            formatted_time=formatted_time,
            nonce=nonce,
            verification_metadata={
                "hash_algorithm": "SHA-256",
                "quantum_encoding": "Pauli Eigenstate Teleportation",
                "security_model": "Simulation Rule-Based QDS",
                "original_state_label": state_label
            },
            used=False
        )

        cls._signature_store[sig_id] = sig
        return sig

    @classmethod
    def get_signature(cls, signature_id: str) -> Optional[QuantumSignature]:
        return cls._signature_store.get(signature_id)

    @classmethod
    def mark_used(cls, signature_id: str) -> None:
        if signature_id in cls._signature_store:
            cls._signature_store[signature_id].used = True

    @classmethod
    def reset_store(cls) -> None:
        cls._signature_store.clear()
