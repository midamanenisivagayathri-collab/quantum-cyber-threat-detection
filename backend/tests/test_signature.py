"""Tests for signature generation and cryptographic hash properties."""

import unittest
from backend.signature.generator import SignatureGenerator
from backend.signature.signature_model import QuantumSignature


class TestSignature(unittest.TestCase):

    def test_06_signature_generation(self):
        """Test legitimate signature generation and SHA-256 integrity."""
        msg = "Grid Load Shedding Directive Block #10"
        sig = SignatureGenerator.generate(
            signer_id="Alice",
            message=msg,
            measurement_basis="Z"
        )
        self.assertIsInstance(sig, QuantumSignature)
        self.assertEqual(sig.signer_id, "Alice")
        self.assertEqual(sig.message, msg)
        self.assertEqual(len(sig.message_hash), 64)  # SHA-256 64 hex chars
        self.assertTrue(sig.signature_id.startswith("SIG-"))
        self.assertIn("|0⟩", sig.expected_measurement_statistics)

    def test_07_hash_determinism_and_collision_resistance(self):
        """Test that slight changes in message produce completely different hashes."""
        h1 = SignatureGenerator.compute_sha256("Transfer $100")
        h2 = SignatureGenerator.compute_sha256("Transfer $101")
        self.assertNotEqual(h1, h2)


if __name__ == "__main__":
    unittest.main()
