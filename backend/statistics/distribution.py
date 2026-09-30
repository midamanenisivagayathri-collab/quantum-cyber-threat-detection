"""Quantum distribution comparisons and histogram analysis."""

import numpy as np
from typing import Dict, Any, List
from .metrics import StatisticalMetrics


class DistributionAnalyzer:
    """Analyzes and compares quantum measurement probability distributions."""

    @staticmethod
    def format_distribution_comparison(
        expected_probs: Dict[str, float],
        observed_counts: Dict[str, int],
        total_shots: int
    ) -> Dict[str, Any]:
        """Creates unified comparative histogram data for charts."""
        labels = sorted(list(expected_probs.keys()))
        comparison_points = []
        observed_probs = {}

        for lbl in labels:
            cnt = observed_counts.get(lbl, 0)
            emp_p = cnt / total_shots if total_shots > 0 else 0.0
            theo_p = expected_probs.get(lbl, 0.0)
            observed_probs[lbl] = emp_p
            
            diff = emp_p - theo_p
            comparison_points.append({
                "outcome": lbl,
                "expected_probability": round(theo_p, 4),
                "observed_probability": round(emp_p, 4),
                "observed_count": cnt,
                "delta": round(diff, 4),
                "delta_percentage": round(diff * 100.0, 2)
            })

        tvd = StatisticalMetrics.total_variation_distance(expected_probs, observed_probs)
        kl = StatisticalMetrics.kl_divergence(observed_probs, expected_probs)

        return {
            "comparison_points": comparison_points,
            "total_variation_distance": round(tvd, 6),
            "kl_divergence": round(kl, 6),
            "total_shots": total_shots,
            "is_statistically_close": bool(tvd <= 0.10)
        }
