"""FastAPI routes for experiments, thresholds, audit logs, and dashboard statistics."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..models.requests import ExperimentRunRequest, ThresholdUpdateRequest
from ..models.responses import SecurityStatisticsResponse
from ..experiment.experiment_runner import ExperimentRunner
from ..verification.thresholds import ThresholdManager
from ..security.audit_log import AuditLogManager
from ..signature.generator import SignatureGenerator

router = APIRouter(prefix="/api", tags=["Experiment & Security"])


@router.post("/experiment/run", response_model=Dict[str, Any])
def run_experiment(req: ExperimentRunRequest):
    """Runs a controlled cybersecurity / quantum experiment."""
    mode = req.mode.upper()
    try:
        if mode == "BASELINE":
            return ExperimentRunner.run_baseline(shots=req.shots, basis=req.basis, seed=req.seed)
        elif mode == "ATTACK_COMPARISON":
            return ExperimentRunner.run_attack_comparison(shots=req.shots, channel_intensity=req.intensity, seed=req.seed)
        elif mode == "WHAT_IF":
            return ExperimentRunner.run_what_if(
                attack_type=req.attack_type,
                shots=req.shots,
                basis=req.basis,
                max_error_threshold=req.threshold_max_error,
                seed=req.seed
            )
        elif mode == "MULTI_TRIAL":
            return ExperimentRunner.run_multi_trial_experiment(
                num_trials=req.num_trials,
                shots=req.shots,
                attack_type=req.attack_type,
                intensity=req.intensity,
                basis=req.basis,
                threshold_max_error=req.threshold_max_error,
                seed=req.seed or 42
            )
        elif mode == "FULL_DEMO":
            return ExperimentRunner.run_full_security_demo()
        else:
            raise HTTPException(status_code=400, detail=f"Unknown experiment mode: {req.mode}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/experiment/full-demo", response_model=Dict[str, Any])
def run_full_security_demo():
    """Runs the one-click comprehensive 8-step security demonstration."""
    return ExperimentRunner.run_full_security_demo()


@router.post("/experiment/legitimacy-benchmark", response_model=Dict[str, Any])
def run_legitimacy_benchmark(num_trials: int = 10, shots: int = 1000, basis: str = "Z"):
    """Demonstrates deterministic 100% acceptance of legitimate signatures with 0% false rejections."""
    return ExperimentRunner.run_deterministic_legitimacy_benchmark(num_trials=num_trials, shots=shots, basis=basis)


@router.get("/thresholds", response_model=Dict[str, Any])
def get_thresholds():
    return ThresholdManager.get_thresholds().to_dict()


@router.post("/thresholds", response_model=Dict[str, Any])
def update_thresholds(req: ThresholdUpdateRequest):
    updated = ThresholdManager.update_thresholds(
        max_error_rate=req.max_error_rate,
        min_agreement_rate=req.min_agreement_rate,
        max_statistical_distance=req.max_statistical_distance,
        replay_time_window_seconds=req.replay_time_window_seconds,
        max_verification_attempts=req.max_verification_attempts
    )
    return updated.to_dict()


@router.get("/security/logs", response_model=List[Dict[str, Any]])
def get_security_logs(limit: int = 100):
    """Retrieves actual recorded security events in reverse chronological order."""
    return AuditLogManager.get_logs(limit=limit)


@router.get("/security/audit-chain/verify", response_model=Dict[str, Any])
def verify_audit_chain():
    """Cryptographically validates SHA-256 hash pointers across the full audit chain."""
    return AuditLogManager.verify_audit_chain()


@router.post("/security/audit-chain/simulate-tampering", response_model=Dict[str, Any])
def simulate_audit_tampering():
    """Simulates an attacker tampering with an audit record to demonstrate fraud detection."""
    tampered = AuditLogManager.simulate_tampering()
    return {
        "tampered_simulated": tampered,
        "message": "Audit log entry modified without updating SHA-256 hash. Run audit chain verification to observe detection."
    }


@router.get("/statistics", response_model=SecurityStatisticsResponse)
def get_security_statistics():
    """Computes real live dashboard metrics from actual system operation logs."""
    all_events = AuditLogManager.get_all_logs()
    
    signatures_verified = len([e for e in all_events if e.event_type == "SIGNATURE_VERIFICATION"])
    threats_detected = len([e for e in all_events if e.decision == "THREAT_DETECTED"])
    
    forgery_attempts = len([e for e in all_events if e.attack_type == "FORGERY"])
    replay_attempts = len([e for e in all_events if e.attack_type == "REPLAY"])
    impersonation_attempts = len([e for e in all_events if e.attack_type == "IMPERSONATION"])
    channel_manipulations = len([e for e in all_events if e.attack_type == "QUANTUM_CHANNEL_MANIPULATION"])
    unauthorized_attempts = len([e for e in all_events if e.attack_type == "UNAUTHORIZED_VERIFICATION"])

    # Determine security status
    chain_val = AuditLogManager.verify_audit_chain()
    if not chain_val["is_valid"]:
        sec_status = "AUDIT_CHAIN_BREACHED"
    elif threats_detected > 0:
        sec_status = "ACTIVE_THREATS_DETECTED"
    else:
        sec_status = "SECURE_NOMINAL"

    return SecurityStatisticsResponse(
        signatures_generated=len(SignatureGenerator._signature_store),
        signatures_verified=signatures_verified,
        threats_detected=threats_detected,
        forgery_attempts=forgery_attempts,
        replay_attempts=replay_attempts,
        impersonation_attempts=impersonation_attempts,
        channel_manipulations=channel_manipulations,
        unauthorized_attempts=unauthorized_attempts,
        current_security_status=sec_status,
        recent_events_count=len(all_events),
        audit_chain_valid=chain_val["is_valid"]
    )
