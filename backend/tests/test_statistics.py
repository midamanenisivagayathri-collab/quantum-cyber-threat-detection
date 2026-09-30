"""Tests for statistical distance, forgery probability, audit chain integrity, and reproducibility."""

import unittest
from backend.statistics.metrics import StatisticalMetrics
from backend.statistics.probability import ForgeryProbabilityEstimator
from backend.security.audit_log import AuditLogManager
from backend.experiment.experiment_runner import ExperimentRunner


class TestStatisticsAndAudit(unittest.TestCase):

    def test_16_statistical_distance_and_divergence(self):
        """Test Total Variation Distance and KL divergence properties."""
        p = {"0": 1.0, "1": 0.0}
        q = {"0": 1.0, "1": 0.0}
        self.assertAlmostEqual(StatisticalMetrics.total_variation_distance(p, q), 0.0)

        r = {"0": 0.0, "1": 1.0}
        self.assertAlmostEqual(StatisticalMetrics.total_variation_distance(p, r), 1.0)

        s = {"0": 0.8, "1": 0.2}
        self.assertAlmostEqual(StatisticalMetrics.total_variation_distance(p, s), 0.2)

    def test_17_forgery_probability_bounds(self):
        """Test theoretical forgery probability is monotonically decreasing with threshold and shots."""
        res_1000 = ForgeryProbabilityEstimator.estimate_forgery_probability(
            shots=1000,
            min_agreement_threshold=0.90
        )
        prob = res_1000["forgery_probability"]
        self.assertLess(prob, 1e-10)
        self.assertIn("Lower probability indicates", res_1000["disclaimer"])

    def test_18_audit_chain_integrity_and_tamper_detection(self):
        """Test cryptographic SHA-256 hash chain detects data tampering."""
        AuditLogManager.clear()
        
        # Log 3 events
        AuditLogManager.log_event("Alice", "SIG_CREATE", "VALID_SIGNATURE", "Event 1")
        AuditLogManager.log_event("Alice", "SIG_VERIFY", "VALID_SIGNATURE", "Event 2")
        AuditLogManager.log_event("Eve", "SIG_VERIFY", "THREAT_DETECTED", "Event 3", attack_type="IMPERSONATION")

        # Initial chain must be valid
        val_clean = AuditLogManager.verify_audit_chain()
        self.assertTrue(val_clean["is_valid"])
        self.assertEqual(val_clean["chain_length"], 3)

        # Tamper with event #1
        AuditLogManager.simulate_tampering(1)
        val_tampered = AuditLogManager.verify_audit_chain()
        self.assertFalse(val_tampered["is_valid"])
        self.assertEqual(val_tampered["status"], "AUDIT_CHAIN_TAMPERED")

    def test_19_reproducible_experiment(self):
        """Test that identical seed produces identical experiment outputs."""
        exp1 = ExperimentRunner.run_multi_trial_experiment(
            num_trials=5,
            shots=500,
            intensity=0.25,
            seed=777
        )
        exp2 = ExperimentRunner.run_multi_trial_experiment(
            num_trials=5,
            shots=500,
            intensity=0.25,
            seed=777
        )
        self.assertEqual(exp1["average_error_rate"], exp2["average_error_rate"])
        self.assertEqual(exp1["trials"][0]["error_rate"], exp2["trials"][0]["error_rate"])


if __name__ == "__main__":
    unittest.main()
