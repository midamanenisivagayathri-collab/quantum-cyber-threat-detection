"""Qubit representation, Bloch sphere coordinates, and state transformations."""

import numpy as np
from typing import Dict, Any, Tuple


class Qubit:
    """Represents a single-qubit quantum state: |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1."""

    def __init__(self, alpha: complex = 1.0 + 0.0j, beta: complex = 0.0 + 0.0j):
        self.state = np.array([alpha, beta], dtype=np.complex128)
        self.normalize()

    def normalize(self) -> None:
        """Normalizes the state vector so that |α|² + |β|² = 1."""
        norm = np.linalg.norm(self.state)
        if norm < 1e-12:
            # Fallback to |0⟩ if degenerate zero vector provided
            self.state = np.array([1.0 + 0.0j, 0.0 + 0.0j], dtype=np.complex128)
        else:
            self.state = self.state / norm

    @classmethod
    def from_bloch_angles(cls, theta: float, phi: float) -> "Qubit":
        """Creates a qubit from polar angle θ (0 to π) and azimuthal angle φ (0 to 2π)."""
        alpha = np.cos(theta / 2.0)
        beta = np.exp(1.0j * phi) * np.sin(theta / 2.0)
        return cls(alpha, beta)

    @classmethod
    def from_vector(cls, vec: np.ndarray) -> "Qubit":
        """Creates a qubit from a 2-element numpy array or list."""
        arr = np.asarray(vec, dtype=np.complex128)
        if arr.shape != (2,):
            raise ValueError(f"State vector must have shape (2,), got {arr.shape}")
        return cls(arr[0], arr[1])

    @property
    def alpha(self) -> complex:
        return self.state[0]

    @property
    def beta(self) -> complex:
        return self.state[1]

    def bloch_coordinates(self) -> Tuple[float, float, float]:
        """Calculates Cartesian Bloch sphere coordinates (x, y, z).
        
        x = 2 * Re(α* β)
        y = 2 * Im(α* β)
        z = |α|² - |β|²
        """
        alpha_conj = np.conj(self.alpha)
        x = float(2.0 * np.real(alpha_conj * self.beta))
        y = float(2.0 * np.imag(alpha_conj * self.beta))
        z = float(np.abs(self.alpha)**2 - np.abs(self.beta)**2)
        return (x, y, z)

    def bloch_angles(self) -> Tuple[float, float]:
        """Returns spherical angles (θ, φ) in radians."""
        x, y, z = self.bloch_coordinates()
        # Clamp z to [-1, 1] to avoid precision errors with arccos
        z_clamped = max(-1.0, min(1.0, z))
        theta = float(np.arccos(z_clamped))
        phi = float(np.arctan2(y, x))
        if phi < 0:
            phi += 2 * np.pi
        return (theta, phi)

    def density_matrix(self) -> np.ndarray:
        """Returns density matrix ρ = |ψ⟩⟨ψ| (2x2 complex ndarray)."""
        ket = self.state.reshape(2, 1)
        bra = ket.conj().T
        return ket @ bra

    def fidelity_with(self, other: "Qubit") -> float:
        """Calculates quantum state fidelity F(|ψ⟩, |ϕ⟩) = |⟨ψ|ϕ⟩|²."""
        overlap = np.vdot(self.state, other.state)
        return float(np.abs(overlap)**2)

    def apply_gate(self, matrix: np.ndarray) -> "Qubit":
        """Applies a 2x2 unitary matrix to the qubit and returns a new Qubit."""
        new_state = matrix @ self.state
        return Qubit(new_state[0], new_state[1])

    def to_dict(self) -> Dict[str, Any]:
        """Returns a comprehensive JSON-friendly representation for frontend display."""
        x, y, z = self.bloch_coordinates()
        theta, phi = self.bloch_angles()
        prob_0 = float(np.abs(self.alpha)**2)
        prob_1 = float(np.abs(self.beta)**2)
        
        return {
            "alpha": {"real": float(np.real(self.alpha)), "imag": float(np.imag(self.alpha))},
            "beta": {"real": float(np.real(self.beta)), "imag": float(np.imag(self.beta))},
            "probabilities": {
                "0": round(prob_0, 6),
                "1": round(prob_1, 6)
            },
            "bloch_sphere": {
                "x": round(x, 6),
                "y": round(y, 6),
                "z": round(z, 6),
                "theta_rad": round(theta, 6),
                "phi_rad": round(phi, 6),
                "theta_deg": round(np.degrees(theta), 2),
                "phi_deg": round(np.degrees(phi), 2)
            },
            "state_string": f"({self.alpha.real:+.3f}{self.alpha.imag:+.3f}i)|0⟩ + ({self.beta.real:+.3f}{self.beta.imag:+.3f}i)|1⟩"
        }
