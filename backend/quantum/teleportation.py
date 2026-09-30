"""Quantum Teleportation protocol simulation.

Implements the canonical teleportation scheme:
1. Input Qubit |ψ⟩ = α|0⟩ + β|1⟩
2. Bell Pair (|00⟩ + |11⟩)/√2 (Alice & Bob)
3. 3-qubit joint entangled state |ψ⟩ ⊗ |Φ⁺⟩
4. Alice's Bell Measurement (CNOT_01 followed by H_0)
5. Classical bits transmission (b0, b1)
6. Pauli correction at Bob: Z^b0 X^b1
7. Recovered state |ψ'⟩
8. Final Projective Measurement
"""

import numpy as np
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from .qubit import Qubit
from .pauli import PAULI_I, PAULI_X, PAULI_Y, PAULI_Z, HADAMARD
from .eigenstates import BasisType, Eigenstates


class TeleportationStep(BaseModel):
    step_number: int
    title: str
    description: str
    state_description: str
    equation: str
    metadata: Dict[str, Any] = {}


class TeleportationResult(BaseModel):
    success: bool
    input_qubit: Dict[str, Any]
    recovered_qubit: Dict[str, Any]
    fidelity: float
    classical_bits: str
    correction_applied: str
    steps: List[TeleportationStep]
    projective_measurement: Dict[str, Any]
    channel_noise_applied: bool = False
    noise_details: Optional[Dict[str, Any]] = None


class QuantumTeleportation:
    """Simulates teleportation with educational step-by-step trace and channel noise support."""

    @staticmethod
    def simulate(
        input_qubit: Qubit,
        measurement_basis: str = "Z",
        shots: int = 1000,
        bit_flip_prob: float = 0.0,
        phase_flip_prob: float = 0.0,
        classical_bit_tamper: bool = False,
        seed: Optional[int] = None
    ) -> TeleportationResult:
        """Executes full quantum teleportation protocol.
        
        Args:
            input_qubit: State |ψ⟩ = α|0⟩ + β|1⟩ to teleport.
            measurement_basis: Basis for final projective test ('Z', 'X', 'Y').
            shots: Projective measurement shots.
            bit_flip_prob: Probability of Pauli X noise on quantum channel.
            phase_flip_prob: Probability of Pauli Z noise on quantum channel.
            classical_bit_tamper: If true, classical bits are inverted by an attacker.
            seed: Reproducible pseudo-random seed.
        """
        rng = np.random.default_rng(seed)
        steps: List[TeleportationStep] = []

        alpha = input_qubit.alpha
        beta = input_qubit.beta

        # Step 1: Input state
        steps.append(TeleportationStep(
            step_number=1,
            title="Input Qubit Preparation",
            description="Alice prepares the quantum state |ψ⟩ to be digitally transmitted.",
            state_description=f"|ψ⟩ = ({alpha.real:.3f} + {alpha.imag:.3f}i)|0⟩ + ({beta.real:.3f} + {beta.imag:.3f}i)|1⟩",
            equation="|ψ⟩ = α|0⟩ + β|1⟩",
            metadata={"alpha": {"re": float(alpha.real), "im": float(alpha.imag)}, "beta": {"re": float(beta.real), "im": float(beta.imag)}}
        ))

        # Step 2: EPR Pair Generation
        steps.append(TeleportationStep(
            step_number=2,
            title="Bell Pair Entanglement",
            description="An Einstein-Podolsky-Rosen (EPR) entangled pair is distributed between Alice (qubit 1) and Bob (qubit 2).",
            state_description="|Φ⁺⟩₁₂ = (|00⟩ + |11⟩) / √2",
            equation="|Φ⁺⟩ = (|00⟩ + |11⟩) / √2",
            metadata={"entanglement_entropy": 1.0, "concurrence": 1.0}
        ))

        # Step 3: Joint 3-qubit state
        steps.append(TeleportationStep(
            step_number=3,
            title="Joint 3-Qubit Composite State",
            description="Composite system state before Alice's local joint measurement: |Ψ_total⟩ = |ψ⟩₀ ⊗ |Φ⁺⟩₁₂.",
            state_description="1/2 [ |00⟩(α|0⟩+β|1⟩) + |01⟩(α|1⟩+β|0⟩) + |10⟩(α|0⟩-β|1⟩) + |11⟩(α|1⟩-β|0⟩) ]",
            equation="|Ψ_total⟩ = 1/2 ∑_{b0,b1} |b₀b₁⟩ ⊗ (Z^{b₀} X^{b₁} |ψ⟩)",
            metadata={}
        ))

        # Step 4: Alice's Bell Measurement
        # In ideal teleportation, each outcome {00, 01, 10, 11} occurs with uniform probability 1/4 (25%).
        # We sample Alice's outcome:
        possible_outcomes = ["00", "01", "10", "11"]
        alice_outcome = rng.choice(possible_outcomes, p=[0.25, 0.25, 0.25, 0.25])
        b0, b1 = int(alice_outcome[0]), int(alice_outcome[1])

        steps.append(TeleportationStep(
            step_number=4,
            title="Alice's Bell-State Measurement",
            description=f"Alice applies CNOT (control: 0, target: 1), Hadamard on qubit 0, and measures both qubits in computational basis. Outcome: {alice_outcome}.",
            state_description=f"Alice measures qubit 0 = {b0}, qubit 1 = {b1}. Bob's state collapses to Z^{b0} X^{b1} |ψ⟩.",
            equation="BSM(q₀, q₁) → (b₀, b₁) ∈ {00, 01, 10, 11}",
            metadata={"measured_bits": alice_outcome, "p_outcome": 0.25}
        ))

        # Step 5: Classical Bits Transmission
        transmitted_bits = alice_outcome
        noise_applied = False
        noise_info = {}
        
        if classical_bit_tamper:
            # Attacker flips the classical bits
            transmitted_bits = "11" if alice_outcome == "00" else ("10" if alice_outcome == "01" else ("01" if alice_outcome == "10" else "00"))
            noise_applied = True
            noise_info["classical_tamper"] = f"Original: {alice_outcome} → Tampered: {transmitted_bits}"

        steps.append(TeleportationStep(
            step_number=5,
            title="Classical Channel Transmission",
            description=f"Alice transmits 2 classical bits ({transmitted_bits}) to Bob over the classical communication channel.",
            state_description=f"Received bits at Bob: {transmitted_bits}" + (" [TAMPERED IN TRANSIT!]" if classical_bit_tamper else " [Authenticated]"),
            equation="Alice ──(b₀, b₁)──> Bob",
            metadata={"received_bits": transmitted_bits, "tampered": classical_bit_tamper}
        ))

        # Step 6: Pauli Correction
        # Bob applies correction based on received bits:
        # 00 -> I
        # 01 -> X
        # 10 -> Z
        # 11 -> X then Z (which is Z @ X = -iY, or ZX)
        rec_b0, rec_b1 = int(transmitted_bits[0]), int(transmitted_bits[1])
        if rec_b0 == 0 and rec_b1 == 0:
            correction_gate_name = "I"
            correction_matrix = PAULI_I
        elif rec_b0 == 0 and rec_b1 == 1:
            correction_gate_name = "X"
            correction_matrix = PAULI_X
        elif rec_b0 == 1 and rec_b1 == 0:
            correction_gate_name = "Z"
            correction_matrix = PAULI_Z
        else: # 11
            correction_gate_name = "ZX"
            correction_matrix = PAULI_Z @ PAULI_X

        # Bob's actual collapsed state before correction (which depends on Alice's REAL outcome b0, b1):
        if b0 == 0 and b1 == 0:
            bobs_collapsed = input_qubit.state.copy()
        elif b0 == 0 and b1 == 1:
            bobs_collapsed = PAULI_X @ input_qubit.state
        elif b0 == 1 and b1 == 0:
            bobs_collapsed = PAULI_Z @ input_qubit.state
        else:
            bobs_collapsed = (PAULI_Z @ PAULI_X) @ input_qubit.state

        # Channel noise during quantum state transport (if any)
        channel_altered_state = bobs_collapsed.copy()
        if classical_bit_tamper:
            noise_applied = True
            noise_info["classical_tamper"] = True

        # Now Bob applies his unitary correction matrix:
        recovered_state_vector = correction_matrix @ channel_altered_state
        # Normalize
        recovered_norm = np.linalg.norm(recovered_state_vector)
        if recovered_norm > 1e-12:
            recovered_state_vector = recovered_state_vector / recovered_norm

        recovered_qubit = Qubit.from_vector(recovered_state_vector)

        steps.append(TeleportationStep(
            step_number=6,
            title="Pauli Unitary Correction",
            description=f"Bob applies unitary operator U = {correction_gate_name} (Z^{rec_b0} X^{rec_b1}) to undo the entanglement projection transformation.",
            state_description=f"Bob applies {correction_gate_name}. Resulting state |ψ'⟩.",
            equation=f"|ψ'⟩ = {correction_gate_name} |ψ_Bob⟩",
            metadata={"gate": correction_gate_name}
        ))

        # Step 7: State Recovery & Fidelity
        base_fidelity = float(input_qubit.fidelity_with(recovered_qubit))
        if bit_flip_prob > 0.0 or phase_flip_prob > 0.0:
            noise_applied = True
            effective_fidelity = max(0.0, base_fidelity * (1.0 - bit_flip_prob) * (1.0 - 0.5 * phase_flip_prob))
        else:
            effective_fidelity = base_fidelity
        fidelity = float(effective_fidelity)

        steps.append(TeleportationStep(
            step_number=7,
            title="State Recovery Verification",
            description=f"Quantum state reconstructed. Quantum Fidelity F(|ψ⟩, |ψ'⟩) = {fidelity:.6f}.",
            state_description=f"Recovered |ψ'⟩ with Fidelity = {fidelity * 100.0:.2f}%" + (" (State distorted by channel noise)" if fidelity < 0.999 else " (Perfect teleportation)"),
            equation="F(|ψ⟩, |ψ'⟩) = |⟨ψ|ψ'⟩|²",
            metadata={"fidelity": round(fidelity, 6)}
        ))

        # Step 8: Projective Measurement in requested basis
        basis_enum = BasisType(measurement_basis.upper())
        basis_vecs = Eigenstates.get_basis_vectors(basis_enum)
        basis_labels = Eigenstates.get_basis_labels(basis_enum)

        # Theoretical probabilities on recovered qubit:
        p0 = float(np.abs(np.vdot(basis_vecs[0], recovered_qubit.state))**2)
        p1 = float(np.abs(np.vdot(basis_vecs[1], recovered_qubit.state))**2)
        total_p = p0 + p1
        if total_p > 0:
            p0 /= total_p
            p1 /= total_p

        # Apply channel perturbation noise to the measurement probabilities across transmission shots
        if bit_flip_prob > 0.0:
            p0_noisy = (1.0 - bit_flip_prob) * p0 + bit_flip_prob * p1
            p1_noisy = (1.0 - bit_flip_prob) * p1 + bit_flip_prob * p0
            p0, p1 = p0_noisy, p1_noisy
            noise_applied = True
            noise_info["bit_flip"] = f"{bit_flip_prob*100:.1f}% rate"

        if phase_flip_prob > 0.0 and basis_enum in [BasisType.X, BasisType.Y]:
            p0_noisy = (1.0 - phase_flip_prob) * p0 + phase_flip_prob * p1
            p1_noisy = (1.0 - phase_flip_prob) * p1 + phase_flip_prob * p0
            p0, p1 = p0_noisy, p1_noisy
            noise_applied = True
            noise_info["phase_flip"] = f"{phase_flip_prob*100:.1f}% rate"

        # Empirical measurement over N shots:
        sampled_indices = rng.choice([0, 1], size=shots, p=[p0, p1])
        c0 = int(np.sum(sampled_indices == 0))
        c1 = int(np.sum(sampled_indices == 1))

        # Original theoretical probabilities:
        orig_p = Eigenstates.theoretical_probabilities(input_qubit, basis_enum)

        meas_result = {
            "basis": basis_enum.value,
            "shots": shots,
            "labels": basis_labels,
            "theoretical_probabilities": {basis_labels[0]: round(p0, 6), basis_labels[1]: round(p1, 6)},
            "empirical_counts": {basis_labels[0]: c0, basis_labels[1]: c1},
            "empirical_frequencies": {basis_labels[0]: round(c0 / shots, 6), basis_labels[1]: round(c1 / shots, 6)},
            "original_theoretical": orig_p
        }

        steps.append(TeleportationStep(
            step_number=8,
            title=f"Projective Measurement in {basis_enum.value} Basis",
            description=f"Bob measures {shots} samples in the {basis_enum.value}-basis. Counts: {basis_labels[0]}={c0}, {basis_labels[1]}={c1}.",
            state_description=f"Empirical distribution: P({basis_labels[0]})={c0/shots:.4f}, P({basis_labels[1]})={c1/shots:.4f}",
            equation=f"M_{basis_enum.value} = ∑ |e_k⟩⟨e_k|",
            metadata=meas_result
        ))

        return TeleportationResult(
            success=(fidelity >= 0.99),
            input_qubit=input_qubit.to_dict(),
            recovered_qubit=recovered_qubit.to_dict(),
            fidelity=round(fidelity, 6),
            classical_bits=alice_outcome,
            correction_applied=correction_gate_name,
            steps=steps,
            projective_measurement=meas_result,
            channel_noise_applied=noise_applied,
            noise_details=noise_info if noise_applied else None
        )
