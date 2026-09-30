"""Bell states (EPR pairs) and bipartite quantum entanglement.

Implements the four maximally entangled 2-qubit Bell states:
|Φ⁺⟩ = (|00⟩ + |11⟩) / √2
|Φ⁻⟩ = (|00⟩ - |11⟩) / √2
|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2
|Ψ⁻⟩ = (|01⟩ - |10⟩) / √2
"""

import enum
import numpy as np
from typing import Dict, Any, List, Tuple


class BellStateType(str, enum.Enum):
    PHI_PLUS = "PHI_PLUS"     # (|00⟩ + |11⟩) / √2
    PHI_MINUS = "PHI_MINUS"   # (|00⟩ - |11⟩) / √2
    PSI_PLUS = "PSI_PLUS"     # (|01⟩ + |10⟩) / √2
    PSI_MINUS = "PSI_MINUS"   # (|01⟩ - |10⟩) / √2


class BellState:
    """Represents a two-qubit maximally entangled Bell state."""

    SQRT2_INV = 1.0 / np.sqrt(2.0)

    # 4-dimensional state vectors in basis {|00⟩, |01⟩, |10⟩, |11⟩}
    VECTORS = {
        BellStateType.PHI_PLUS: np.array([SQRT2_INV, 0.0, 0.0, SQRT2_INV], dtype=np.complex128),
        BellStateType.PHI_MINUS: np.array([SQRT2_INV, 0.0, 0.0, -SQRT2_INV], dtype=np.complex128),
        BellStateType.PSI_PLUS: np.array([0.0, SQRT2_INV, SQRT2_INV, 0.0], dtype=np.complex128),
        BellStateType.PSI_MINUS: np.array([0.0, SQRT2_INV, -SQRT2_INV, 0.0], dtype=np.complex128),
    }

    def __init__(self, state_type: BellStateType = BellStateType.PHI_PLUS):
        self.state_type = state_type
        self.state_vector = self.VECTORS[state_type].copy()

    @classmethod
    def create(cls, state_type: str = "PHI_PLUS") -> "BellState":
        enum_type = BellStateType(state_type)
        return cls(enum_type)

    def density_matrix(self) -> np.ndarray:
        """Returns 4x4 density matrix ρ = |B⟩⟨B|."""
        ket = self.state_vector.reshape(4, 1)
        return ket @ ket.conj().T

    def reduced_density_matrix_alice(self) -> np.ndarray:
        """Partial trace over Bob's qubit.
        
        For any maximally entangled Bell state, the reduced state of Alice's
        subsystem is the maximally mixed state I/2.
        """
        rho = self.density_matrix()
        # Partial trace over qubit B (subsystem 1):
        # Tr_B(rho)_{i,j} = rho_{i0, j0} + rho_{i1, j1}
        # In computational basis index: |ij⟩ = 2*i + j
        # rho_A[0,0] = rho[0,0] + rho[1,1]
        # rho_A[0,1] = rho[0,2] + rho[1,3]
        # rho_A[1,0] = rho[2,0] + rho[3,1]
        # rho_A[1,1] = rho[2,2] + rho[3,3]
        rho_A = np.zeros((2, 2), dtype=np.complex128)
        rho_A[0, 0] = rho[0, 0] + rho[1, 1]
        rho_A[0, 1] = rho[0, 2] + rho[1, 3]
        rho_A[1, 0] = rho[2, 0] + rho[3, 1]
        rho_A[1, 1] = rho[2, 2] + rho[3, 3]
        return rho_A

    def entanglement_entropy(self) -> float:
        """Von Neumann entanglement entropy S(ρ_A) = -Tr(ρ_A log2 ρ_A) = 1.0 bit."""
        rho_A = self.reduced_density_matrix_alice()
        eigenvalues = np.linalg.eigvalsh(rho_A)
        # Avoid log(0)
        entropy = 0.0
        for ev in eigenvalues:
            if ev > 1e-12:
                entropy -= ev * np.log2(ev)
        return float(entropy)

    def concurrence(self) -> float:
        """Concurrence of the pure bipartite state C = 1.0 for all Bell states."""
        return 1.0

    def theoretical_probabilities(self) -> Dict[str, float]:
        """Returns theoretical outcome probabilities in computational basis {|00⟩, |01⟩, |10⟩, |11⟩}."""
        probs = np.abs(self.state_vector)**2
        labels = ["00", "01", "10", "11"]
        return {labels[i]: round(float(probs[i]), 6) for i in range(4)}

    def sample_measurements(self, shots: int = 1000, seed: int = None) -> Dict[str, int]:
        """Simulates projective measurements of both qubits in computational basis."""
        if seed is not None:
            np.random.seed(seed)
        probs = np.abs(self.state_vector)**2
        outcomes = np.random.choice(["00", "01", "10", "11"], size=shots, p=probs)
        unique, counts = np.unique(outcomes, return_counts=True)
        counts_dict = {"00": 0, "01": 0, "10": 0, "11": 0}
        counts_dict.update(dict(zip(unique, counts)))
        return counts_dict

    def to_dict(self) -> Dict[str, Any]:
        """Provides serialized data for circuit display, formulas, and state vectors."""
        descriptions = {
            BellStateType.PHI_PLUS: "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 (Standard teleportation carrier)",
            BellStateType.PHI_MINUS: "|Φ⁻⟩ = (|00⟩ - |11⟩)/√2",
            BellStateType.PSI_PLUS: "|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2",
            BellStateType.PSI_MINUS: "|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2 (Singlet state)",
        }
        
        circuit_diagram = [
            "q_A: ──|0⟩──[ H ]──■──── (Alice)",
            "                   │            ",
            "q_B: ──|0⟩─────────[X]─── (Bob)  "
        ]

        return {
            "type": self.state_type.value,
            "description": descriptions.get(self.state_type, ""),
            "state_vector": [
                {"component": "|00⟩", "real": float(np.real(self.state_vector[0])), "imag": float(np.imag(self.state_vector[0]))},
                {"component": "|01⟩", "real": float(np.real(self.state_vector[1])), "imag": float(np.imag(self.state_vector[1]))},
                {"component": "|10⟩", "real": float(np.real(self.state_vector[2])), "imag": float(np.imag(self.state_vector[2]))},
                {"component": "|11⟩", "real": float(np.real(self.state_vector[3])), "imag": float(np.imag(self.state_vector[3]))},
            ],
            "theoretical_probabilities": self.theoretical_probabilities(),
            "entanglement_entropy": round(self.entanglement_entropy(), 4),
            "concurrence": self.concurrence(),
            "circuit_ascii": "\n".join(circuit_diagram)
        }
