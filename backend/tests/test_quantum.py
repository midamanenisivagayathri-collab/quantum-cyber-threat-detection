"""Tests for quantum simulation: qubits, Pauli operators, eigenstates, Bell states, and teleportation."""

import unittest
import numpy as np
from backend.quantum.qubit import Qubit
from backend.quantum.pauli import PauliMatrices, PAULI_X, PAULI_Y, PAULI_Z
from backend.quantum.eigenstates import Eigenstates, BasisType
from backend.quantum.bell_state import BellState, BellStateType
from backend.quantum.teleportation import QuantumTeleportation
from backend.quantum.measurement import ProjectiveMeasurement


class TestQuantumSimulation(unittest.TestCase):

    def test_01_basis_states_and_qubit_normalization(self):
        """Test basis state representation and normalization."""
        q0 = Eigenstates.get_state("|0>")
        self.assertAlmostEqual(abs(q0.alpha), 1.0)
        self.assertAlmostEqual(abs(q0.beta), 0.0)

        q1 = Eigenstates.get_state("|1>")
        self.assertAlmostEqual(abs(q1.alpha), 0.0)
        self.assertAlmostEqual(abs(q1.beta), 1.0)

        # Bloch angles
        th0, ph0 = q0.bloch_angles()
        self.assertAlmostEqual(th0, 0.0)

        th1, ph1 = q1.bloch_angles()
        self.assertAlmostEqual(th1, np.pi)

    def test_02_pauli_operators_properties(self):
        """Test Pauli matrices unitarity and eigenvalues."""
        for name in ["X", "Y", "Z", "I"]:
            details = PauliMatrices.get_details(name)
            self.assertTrue(details["is_unitary"])
            self.assertTrue(details["is_hermitian"])

        # Test X|0> = |1>
        q0 = Eigenstates.get_state("|0>")
        q_flipped = q0.apply_gate(PAULI_X)
        self.assertAlmostEqual(abs(q_flipped.beta), 1.0)

    def test_03_pauli_eigenstates_probabilities(self):
        """Test theoretical measurement probabilities across bases."""
        q_plus = Eigenstates.get_state("|+>")
        # Measurement of |+> in X basis must yield |+> with 100% probability
        probs_x = Eigenstates.theoretical_probabilities(q_plus, BasisType.X)
        self.assertAlmostEqual(probs_x["|+⟩"], 1.0)
        self.assertAlmostEqual(probs_x["|-⟩"], 0.0)

        # Measurement of |+> in Z basis must yield 50/50
        probs_z = Eigenstates.theoretical_probabilities(q_plus, BasisType.Z)
        self.assertAlmostEqual(probs_z["|0⟩"], 0.5)
        self.assertAlmostEqual(probs_z["|1⟩"], 0.5)

    def test_04_bell_state_entanglement(self):
        """Test Bell state entanglement entropy and correlation."""
        bell = BellState(BellStateType.PHI_PLUS)
        self.assertEqual(bell.concurrence(), 1.0)
        self.assertAlmostEqual(bell.entanglement_entropy(), 1.0)

        # In |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, probabilities of 01 and 10 must be 0
        probs = bell.theoretical_probabilities()
        self.assertAlmostEqual(probs["00"], 0.5)
        self.assertAlmostEqual(probs["11"], 0.5)
        self.assertAlmostEqual(probs["01"], 0.0)
        self.assertAlmostEqual(probs["10"], 0.0)

    def test_05_quantum_teleportation_fidelity(self):
        """Test teleportation protocol recovers original state with unit fidelity."""
        # Arbitrary qubit
        q_orig = Qubit.from_bloch_angles(theta=np.pi / 3.0, phi=np.pi / 4.0)
        result = QuantumTeleportation.simulate(
            input_qubit=q_orig,
            measurement_basis="Z",
            shots=1000,
            bit_flip_prob=0.0,
            seed=42
        )
        self.assertTrue(result.success)
        self.assertGreaterEqual(result.fidelity, 0.999)
        self.assertEqual(len(result.steps), 8)


if __name__ == "__main__":
    unittest.main()
