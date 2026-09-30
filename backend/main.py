"""FastAPI Main Application.

Quantum-Inspired Cyber Threat Detection for Digital Signature Security
Teleportation-Based QDS Security Simulation (Educational / Cybersecurity Prototype)
"""

import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models.responses import APIStatusResponse
from .api.signature_routes import router as signature_router
from .api.attack_routes import router as attack_router
from .api.quantum_routes import router as quantum_router
from .api.experiment_routes import router as experiment_router
from .signature.generator import SignatureGenerator
from .verification.verifier import SignatureVerifier
from .security.audit_log import AuditLogManager

app = FastAPI(
    title="Quantum-Inspired Cyber Threat Detection for Digital Signature Security",
    description="A quantum-inspired educational/security simulation of a teleportation-based QDS verification workflow.",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(signature_router)
app.include_router(attack_router)
app.include_router(quantum_router)
app.include_router(experiment_router)


@app.on_event("startup")
def startup_populate_initial_baseline():
    """Initializes the simulation environment with a baseline signature and audit trail."""
    # Ensure at least one initial baseline signature exists for instant testing
    sig = SignatureGenerator.generate(
        signer_id="Alice",
        message="System Init: National Power Grid Dispatch Command #4029",
        measurement_basis="Z"
    )
    # Execute verification to seed initial valid audit block
    SignatureVerifier.verify(
        signature=sig,
        claimed_message=sig.message,
        claimed_signer_id=sig.signer_id,
        shots=1000,
        seed=42,
        record_audit=True
    )


@app.get("/api/health", response_model=APIStatusResponse)
def health_check():
    return APIStatusResponse(
        status="operational",
        system_title="Quantum-Inspired Cyber Threat Detection for Digital Signature Security",
        notice="A quantum-inspired educational/security simulation of a teleportation-based QDS verification workflow",
        quantum_engine="NumPy Matrix Mechanics Simulation",
        ml_used=False,
        timestamp=time.time()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
