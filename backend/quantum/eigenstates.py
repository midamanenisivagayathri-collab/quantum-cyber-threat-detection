"""Pauli eigenstates in Z, X, and Y bases.

Defines the six canonical mutually unbiased basis states:
Z basis: |0⟩, |1⟩
X basis: |+⟩ = (|0⟩ + |1⟩)/√2, |-⟩ = (|0⟩ - |1⟩)/√2
Y basis: |+i⟩ = (|0⟩ + i|1⟩)/√2, |-i⟩ = (|0⟩ - i|1⟩)/√2
"""

import enum
import numpy as np
from typing import Dict, Any, List
from .qubit import Qubit


class BasisType(str, enum.Enum):
    Z = "Z"
    X = "X"
    Y = "Y"


class Eigenstates:
    """Factory and registry for Pauli eigenstates and projective measurement bases."""

    SQRT2_INV = 1.0 / np.sqrt(2.0)

    # State vectors
    VEC_0 = np.array([1.0 + 0.0j, 0.0 + 0.0j], dtype=np.complex128)
    VEC_1 = np.array([0.0 + 0.0j, 1.0 + 0.0j], dtype=np.complex128)

    VEC_PLUS = np.array([SQRT2_INV + 0.0j, SQRT2_INV + 0.0j], dtype=np.complex128)
    VEC_MINUS = np.array([SQRT2_INV + 0.0j, -SQRT2_INV + 0.0j], dtype=np.complex128)

    VEC_PLUS_I = np.array([SQRT2_INV + 0.0j, 1.0j * SQRT2_INV], dtype=np.complex128)
    VEC_MINUS_I = np.array([SQRT2_INV + 0.0j, -1.0j * SQRT2_INV], dtype=np.complex128)

    @classmethod
    def get_state(cls, name: str) -> Qubit:
        """Returns a Qubit object corresponding to the given eigenstate name."""
        name_clean = name.strip()
        mapping = {
            "|0>": cls.VEC_0,
            "0": cls.VEC_0,
            "|1>": cls.VEC_1,
            "1": cls.VEC_1,
            "|+>": cls.VEC_PLUS,
            "+": cls.VEC_PLUS,
            "|->": cls.VEC_MINUS,
            "-": cls.VEC_MINUS,
            "|+i>": cls.VEC_PLUS_I,
            "+i": cls.VEC_PLUS_I,
            "|-i>": cls.VEC_MINUS_I,
            "-i": cls.VEC_MINUS_I,
        }
        if name_clean in mapping:
            return Qubit.from_vector(mapping[name_clean])
        raise ValueError(f"Unknown eigenstate: '{name}'. Supported: |0>, |1>, |+>, |->, |+i>, |-i>")

    @classmethod
    def get_basis_vectors(cls, basis: BasisType) -> List[np.ndarray]:
        """Returns the two orthonormal measurement basis vectors [|0_B⟩, |1_B⟩]."""
        if basis == BasisType.Z or basis == "Z":
            return [cls.VEC_0, cls.VEC_1]
        elif basis == BasisType.X or basis == "X":
            return [cls.VEC_PLUS, cls.VEC_MINUS]
        elif basis == BasisType.Y or basis == "Y":
            return [cls.VEC_PLUS_I, cls.VEC_MINUS_I]
        else:
            raise ValueError(f"Unsupported measurement basis: {basis}")

    @classmethod
    def get_basis_labels(cls, basis: BasisType) -> List[str]:
        """Returns string labels for the measurement outcomes in the basis."""
        if basis == BasisType.Z or basis == "Z":
            return ["|0⟩", "|1⟩"]
        elif basis == BasisType.X or basis == "X":
            return ["|+⟩", "|-⟩"]
        elif basis == BasisType.Y or basis == "Y":
            return ["|+i⟩", "|-i⟩"]
        else:
            raise ValueError(f"Unsupported measurement basis: {basis}")

    @classmethod
    def theoretical_probabilities(cls, qubit: Qubit, basis: BasisType) -> Dict[str, float]:
        """Calculates theoretical projection probabilities P_k = |⟨e_k|ψ⟩|²."""
        basis_vecs = cls.get_basis_vectors(basis)
        labels = cls.get_basis_labels(basis)
        
        prob_0 = float(np.abs(np.vdot(basis_vecs[0], qubit.state))**2)
        prob_1 = float(np.abs(np.vdot(basis_vecs[1], qubit.state))**2)
        
        # Ensure exact numerical sum of 1.0
        total = prob_0 + prob_1
        if total > 0:
            prob_0 /= total
            prob_1 /= total
            
        return {
            labels[0]: round(prob_0, 6),
            labels[1]: round(prob_1, 6)
        }

    @classmethod
    def all_eigenstates_info(cls) -> List[Dict[str, Any]]:
        """Returns structured metadata for all 6 eigenstates for the frontend UI."""
        states = [
            ("|0⟩", cls.VEC_0, BasisType.Z, "Computational ground state, +1 eigenvalue of Pauli Z"),
            ("|1⟩", cls.VEC_1, BasisType.Z, "Computational excited state, -1 eigenvalue of Pauli Z"),
            ("|+⟩", cls.VEC_PLUS, BasisType.X, "Equal superposition (|0⟩+|1⟩)/√2, +1 eigenvalue of Pauli X"),
            ("|–⟩", cls.VEC_MINUS, BasisType.X, "Anti-symmetric (|0⟩-|1⟩)/√2, -1 eigenvalue of Pauli X"),
            ("|+i⟩", cls.VEC_PLUS_I, BasisType.Y, "Complex phase (|0⟩+i|1⟩)/√2, +1 eigenvalue of Pauli Y"),
            ("|–i⟩", cls.VEC_MINUS_I, BasisType.Y, "Complex phase (|0⟩-i|1⟩)/√2, -1 eigenvalue of Pauli Y"),
        ]
        
        results = []
        for label, vec, basis, desc in states:
            q = Qubit.from_vector(vec)
            x, y, z = q.bloch_coordinates()
            theta, phi = q.bloch_angles()
            results.append({
                "label": label,
                "basis": basis.value,
                "description": desc,
                "vector": {
                    "alpha": {"real": float(np.real(vec[0])), "imag": float(np.imag(vec[0]))},
                    "beta": {"real": float(np.real(vec[1])), "imag": float(np.imag(vec[1]))}
                },
                "bloch": {"x": round(x, 4), "y": round(y, 4), "z": round(z, 4), "theta_deg": round(np.degrees(theta), 2), "phi_deg": round(np.degrees(phi), 2)},
                "theoretical_z": cls.theoretical_probabilities(q, BasisType.Z),
                "theoretical_x": cls.theoretical_probabilities(q, BasisType.X),
                "theoretical_y": cls.theoretical_probabilities(q, BasisType.Y),
            })
        return results
