"""FastAPI routes for quantum concepts, gates, and simulation protocols."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..models.requests import TeleportationSimulateRequest, MeasurementRunRequest
from ..quantum.pauli import PauliMatrices
from ..quantum.eigenstates import Eigenstates, BasisType
from ..quantum.bell_state import BellState, BellStateType
from ..quantum.qubit import Qubit
from ..quantum.teleportation import QuantumTeleportation
from ..quantum.measurement import ProjectiveMeasurement

router = APIRouter(prefix="/api/quantum", tags=["Quantum"])


@router.get("/pauli", response_model=List[Dict[str, Any]])
def get_pauli_matrices():
    operators = ["I", "X", "Y", "Z", "H", "S"]
    return [PauliMatrices.get_details(op) for op in operators]


@router.get("/eigenstates", response_model=List[Dict[str, Any]])
def get_eigenstates():
    return Eigenstates.all_eigenstates_info()


@router.get("/bell-states", response_model=List[Dict[str, Any]])
def get_bell_states():
    return [
        BellState.create(BellStateType.PHI_PLUS.value).to_dict(),
        BellState.create(BellStateType.PHI_MINUS.value).to_dict(),
        BellState.create(BellStateType.PSI_PLUS.value).to_dict(),
        BellState.create(BellStateType.PSI_MINUS.value).to_dict()
    ]


@router.post("/teleportation/simulate", response_model=Dict[str, Any])
def simulate_teleportation(req: TeleportationSimulateRequest):
    """Executes full step-by-step quantum teleportation protocol."""
    try:
        alpha = complex(req.alpha_real, req.alpha_imag)
        beta = complex(req.beta_real, req.beta_imag)
        qubit = Qubit(alpha, beta)

        res = QuantumTeleportation.simulate(
            input_qubit=qubit,
            measurement_basis=req.basis,
            shots=req.shots,
            bit_flip_prob=req.bit_flip_prob,
            phase_flip_prob=req.phase_flip_prob,
            classical_bit_tamper=req.classical_tamper,
            seed=req.seed
        )
        return res.model_dump()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/measurement/run", response_model=Dict[str, Any])
def run_measurement(req: MeasurementRunRequest):
    """Executes projective quantum measurement on an eigenstate."""
    try:
        qubit = Eigenstates.get_state(req.state_label)
        basis_enum = BasisType(req.basis.upper())
        res = ProjectiveMeasurement.measure(
            qubit=qubit,
            basis=basis_enum,
            shots=req.shots,
            seed=req.seed
        )
        return res.model_dump()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
