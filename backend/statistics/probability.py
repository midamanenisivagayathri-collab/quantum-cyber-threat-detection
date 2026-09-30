"""Mathematical estimation of forgery probability under explicit simulation assumptions.

Note: This prototype is an educational/cybersecurity simulation.
It does NOT provide real-world quantum cryptographic security guarantees.
The calculated probabilities depend strictly on the mathematical assumptions of
the simulation model, token length, measurement bases, and threshold parameters.
"""

import numpy as np
from typing import Dict, Any
from scipy.stats import binom


class ForgeryProbabilityEstimator:
    """Calculates theoretical forgery probability bounds under defined simulation assumptions."""

    DISCLAIMER = (
        "Lower probability indicates a smaller chance that an unauthorized "
        "signature passes the configured verification test under the simulation assumptions. "
        "This calculation does not claim real-world quantum physical security."
    )

    @classmethod
    def estimate_forgery_probability(
        cls,
        shots: int,
        min_agreement_threshold: float,
        num_quantum_tokens: int = 1,
        adversary_knowledge_basis: bool = False,
        adversary_guessed_state: bool = False
    ) -> Dict[str, Any]:
        """Calculates the probability that an unauthorized party succeeds in passing verification.
        
        Assumptions:
        1. An unauthorized attacker does not hold Alice's private preparation key.
        2. With mutually unbiased bases (Z, X, Y), a blind guess of the basis has success prob 1/3 (or 1/2 if 2 bases).
        3. If basis is guessed correctly, random guess of binary eigenstate outcome has p = 0.5.
        4. Over N measurement shots, passing requires k >= ceil(N * min_agreement_threshold) agreements.
        5. For M independent quantum tokens, total passing prob = (P_single)^M.
        """
        # Single-shot passing probability under blind random guess:
        # P(correct outcome | wrong basis) = 0.5 (completely uniform)
        # P(correct outcome | right basis but random state) = 0.5
        p_random_match = 0.5

        # Threshold required successes
        k_req = int(np.ceil(shots * min_agreement_threshold))

        # 1. Exact Binomial Tail Calculation: P(X >= k_req)
        try:
            p_single_token = float(binom.sf(k_req - 1, shots, p_random_match))
        except Exception:
            mu = shots * p_random_match
            sigma = np.sqrt(shots * p_random_match * (1.0 - p_random_match))
            z = (k_req - 0.5 - mu) / sigma
            from math import erfc
            p_single_token = 0.5 * erfc(z / np.sqrt(2.0))

        # 2. Chernoff-Hoeffding Tail Bound: P(X >= N * theta) <= exp(-2 * N * (theta - p)^2)
        epsilon = max(0.0, min_agreement_threshold - p_random_match)
        chernoff_exponent = -2.0 * shots * (epsilon ** 2)
        chernoff_bound = float(np.exp(min(0.0, chernoff_exponent)))

        # 3. Sanov / Relative Entropy Exponent: D_KL(theta || p)
        # D_KL(theta || 0.5) = theta * ln(theta / 0.5) + (1 - theta) * ln((1 - theta) / 0.5)
        if 0.5 < min_agreement_threshold < 1.0:
            th = min_agreement_threshold
            d_kl = th * np.log(th / 0.5) + (1.0 - th) * np.log((1.0 - th) / 0.5)
            sanov_bound = float(np.exp(-shots * d_kl))
        else:
            sanov_bound = chernoff_bound

        # Overall forgery probability across M independent tokens
        p_forgery = float(p_single_token ** num_quantum_tokens)
        p_forgery = max(1e-18, min(1.0, p_forgery))

        security_bits = min(256.0, round(-float(np.log2(max(1e-77, chernoff_bound))), 1))

        return {
            "forgery_probability": p_forgery,
            "scientific_notation": f"{p_forgery:.3e}",
            "chernoff_bound": chernoff_bound,
            "chernoff_scientific": f"{chernoff_bound:.3e}",
            "sanov_asymptotic_bound": sanov_bound,
            "security_strength_bits": security_bits,
            "log10_security_margin": round(-float(np.log10(p_forgery)), 2) if p_forgery > 0 else 18.0,
            "calculation_steps": {
                "step_1_shots": shots,
                "step_2_threshold_fraction": min_agreement_threshold,
                "step_3_required_successes": f"k_req = ceil({shots} × {min_agreement_threshold}) = {k_req}",
                "step_4_adversary_guess_rate": f"p_guess = {p_random_match} (uniform MUB guess)",
                "step_5_binomial_tail_formula": f"∑_{{k={k_req}}}^{{{shots}}} C({shots}, k) (0.5)^k (0.5)^{{{shots}-k}}",
                "step_6_chernoff_derivation": f"exp(-2 × {shots} × ({epsilon:.2f})²) = exp({chernoff_exponent:.1f}) ≈ {chernoff_bound:.2e}"
            },
            "model_assumptions": {
                "measurement_shots": shots,
                "required_successes": k_req,
                "min_agreement_threshold": min_agreement_threshold,
                "quantum_tokens": num_quantum_tokens,
                "random_guess_agreement_p": p_random_match,
                "adversary_model": "Blind intercept-resend or random state injection"
            },
            "formula": "P_forgery = [ ∑_{k=k_req}^{N} C(N, k) p^k (1-p)^{N-k} ]^M",
            "chernoff_formula": "P_forgery ≤ exp(-2 N (θ - p_guess)²)",
            "disclaimer": cls.DISCLAIMER
        }
