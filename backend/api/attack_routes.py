"""FastAPI routes for cyber attack simulations."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..models.requests import AttackSimulateRequest
from ..signature.generator import SignatureGenerator
from ..attacks.forgery import ForgerySimulator
from ..attacks.impersonation import ImpersonationSimulator
from ..attacks.replay import ReplaySimulator
from ..attacks.channel import ChannelAttackSimulator
from ..attacks.unauthorized import UnauthorizedVerificationSimulator

router = APIRouter(prefix="/api/attack", tags=["Attacks"])


@router.get("/types", response_model=List[Dict[str, str]])
def get_attack_types():
    return [
        {"type": "FORGERY", "label": "Digital Signature Forgery", "desc": "Alters document message contents and hash"},
        {"type": "IMPERSONATION", "label": "Signer Impersonation", "desc": "Submits signature under unauthorized identity"},
        {"type": "REPLAY", "label": "Replay Attack", "desc": "Reuses already consumed nonce/signature token"},
        {"type": "QUANTUM_CHANNEL_MANIPULATION", "label": "Quantum Channel Manipulation", "desc": "Injects bit/phase flips into state carrier"},
        {"type": "UNAUTHORIZED_VERIFICATION", "label": "Unauthorized Verification Probing", "desc": "Exceeds rate limits and allowed attempts"}
    ]


@router.post("/simulate", response_model=Dict[str, Any])
def simulate_attack(req: AttackSimulateRequest):
    """Executes a simulated attack vector against a legitimate or generated signature."""
    # Obtain or generate base signature
    sig = None
    if req.signature_id:
        sig = SignatureGenerator.get_signature(req.signature_id)
    if not sig:
        sig = SignatureGenerator.generate(
            signer_id="Alice",
            message="Secure Financial Authorization: Transfer $25,000",
            measurement_basis="Z"
        )

    attack_type = req.attack_type.upper()

    if attack_type == "FORGERY":
        return ForgerySimulator.simulate(
            signature=sig,
            tampered_message=req.tampered_message,
            shots=req.shots,
            seed=req.seed
        )
    elif attack_type == "IMPERSONATION":
        return ImpersonationSimulator.simulate(
            signature=sig,
            attacker_id=req.attacker_id or "Eve_Untrusted",
            shots=req.shots,
            seed=req.seed
        )
    elif attack_type == "REPLAY":
        return ReplaySimulator.simulate(
            signature=sig,
            shots=req.shots,
            seed=req.seed
        )
    elif attack_type == "QUANTUM_CHANNEL_MANIPULATION":
        return ChannelAttackSimulator.simulate(
            signature=sig,
            intensity=req.intensity,
            manipulation_type=req.manipulation_type or "BIT_FLIP",
            shots=req.shots,
            seed=req.seed
        )
    elif attack_type == "UNAUTHORIZED_VERIFICATION":
        return UnauthorizedVerificationSimulator.simulate(
            signature=sig,
            total_attempts=5,
            shots=req.shots,
            seed=req.seed
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported attack type: {req.attack_type}")
