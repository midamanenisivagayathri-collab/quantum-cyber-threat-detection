# Quantum Mathematical Model & Simulation Engine

## 1. Mathematical Formalism

### Basis States and Qubit Representation
In our software simulation, single-qubit pure quantum states live in the two-dimensional Hilbert space $\mathcal{H}_2 \cong \mathbb{C}^2$. The computational basis orthonormal vectors are:

$$|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}, \quad |1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$$

An arbitrary pure single-qubit state $|\psi\rangle$ is represented as a complex linear combination:

$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle = \begin{pmatrix} \alpha \\ \beta \end{pmatrix}$$

satisfying the normalization condition:

$$\langle\psi|\psi\rangle = |\alpha|^2 + |\beta|^2 = 1$$

### Bloch Sphere Parametrization
Excluding an unobservable global phase factor, $|\psi\rangle$ is parametrized by polar angle $\theta \in [0, \pi]$ and azimuthal angle $\phi \in [0, 2\pi)$:

$$|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$$

The Cartesian coordinates on the unit Bloch sphere $\mathbb{S}^2$ are computed deterministically as:

$$x = 2\,\text{Re}(\alpha^* \beta) = \sin\theta\cos\phi$$
$$y = 2\,\text{Im}(\alpha^* \beta) = \sin\theta\sin\phi$$
$$z = |\alpha|^2 - |\beta|^2 = \cos\theta$$

## 2. Pauli Operators

The simulator implements the three foundational hermitian, unitary spin-1/2 operators:

$$I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}, \quad X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \quad Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}, \quad Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$$

Along with the Hadamard gate $H$:

$$H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$

## 3. Pauli Eigenstates (Mutually Unbiased Bases)

The simulation uses three mutually unbiased bases (MUB) with eigenvalues $\pm 1$:

1. **Computational Basis ($Z$-basis):**
   - $|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$ (eigenvalue $+1$)
   - $|1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$ (eigenvalue $-1$)

2. **Hadamard Basis ($X$-basis):**
   - $|+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}$ (eigenvalue $+1$)
   - $|-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix}$ (eigenvalue $-1$)

3. **Phase Basis ($Y$-basis):**
   - $|+i\rangle = \frac{|0\rangle + i|1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ i \end{pmatrix}$ (eigenvalue $+1$)
   - $|-i\rangle = \frac{|0\rangle - i|1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -i \end{pmatrix}$ (eigenvalue $-1$)

For any eigenstate $|e_i^B\rangle$ in basis $B$ and $|e_j^{B'}\rangle$ in basis $B' \neq B$:

$$|\langle e_i^B | e_j^{B'} \rangle|^2 = \frac{1}{2}$$

This property of Mutually Unbiased Bases guarantees maximum entropy upon measurement in the conjugate basis.

## 4. Bell State Entanglement

The canonical EPR pair used as the teleportation substrate is the maximally entangled Bell state:

$$|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 0 \\ 0 \\ 1 \end{pmatrix}$$

- **Concurrence:** $C(|\Phi^+\rangle) = 1.0$ (maximally entangled)
- **Reduced Density Matrix:** $\rho_A = \text{Tr}_B(|\Phi^+\rangle\langle\Phi^+|) = \frac{1}{2}I_2$
- **Von Neumann Entanglement Entropy:** $S(\rho_A) = -\text{Tr}(\rho_A \log_2 \rho_A) = 1.0\text{ bit}$

## 5. Quantum Teleportation Protocol

The standard protocol proceeds in eight discrete stages:
1. **Alice prepares input state:** $|\psi\rangle_0 = \alpha|0\rangle + \beta|1\rangle$
2. **EPR pair distributed:** Alice holds qubit 1, Bob holds qubit 2 in $|\Phi^+\rangle_{12}$
3. **Joint 3-qubit state:**
   $$|\Psi_{\text{total}}\rangle = |\psi\rangle_0 \otimes |\Phi^+\rangle_{12} = \frac{1}{2}\sum_{b_0, b_1 \in \{0, 1\}} |b_0 b_1\rangle \otimes \left(Z^{b_0} X^{b_1} |\psi\rangle\right)$$
4. **Alice's Bell-State Measurement (BSM):** Alice applies $\text{CNOT}_{01}$, then $H_0$, and measures qubits $(0, 1)$ in the computational basis, obtaining classical bits $(b_0, b_1) \in \{00, 01, 10, 11\}$ with uniform probability $1/4$.
5. **Classical Transmission:** Alice sends $(b_0, b_1)$ to Bob over the classical communication channel.
6. **Bob's Unitary Correction:** Bob applies $U = Z^{b_0} X^{b_1}$ to qubit 2:
   - $00 \implies I$
   - $01 \implies X$
   - $10 \implies Z$
   - $11 \implies ZX = -iY$
7. **State Recovery:** Bob's qubit collapses to $|\psi'\rangle = |\psi\rangle$. Under ideal channel conditions, quantum fidelity $F(|\psi\rangle, |\psi'\rangle) = |\langle\psi|\psi'\rangle|^2 = 1.0$.
8. **Projective Measurement:** Bob measures $|\psi'\rangle$ across $N$ shots in basis $B \in \{Z, X, Y\}$.

## 6. Projective Measurements and Born's Rule

For projective measurement operators $M_k = |e_k\rangle\langle e_k|$, the theoretical probability of outcome $k$ is:

$$P(k) = \text{Tr}(M_k \rho) = |\langle e_k|\psi\rangle|^2$$

Over $N$ experimental shots, empirical counts $c_k \sim \text{Multinomial}(N, [P_0, P_1])$, producing observed frequencies:

$$f_k = \frac{c_k}{N}, \quad \text{Standard Error} = \sqrt{\frac{f_k(1 - f_k)}{N}}$$

---

## 7. Information-Theoretic Security Technical Justification

### A. No-Cloning Theorem (Wootters & Zurek, 1982)
**Theorem:** There exists no unitary transformation $U$ capable of duplicating an arbitrary unknown quantum state $|\psi\rangle$.

**Proof:**
Suppose a unitary operator $U$ acts on an ancilla state $|0\rangle$ such that for any two distinct states $|\psi\rangle$ and $|\phi\rangle$:

$$U(|\psi\rangle \otimes |0\rangle) = |\psi\rangle \otimes |\psi\rangle$$
$$U(|\phi\rangle \otimes |0\rangle) = |\phi\rangle \otimes |\phi\rangle$$

Taking the inner product of both equations and using the unitary property $U^\dagger U = I$:

$$\langle\psi|\phi\rangle \langle 0|0\rangle = (\langle\psi|\langle\psi|)(|\phi\rangle|\phi\rangle) = \langle\psi|\phi\rangle^2$$

Since $\langle 0|0\rangle = 1$, we obtain:

$$\langle\psi|\phi\rangle = \langle\psi|\phi\rangle^2 \implies \langle\psi|\phi\rangle(1 - \langle\psi|\phi\rangle) = 0$$

This quadratic has only two solutions:
1. $\langle\psi|\phi\rangle = 0$ (states are strictly orthogonal)
2. $\langle\psi|\phi\rangle = 1$ (states are identical up to global phase)

**Cybersecurity Consequence for QDS:**
In classical cryptography, signature tokens (e.g. RSA or ECDSA signatures) are digital strings that can be copied infinitely without degrading the original. In contrast, an adversary Eve cannot clone Alice's signature qubit $|\psi\rangle$ to store offline and evaluate multiple forge attempts. Any attempt to measure the token collapses it, irrevocably altering the state.

### B. Heisenberg Uncertainty & Mutually Unbiased Bases (MUB)
The Pauli operators satisfy the non-commutation relation $[X, Z] = 2iY \neq 0$. By the Robertson-Schrödinger uncertainty relation:

$$\Delta X \cdot \Delta Z \ge \frac{1}{2} |\langle [X, Z] \rangle| = |\langle Y \rangle|$$

In our teleportation QDS protocol, Alice encodes signature states across three conjugate bases ($Z, X, Y$). If an active man-in-the-middle adversary (Eve) intercepts the transmission and performs an intercept-resend attack:
1. Eve must guess the basis $B \in \{Z, X, Y\}$. Probability of correct basis = $1/2$ (or $1/3$).
2. If Eve chooses incorrectly, her projective measurement projects the state into an orthogonal basis eigenstate.
3. When Bob measures the forwarded state in Alice's legitimate basis, the probability of mismatch on those shots is $1/2$.
4. Total expected error rate induced by full intercept-resend:

$$E_{\text{intercept}} = P(\text{wrong basis}) \cdot P(\text{error} \mid \text{wrong basis}) = \frac{1}{2} \times \frac{1}{2} = 0.25 \quad (25.0\%)$$

Because our security threshold $\theta_{\text{error}} = 0.10$ ($10.0\%$), an intercept-resend attack triggers an immediate, deterministic rejection ($E \ge 25\% > 10\%$).

### C. Entanglement Monogamy & Coffman-Kundu-Wootters (CKW) Bound
Classical correlations can be broadcast to multiple parties simultaneously. Quantum entanglement, however, is strictly monogamous. For any tripartite state $\rho_{ABE}$, the Coffman-Kundu-Wootters (CKW) inequality states:

$$C^2(A:B) + C^2(A:E) \le C^2(A:BE) \le 1$$

In our teleportation architecture, Alice and Bob share a maximally entangled Bell state $|\Phi^+\rangle$, for which:

$$C(A:B) = 1.0 \implies C^2(A:B) = 1.0$$

Substituting into the CKW inequality:

$$1.0 + C^2(A:E) \le 1.0 \implies C^2(A:E) \le 0 \implies C(A:E) = 0.0$$

**Cybersecurity Consequence:**
An eavesdropper Eve cannot establish any quantum entanglement or correlation with Alice's carrier without degrading Alice and Bob's entanglement ($C(A:B) < 1.0$). Any ancillary probe entanglement reduces teleportation fidelity below $1.0$, creating an immediate and observable error surge that breaches $\theta_{\text{error}}$ and $\theta_{\text{tvd}}$.

---

## 8. Total Variation Distance Metric Space Proof

The Total Variation Distance (statistical distance) between theoretical distribution $P$ and empirical distribution $Q$ over measurement alphabet $\Omega = \{0, 1\}$ is defined as:

$$\delta(P, Q) = \frac{1}{2}\sum_{x \in \Omega} |P(x) - Q(x)|$$

### Metric Axiom Verification:
1. **Non-Negativity ($\delta(P, Q) \ge 0$):**
   For all $x \in \Omega$, $|P(x) - Q(x)| \ge 0$. The sum of non-negative terms multiplied by $1/2$ is strictly non-negative: $\delta(P, Q) \ge 0$.
2. **Identity of Indiscernibles ($\delta(P, Q) = 0 \iff P = Q$):**
   $\delta(P, Q) = 0 \iff \sum_x |P(x) - Q(x)| = 0 \iff |P(x) - Q(x)| = 0 \; \forall x \iff P(x) = Q(x) \; \forall x \iff P = Q$.
3. **Symmetry ($\delta(P, Q) = \delta(Q, P)$):**
   Since $|a - b| = |b - a|$ for all real numbers:
   $$\delta(P, Q) = \frac{1}{2}\sum_x |P(x) - Q(x)| = \frac{1}{2}\sum_x |Q(x) - P(x)| = \delta(Q, P)$$
4. **Triangle Inequality ($\delta(P, R) \le \delta(P, Q) + \delta(Q, R)$):**
   For any distributions $P, Q, R$, applying the standard triangle inequality of absolute values $|P(x) - R(x)| \le |P(x) - Q(x)| + |Q(x) - R(x)|$ and summing over $x \in \Omega$:
   $$\frac{1}{2}\sum_x |P(x) - R(x)| \le \frac{1}{2}\sum_x |P(x) - Q(x)| + \frac{1}{2}\sum_x |Q(x) - R(x)| \implies \delta(P, R) \le \delta(P, Q) + \delta(Q, R)$$

### Operational Interpretation (Scheffé's Identity):
$$\delta(P, Q) = \max_{A \subseteq \Omega} |P(A) - Q(A)|$$

This gives the maximum distinguishability advantage that any statistical verifier possesses when distinguishing between genuine quantum states and an adversarial attack distribution.

---

## 9. Kullback-Leibler Divergence & Gibbs' Inequality

The relative entropy (KL divergence) from empirical distribution $Q$ to theoretical distribution $P$ is:

$$D_{KL}(P \parallel Q) = \sum_{x \in \Omega} P(x) \log_2 \frac{P(x)}{Q(x)}$$

By Gibbs' inequality / Jensen's inequality for concave functions:

$$-D_{KL}(P \parallel Q) = \sum_{x} P(x) \log_2 \frac{Q(x)}{P(x)} \le \log_2 \left( \sum_{x} P(x) \frac{Q(x)}{P(x)} \right) = \log_2\left( \sum_x Q(x) \right) = \log_2 1 = 0$$

Therefore:

$$D_{KL}(P \parallel Q) \ge 0$$

with equality if and only if $P(x) = Q(x)$ for all $x \in \Omega$.

---

## 10. Chernoff-Hoeffding Probability Upper Bound

For an adversary lacking the basis key and attempting random guessing ($p = 0.5$):

### Exact Binomial Tail Probability:
Passing the verifier requires $k \ge \lceil N \theta_{\text{agree}} \rceil$ successful matching shots out of $N$:

$$P_{\text{forgery}} = \sum_{k = \lceil N \theta_{\text{agree}} \rceil}^N \binom{N}{k} (0.5)^N$$

### Hoeffding Upper Bound:
Let $X_1, \dots, X_N \sim \text{Bernoulli}(0.5)$ and $S_N = \sum_{i=1}^N X_i$ with $\mathbb{E}[S_N] = 0.5 N$. For deviation $t = \theta_{\text{agree}} - 0.5$:

$$P\left( \frac{S_N}{N} \ge \theta_{\text{agree}} \right) \le \exp\left( -2 N (\theta_{\text{agree}} - 0.5)^2 \right)$$

For $N = 1000$ and $\theta_{\text{agree}} = 0.90$:

$$P_{\text{forgery}} \le \exp\left( -2 \times 1000 \times (0.40)^2 \right) = \exp(-320) \approx 5.3 \times 10^{-139}$$

This confirms that the forgery probability vanishes exponentially with the number of measurement shots $N$.

---

## 11. Scientific Disclaimer & Prototype Scope

**Hardware Scope:** This project is an educational and cybersecurity simulation running on classical CPU hardware. State vectors $|\psi\rangle \in \mathbb{C}^2$, density matrices $\rho \in \mathbb{C}^{2 \times 2}$, unitary gates $U \in U(2)$, and projective measurements are computed using exact complex linear algebra and pseudo-random sampling.

**Functional Equivalence:** While the software does not possess physical photons or real quantum coherence, the mathematical equations, probability distributions, statistical distance metrics, and 8 deterministic security rules implemented are mathematically identical to those used in physical quantum digital signature systems.
