"""Quantum Channel Manipulation simulation."""

from typing import Dict, Any, Optional
from ..signature.signature_model import QuantumSignature
from ..verification.verifier import SignatureVerifier


class ChannelAttackSimulator:
    """Simulates active noise and adversarial interception in the quantum/classical channel."""

    @classmethod
    def simulate(
        cls,
        signature: QuantumSignature,
        intensity: float = 0.25,
        manipulation_type: str = "BIT_FLIP",  # "BIT_FLIP", "PHASE_FLIP", "DEPOLARIZING", "CLASSICAL_TAMPER"
        shots: int = 1000,
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        """Injects physical noise into the quantum channel based on user-selected intensity."""
        # Ensure fresh nonce for channel test so replay doesn't shadow channel noise
        sig_copy = signature.model_copy(deep=True)
        import uuid
        sig_copy.nonce = uuid.uuid4().hex[:16]

        bit_flip = 0.0
        phase_flip = 0.0
        tamper_classical = False

        if manipulation_type == "BIT_FLIP":
            bit_flip = intensity
        elif manipulation_type == "PHASE_FLIP":
            phase_flip = intensity
        elif manipulation_type == "CLASSICAL_TAMPER":
            tamper_classical = (intensity > 0.0)
            bit_flip = intensity * 0.5
        elif manipulation_type == "DEPOLARIZING":
            bit_flip = intensity * 0.6
            phase_flip = intensity * 0.6
        else: # Default hybrid noise
            bit_flip = intensity
            phase_flip = intensity * 0.5

        verification = SignatureVerifier.verify(
            signature=sig_copy,
            claimed_message=sig_copy.message,
            claimed_signer_id=sig_copy.signer_id,
            shots=shots,
            bit_flip_prob=bit_flip,
            phase_flip_prob=phase_flip,
            classical_bit_tamper=tamper_classical,
            seed=seed
        )

        return {
            "attack_type": "QUANTUM_CHANNEL_MANIPULATION",
            "manipulation_type": manipulation_type,
            "intensity": round(intensity, 4),
            "intensity_percentage": f"{round(intensity * 100, 1)}%",
            "bit_flip_probability": bit_flip,
            "phase_flip_probability": phase_flip,
            "classical_tampered": tamper_classical,
            "verification_result": verification.model_dump(),
            "explanation": f"Injected {manipulation_type} disturbance at intensity {round(intensity*100, 1)}%. Quantum error rate rose to {verification.error_rate:.4f}, breaching security thresholds."
        }
