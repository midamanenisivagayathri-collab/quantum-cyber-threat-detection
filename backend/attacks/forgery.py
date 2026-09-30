"""Digital Signature Forgery Attack simulation."""

from typing import Dict, Any, Optional
from ..signature.signature_model import QuantumSignature
from ..signature.generator import SignatureGenerator
from ..verification.verifier import SignatureVerifier
from ..verification.decision import VerificationResult


class ForgerySimulator:
    """Simulates message tampering and quantum signature payload forgery."""

    @classmethod
    def simulate(
        cls,
        signature: QuantumSignature,
        tampered_message: Optional[str] = None,
        shots: int = 1000,
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        """Modifies the message without updating Alice's authorized private quantum signature."""
        orig_msg = signature.message
        forged_msg = tampered_message or (orig_msg + " [TAMPERED_TRANSACTION_PAYLOAD]")
        
        orig_hash = signature.message_hash
        forged_hash = SignatureGenerator.compute_sha256(forged_msg)

        # Run verification with forged message
        verification = SignatureVerifier.verify(
            signature=signature,
            claimed_message=forged_msg,
            claimed_signer_id=signature.signer_id,
            shots=shots,
            seed=seed
        )

        return {
            "attack_type": "FORGERY",
            "original_message": orig_msg,
            "forged_message": forged_msg,
            "original_hash": orig_hash,
            "forged_hash": forged_hash,
            "hash_match": False,
            "verification_result": verification.model_dump(),
            "explanation": "Attacker modified message payload. Because SHA-256 is collision-resistant and the quantum signature state is bound to the authentic hash, the signature is rejected deterministically."
        }
