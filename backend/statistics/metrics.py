"""Statistical metrics for Quantum-Inspired signature verification.

Mathematical formulas:
1. Agreement Rate: A = successes / N
2. Error Rate: E = errors / N = 1 - A
3. Total Variation Distance (Statistical Distance):
   D(P, Q) = 1/2 * ∑_x |P(x) - Q(x)|
4. Kullback-Leibler (KL) Divergence:
   D_KL(P || Q) = ∑_x P(x) * ln(P(x) / Q(x)) (with ε-smoothing)
5. Quantum Fidelity:
   F(|ψ⟩, |ϕ⟩) = |⟨ψ|ϕ⟩|²
"""

import numpy as np
from typing import Dict, Any, Tuple


class StatisticalMetrics:
    """Computes deterministic mathematical and statistical distances between quantum distributions."""

    @staticmethod
    def calculate_rates(errors: int, successes: int, total_shots: int) -> Tuple[float, float]:
        """Calculates error rate and agreement rate.
        
        error_rate = errors / N
        agreement_rate = successes / N
        """
        if total_shots <= 0:
            return 0.0, 1.0
        err_rate = float(errors) / float(total_shots)
        agr_rate = float(successes) / float(total_shots)
        return round(err_rate, 6), round(agr_rate, 6)

    @staticmethod
    def total_variation_distance(
        p_dist: Dict[str, float], q_dist: Dict[str, float]
    ) -> float:
        """Calculates Total Variation Distance (Statistical Distance):
        
        δ(P, Q) = 1/2 * ∑_{x ∈ Ω} |P(x) - Q(x)|
        Bounded in [0, 1]: 0 indicates identical distributions; 1 indicates disjoint supports.
        """
        all_keys = set(p_dist.keys()).union(set(q_dist.keys()))
        abs_sum = 0.0
        for k in all_keys:
            p_val = p_dist.get(k, 0.0)
            q_val = q_dist.get(k, 0.0)
            abs_sum += abs(p_val - q_val)
        return round(float(0.5 * abs_sum), 6)

    @staticmethod
    def kl_divergence(
        p_dist: Dict[str, float], q_dist: Dict[str, float], epsilon: float = 1e-9
    ) -> float:
        """Calculates Kullback-Leibler (KL) Divergence D_KL(P || Q).
        
        D_KL(P || Q) = ∑ P(x) * ln(P(x) / Q(x))
        Uses ε-smoothing to avoid division by zero or log(0).
        """
        all_keys = set(p_dist.keys()).union(set(q_dist.keys()))
        div = 0.0
        for k in all_keys:
            p_val = max(p_dist.get(k, 0.0), epsilon)
            q_val = max(q_dist.get(k, 0.0), epsilon)
            div += p_val * np.log(p_val / q_val)
        return round(float(max(0.0, div)), 6)

    @staticmethod
    def compare_distributions(
        expected: Dict[str, float], observed: Dict[str, float]
    ) -> Dict[str, Any]:
        """Provides full comparative statistical breakdown."""
        tvd = StatisticalMetrics.total_variation_distance(expected, observed)
        kl = StatisticalMetrics.kl_divergence(observed, expected)
        
        return {
            "total_variation_distance": tvd,
            "kl_divergence": kl,
            "formula_tvd": "δ(P, Q) = 1/2 ∑ |P(x) - Q(x)|",
            "formula_kl": "D_KL(Q || P) = ∑ Q(x) ln(Q(x) / P(x))",
            "explanation": "Total Variation Distance measures the maximum difference in probability that P and Q assign to any event."
        }
