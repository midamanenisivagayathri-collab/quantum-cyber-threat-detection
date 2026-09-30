"""Replay Attack simulation."""

from typing import Dict, Any, Optional
from ..signature.signature_model import QuantumSignature
from ..verification.verifier import SignatureVerifier


class ReplaySimulator:
    """Simulates capturing and replaying a valid quantum-inspired signature token."""

    @classmethod
    def simulate(
        cls,
        signature: QuantumSignature,
        shots: int = 1000,
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        # Reset cache for clean 2-step replay demonstration
        SignatureVerifier.reset_replay_cache()

        # Attempt 1: Legitimate verification
        first_attempt = SignatureVerifier.verify(
            signature=signature,
            claimed_message=signature.message,
            claimed_signer_id=signature.signer_id,
            shots=shots,
            seed=seed
        )

        # Attempt 2: Replay of the exact same signature token and nonce
        second_attempt = SignatureVerifier.verify(
            signature=signature,
            claimed_message=signature.message,
            claimed_signer_id=signature.signer_id,
            shots=shots,
            seed=seed
        )

        return {
            "attack_type": "REPLAY",
            "signature_id": signature.signature_id,
            "nonce": signature.nonce,
            "first_attempt": first_attempt.model_dump(),
            "second_attempt": second_attempt.model_dump(),
            "replay_prevented": (second_attempt.threat_type.value == "REPLAY"),
            "explanation": "The first verification consumed the signature and registered its unique nonce. When intercepted and replayed, the second attempt was rejected deterministically."
        }
