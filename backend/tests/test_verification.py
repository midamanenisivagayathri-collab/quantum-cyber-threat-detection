"""Tests for deterministic signature verification and threshold rules."""

import unittest
from backend.signature.generator import SignatureGenerator
from backend.verification.verifier import SignatureVerifier
from backend.verification.decision import DecisionType, ThreatType
from backend.verification.thresholds import SecurityThresholds


class TestVerification(unittest.TestCase):

    def setUp(self):
        SignatureVerifier.reset_replay_cache()

    def test_08_valid_signature_verification(self):
        """Test legitimate signature verification returns VALID_SIGNATURE."""
        sig = SignatureGenerator.generate(
            signer_id="Alice",
            message="Transfer 500 Credits to Bob",
            measurement_basis="Z"
        )
        res = SignatureVerifier.verify(
            signature=sig,
            claimed_message=sig.message,
            claimed_signer_id="Alice",
            shots=1000,
            seed=42
        )
        self.assertEqual(res.decision, DecisionType.VALID_SIGNATURE)
        self.assertEqual(res.threat_type, ThreatType.NONE)
        self.assertTrue(res.message_hash_match)
        self.assertLessEqual(res.error_rate, 0.10)
        self.assertGreaterEqual(res.agreement_rate, 0.90)

    def test_09_invalid_hash_triggers_forgery_rule(self):
        """Test tampered message hash triggers FORGERY rule."""
        sig = SignatureGenerator.generate(
            signer_id="Alice",
            message="Original Message",
            measurement_basis="Z"
        )
        res = SignatureVerifier.verify(
            signature=sig,
            claimed_message="Tampered Message",
            claimed_signer_id="Alice",
            shots=1000,
            seed=42
        )
        self.assertEqual(res.decision, DecisionType.THREAT_DETECTED)
        self.assertEqual(res.threat_type, ThreatType.FORGERY)
        self.assertFalse(res.message_hash_match)

    def test_10_threshold_tuning_rejection(self):
        """Test that strict error threshold rejects slightly noisy measurements."""
        sig = SignatureGenerator.generate(
            signer_id="Alice",
            message="Test Strict Threshold",
            measurement_basis="Z"
        )
        # Set max_error_rate to 0.05, and inject 0.15 noise
        strict = SecurityThresholds(max_error_rate=0.05, min_agreement_rate=0.95)
        res = SignatureVerifier.verify(
            signature=sig,
            claimed_message=sig.message,
            claimed_signer_id="Alice",
            shots=1000,
            bit_flip_prob=0.15,
            custom_thresholds=strict,
            seed=42
        )
        self.assertEqual(res.decision, DecisionType.THREAT_DETECTED)


if __name__ == "__main__":
    unittest.main()
