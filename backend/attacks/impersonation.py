"""Signer Impersonation Attack simulation."""

from typing import Dict, Any, Optional
from ..signature.signature_model import QuantumSignature
from ..verification.verifier import SignatureVerifier


class ImpersonationSimulator:
    """Simulates an adversary impersonating an authorized signer (e.g. Eve claiming Alice's role)."""

    @classmethod
    def simulate(
        cls,
        signature: QuantumSignature,
        attacker_id: str = "Eve_Attacker",
        shots: int = 1000,
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        verification = SignatureVerifier.verify(
            signature=signature,
            claimed_message=signature.message,
            claimed_signer_id=attacker_id,
            shots=shots,
            seed=seed
        )

        return {
            "attack_type": "IMPERSONATION",
            "expected_signer": signature.signer_id,
            "claimed_signer": attacker_id,
            "is_authorized": False,
            "verification_result": verification.model_dump(),
            "explanation": f"Adversary '{attacker_id}' attempted to verify a signature claiming identity without being registered in the public trust registry."
        }
