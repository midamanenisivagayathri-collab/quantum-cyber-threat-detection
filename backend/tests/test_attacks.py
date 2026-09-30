"""Tests for cyber attack simulation vectors."""

import unittest
from backend.signature.generator import SignatureGenerator
from backend.verification.verifier import SignatureVerifier
from backend.attacks.forgery import ForgerySimulator
from backend.attacks.impersonation import ImpersonationSimulator
from backend.attacks.replay import ReplaySimulator
from backend.attacks.channel import ChannelAttackSimulator
from backend.attacks.unauthorized import UnauthorizedVerificationSimulator


class TestAttacks(unittest.TestCase):

    def setUp(self):
        SignatureVerifier.reset_replay_cache()

    def test_11_forgery_attack_detection(self):
        """Test detection of message tampering forgery."""
        sig = SignatureGenerator.generate("Alice", "Auth: Valid Command", "Z")
        out = ForgerySimulator.simulate(sig, tampered_message="Auth: Malicious Overwrite")
        self.assertEqual(out["verification_result"]["decision"], "THREAT_DETECTED")
        self.assertEqual(out["verification_result"]["threat_type"], "FORGERY")

    def test_12_impersonation_attack_detection(self):
        """Test rejection of unauthorized signer."""
        sig = SignatureGenerator.generate("Alice", "Auth: Valid Command", "Z")
        out = ImpersonationSimulator.simulate(sig, attacker_id="Eve_Attacker")
        self.assertEqual(out["verification_result"]["decision"], "THREAT_DETECTED")
        self.assertEqual(out["verification_result"]["threat_type"], "IMPERSONATION")

    def test_13_replay_attack_detection(self):
        """Test that first attempt is valid and second replayed attempt is rejected."""
        sig = SignatureGenerator.generate("Alice", "Token #99 Replay Test", "Z")
        out = ReplaySimulator.simulate(sig)
        self.assertEqual(out["first_attempt"]["decision"], "VALID_SIGNATURE")
        self.assertEqual(out["second_attempt"]["decision"], "THREAT_DETECTED")
        self.assertEqual(out["second_attempt"]["threat_type"], "REPLAY")

    def test_14_quantum_channel_manipulation_detection(self):
        """Test that 35% channel disturbance breaches error threshold."""
        sig = SignatureGenerator.generate("Alice", "Telemetry Data", "Z")
        out = ChannelAttackSimulator.simulate(sig, intensity=0.35, shots=1000, seed=42)
        v = out["verification_result"]
        self.assertEqual(v["decision"], "THREAT_DETECTED")
        self.assertGreater(v["error_rate"], 0.10)

    def test_15_unauthorized_verification_lockout(self):
        """Test rate limiting locks out attempts exceeding max verification attempts."""
        sig = SignatureGenerator.generate("Alice", "Lockout Probe Test", "Z")
        out = UnauthorizedVerificationSimulator.simulate(sig, total_attempts=5)
        self.assertIsNotNone(out["lockout_triggered_at_attempt"])
        last_attempt = out["attempts_history"][-1]
        self.assertEqual(last_attempt["threat_type"], "UNAUTHORIZED_VERIFICATION")


if __name__ == "__main__":
    unittest.main()
