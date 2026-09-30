"""Projective quantum measurements and statistical sampling."""

import numpy as np
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from .qubit import Qubit
from .eigenstates import BasisType, Eigenstates


class MeasurementResult(BaseModel):
    basis: str
    shots: int
    labels: List[str]
    theoretical_probabilities: Dict[str, float]
    observed_counts: Dict[str, int]
    empirical_probabilities: Dict[str, float]
    standard_errors: Dict[str, float]
    expected_most_likely: str
    observed_most_likely: str
    match: bool
    seed_used: Optional[int] = None


class ProjectiveMeasurement:
    """Performs projective quantum measurements in Pauli bases with statistical analysis."""

    @staticmethod
    def measure(
        qubit: Qubit,
        basis: BasisType = BasisType.Z,
        shots: int = 1000,
        seed: Optional[int] = None
    ) -> MeasurementResult:
        """Measures a qubit in the specified basis across N shots."""
        rng = np.random.default_rng(seed)
        
        basis_vecs = Eigenstates.get_basis_vectors(basis)
        labels = Eigenstates.get_basis_labels(basis)

        # Theoretical probabilities P_k = |⟨v_k|ψ⟩|²
        p0 = float(np.abs(np.vdot(basis_vecs[0], qubit.state))**2)
        p1 = float(np.abs(np.vdot(basis_vecs[1], qubit.state))**2)
        total_p = p0 + p1
        if total_p > 0:
            p0 /= total_p
            p1 /= total_p
        else:
            p0, p1 = 0.5, 0.5

        probs = [p0, p1]

        # Draw multinomial outcomes
        counts = rng.multinomial(shots, probs)
        c0, c1 = int(counts[0]), int(counts[1])

        emp_p0 = c0 / shots
        emp_p1 = c1 / shots

        # Standard error = sqrt(p * (1-p) / N)
        se0 = np.sqrt(max(0.0, emp_p0 * (1.0 - emp_p0)) / shots)
        se1 = np.sqrt(max(0.0, emp_p1 * (1.0 - emp_p1)) / shots)

        theo_dict = {labels[0]: round(p0, 6), labels[1]: round(p1, 6)}
        obs_dict = {labels[0]: c0, labels[1]: c1}
        emp_dict = {labels[0]: round(emp_p0, 6), labels[1]: round(emp_p1, 6)}
        se_dict = {labels[0]: round(float(se0), 6), labels[1]: round(float(se1), 6)}

        expected_winner = labels[0] if p0 >= p1 else labels[1]
        observed_winner = labels[0] if emp_p0 >= emp_p1 else labels[1]

        return MeasurementResult(
            basis=basis.value,
            shots=shots,
            labels=labels,
            theoretical_probabilities=theo_dict,
            observed_counts=obs_dict,
            empirical_probabilities=emp_dict,
            standard_errors=se_dict,
            expected_most_likely=expected_winner,
            observed_most_likely=observed_winner,
            match=(expected_winner == observed_winner),
            seed_used=seed
        )
