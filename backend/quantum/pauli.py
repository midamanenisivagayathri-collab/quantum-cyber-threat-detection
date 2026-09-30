"""Pauli operators and mathematical operations.

Implements standard Pauli spin matrices:
I = [[1, 0], [0, 1]]
X = [[0, 1], [1, 0]]
Y = [[0, -i], [i, 0]]
Z = [[1, 0], [0, -1]]
"""

import numpy as np
from typing import Dict, Any, List

PAULI_I = np.array([[1.0 + 0.0j, 0.0 + 0.0j], [0.0 + 0.0j, 1.0 + 0.0j]], dtype=np.complex128)
PAULI_X = np.array([[0.0 + 0.0j, 1.0 + 0.0j], [1.0 + 0.0j, 0.0 + 0.0j]], dtype=np.complex128)
PAULI_Y = np.array([[0.0 + 0.0j, -1.0j], [1.0j, 0.0 + 0.0j]], dtype=np.complex128)
PAULI_Z = np.array([[1.0 + 0.0j, 0.0 + 0.0j], [0.0 + 0.0j, -1.0 + 0.0j]], dtype=np.complex128)

# Hadamard gate
HADAMARD = np.array([[1.0, 1.0], [1.0, -1.0]], dtype=np.complex128) / np.sqrt(2.0)

# S gate (Phase gate)
PHASE_S = np.array([[1.0 + 0.0j, 0.0 + 0.0j], [0.0 + 0.0j, 1.0j]], dtype=np.complex128)


class PauliMatrices:
    """Provides representations and transformations of Pauli operators."""

    @staticmethod
    def get_matrix(name: str) -> np.ndarray:
        name = name.upper()
        if name == "I":
            return PAULI_I.copy()
        elif name == "X":
            return PAULI_X.copy()
        elif name == "Y":
            return PAULI_Y.copy()
        elif name == "Z":
            return PAULI_Z.copy()
        elif name == "H":
            return HADAMARD.copy()
        elif name == "S":
            return PHASE_S.copy()
        else:
            raise ValueError(f"Unknown Pauli operator: {name}")

    @staticmethod
    def get_details(name: str) -> Dict[str, Any]:
        """Returns JSON-serializable details of the Pauli matrix for UI rendering."""
        matrix = PauliMatrices.get_matrix(name)
        real_part = np.real(matrix).tolist()
        imag_part = np.imag(matrix).tolist()
        
        descriptions = {
            "I": "Identity operator: preserves state without alteration.",
            "X": "Pauli-X (Bit Flip): swaps |0⟩ and |1⟩ amplitudes, analogous to classical NOT.",
            "Y": "Pauli-Y (Bit & Phase Flip): swaps amplitudes and applies a relative ±i phase.",
            "Z": "Pauli-Z (Phase Flip): introduces a π phase shift on |1⟩ while keeping |0⟩ unchanged.",
            "H": "Hadamard gate: creates unbiased superposition from computational basis states.",
            "S": "Phase gate (S): introduces a π/2 phase shift on |1⟩."
        }
        
        return {
            "name": name.upper(),
            "description": descriptions.get(name.upper(), "Unitary quantum gate"),
            "real_matrix": real_part,
            "imag_matrix": imag_part,
            "eigenvalues": [1.0, -1.0] if name.upper() in ["X", "Y", "Z"] else [1.0, 1.0],
            "is_unitary": bool(np.allclose(matrix @ matrix.conj().T, np.eye(2))),
            "is_hermitian": bool(np.allclose(matrix, matrix.conj().T))
        }

    @staticmethod
    def apply_operator(operator_name: str, state_vector: np.ndarray) -> np.ndarray:
        """Applies a single-qubit operator to a 2D state vector."""
        matrix = PauliMatrices.get_matrix(operator_name)
        new_state = matrix @ state_vector
        norm = np.linalg.norm(new_state)
        if norm > 1e-12:
            new_state = new_state / norm
        return new_state
