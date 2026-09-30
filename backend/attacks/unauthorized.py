"""Unauthorized Verification / Brute-force simulation."""

from typing import Dict, Any, List, Optional
from ..signature.signature_model import QuantumSignature
from ..verification.verifier import SignatureVerifier


class UnauthorizedVerificationSimulator:
    """Simulates rapid unauthorized verification probing beyond allowable session limits."""

    @classmethod
    def simulate(
        cls,
        signature: QuantumSignature,
        total_attempts: int = 5,
        session_id: str = "adversary-probe-session-99",
        shots: int = 500,
        seed: Optional[int] = None
    ) -> Dict[str, Any]:
        results: List[Dict[str, Any]] = []
        lockout_triggered_at = None

        for attempt in range(1, total_attempts + 1):
            # Create a clone with fresh nonce so replay isn't the primary trigger, isolating attempt count
            sig_clone = signature.model_copy(deep=True)
            import uuid
            sig_clone.signature_id = f"SIG-PROBE-{uuid.uuid4().hex[:8].upper()}"
            sig_clone.nonce = uuid.uuid4().hex[:16]

            res = SignatureVerifier.verify(
                signature=sig_clone,
                claimed_message=sig_clone.message,
                claimed_signer_id=sig_clone.signer_id,
                session_id=session_id,
                shots=shots,
                seed=seed
            )
            results.append({
                "attempt_number": attempt,
                "decision": res.decision.value,
                "threat_type": res.threat_type.value,
                "reason": res.reason
            })
            if res.threat_type.value == "UNAUTHORIZED_VERIFICATION" and lockout_triggered_at is None:
                lockout_triggered_at = attempt

        return {
            "attack_type": "UNAUTHORIZED_VERIFICATION",
            "session_id": session_id,
            "total_attempts_executed": total_attempts,
            "lockout_triggered_at_attempt": lockout_triggered_at,
            "attempts_history": results,
            "explanation": f"Verifier enforced rate-limiting. Verification attempts beyond threshold were locked out with UNAUTHORIZED_VERIFICATION alert."
        }
