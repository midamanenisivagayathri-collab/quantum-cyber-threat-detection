"""FastAPI routes for quantum digital signature generation and verification."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..models.requests import GenerateSignatureRequest, VerifySignatureRequest
from ..signature.generator import SignatureGenerator
from ..signature.signature_model import QuantumSignature
from ..verification.verifier import SignatureVerifier
from ..verification.decision import VerificationResult

router = APIRouter(prefix="/api/signature", tags=["Signature"])


@router.post("/generate", response_model=Dict[str, Any])
def generate_signature(req: GenerateSignatureRequest):
    """Generates a quantum-inspired digital signature for a message."""
    try:
        sig = SignatureGenerator.generate(
            signer_id=req.signer_id,
            message=req.message,
            measurement_basis=req.measurement_basis,
            preferred_state=req.preferred_state
        )
        return sig.to_dict()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/verify", response_model=Dict[str, Any])
def verify_signature(req: VerifySignatureRequest):
    """Verifies a quantum digital signature with deterministic rules."""
    sig = None
    if req.signature_id:
        sig = SignatureGenerator.get_signature(req.signature_id)
    
    if not sig and req.signature_data:
        try:
            sig = QuantumSignature(**req.signature_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid signature structure: {e}")

    if not sig:
        raise HTTPException(
            status_code=404,
            detail="Signature not found. Please provide a valid signature_id or complete signature_data object."
        )

    res = SignatureVerifier.verify(
        signature=sig,
        claimed_message=req.claimed_message,
        claimed_signer_id=req.claimed_signer_id,
        shots=req.shots,
        bit_flip_prob=req.bit_flip_prob,
        phase_flip_prob=req.phase_flip_prob,
        classical_bit_tamper=req.classical_bit_tamper,
        session_id=req.session_id,
        seed=req.seed
    )
    return res.to_dict()


@router.get("/{signature_id}", response_model=Dict[str, Any])
def get_signature(signature_id: str):
    sig = SignatureGenerator.get_signature(signature_id)
    if not sig:
        raise HTTPException(status_code=404, detail="Signature not found")
    return sig.to_dict()
