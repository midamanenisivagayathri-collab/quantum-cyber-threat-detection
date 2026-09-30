"""Tests for FastAPI endpoints."""

import unittest
from fastapi.testclient import TestClient
from backend.main import app


class TestAPIEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_20_health_endpoint(self):
        """Test /api/health returns operational status and ML-free assurance."""
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "operational")
        self.assertFalse(data["ml_used"])

    def test_21_signature_generation_and_verification_api(self):
        """Test end-to-end API generation and verification workflow."""
        gen_payload = {
            "signer_id": "Alice",
            "message": "API Test Command Block #42",
            "measurement_basis": "Z"
        }
        gen_resp = self.client.post("/api/signature/generate", json=gen_payload)
        self.assertEqual(gen_resp.status_code, 200)
        sig = gen_resp.json()
        self.assertIn("signature_id", sig)

        # Verify legitimate API call
        verify_payload = {
            "signature_id": sig["signature_id"],
            "claimed_message": "API Test Command Block #42",
            "claimed_signer_id": "Alice",
            "shots": 1000
        }
        ver_resp = self.client.post("/api/signature/verify", json=verify_payload)
        self.assertEqual(ver_resp.status_code, 200)
        ver_data = ver_resp.json()
        self.assertEqual(ver_data["decision"], "VALID_SIGNATURE")

    def test_22_attack_simulation_api(self):
        """Test /api/attack/simulate endpoint detects forgery."""
        attack_payload = {
            "attack_type": "FORGERY",
            "tampered_message": "Unauthorized Tampered Transaction"
        }
        resp = self.client.post("/api/attack/simulate", json=attack_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["attack_type"], "FORGERY")
        self.assertEqual(data["verification_result"]["decision"], "THREAT_DETECTED")

    def test_23_security_statistics_api(self):
        """Test /api/statistics endpoint returns live computed numbers."""
        resp = self.client.get("/api/statistics")
        self.assertEqual(resp.status_code, 200)
        stats = resp.json()
        self.assertIn("signatures_verified", stats)
        self.assertIn("threats_detected", stats)
        self.assertIn("audit_chain_valid", stats)


if __name__ == "__main__":
    unittest.main()
