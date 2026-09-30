/**
 * API service connecting React to FastAPI backend.
 */

const API_BASE = 'http://localhost:8000';

async function handleResponse(res) {
  if (!res.ok) {
    let errMessage = `HTTP error ${res.status}`;
    try {
      const errJson = await res.json();
      errMessage = errJson.detail || errMessage;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }
  return res.json();
}

export const api = {
  // Health
  getHealth: () => fetch(`${API_BASE}/api/health`).then(handleResponse),

  // Statistics
  getStatistics: () => fetch(`${API_BASE}/api/statistics`).then(handleResponse),

  // Signature
  generateSignature: (data) =>
    fetch(`${API_BASE}/api/signature/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  verifySignature: (data) =>
    fetch(`${API_BASE}/api/signature/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  getSignature: (sigId) => fetch(`${API_BASE}/api/signature/${sigId}`).then(handleResponse),

  // Attack
  getAttackTypes: () => fetch(`${API_BASE}/api/attack/types`).then(handleResponse),

  simulateAttack: (data) =>
    fetch(`${API_BASE}/api/attack/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Quantum
  getPauliMatrices: () => fetch(`${API_BASE}/api/quantum/pauli`).then(handleResponse),
  getEigenstates: () => fetch(`${API_BASE}/api/quantum/eigenstates`).then(handleResponse),
  getBellStates: () => fetch(`${API_BASE}/api/quantum/bell-states`).then(handleResponse),

  simulateTeleportation: (data) =>
    fetch(`${API_BASE}/api/quantum/teleportation/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  runMeasurement: (data) =>
    fetch(`${API_BASE}/api/quantum/measurement/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Experiment
  runExperiment: (data) =>
    fetch(`${API_BASE}/api/experiment/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  runFullDemo: () =>
    fetch(`${API_BASE}/api/experiment/full-demo`, {
      method: 'POST',
    }).then(handleResponse),

  runLegitimacyBenchmark: (numTrials = 10, shots = 1000, basis = 'Z') =>
    fetch(`${API_BASE}/api/experiment/legitimacy-benchmark?num_trials=${numTrials}&shots=${shots}&basis=${basis}`, {
      method: 'POST',
    }).then(handleResponse),

  // Thresholds
  getThresholds: () => fetch(`${API_BASE}/api/thresholds`).then(handleResponse),

  updateThresholds: (data) =>
    fetch(`${API_BASE}/api/thresholds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Security Logs & Audit Chain
  getSecurityLogs: (limit = 100) => fetch(`${API_BASE}/api/security/logs?limit=${limit}`).then(handleResponse),

  verifyAuditChain: () => fetch(`${API_BASE}/api/security/audit-chain/verify`).then(handleResponse),

  simulateAuditTampering: () =>
    fetch(`${API_BASE}/api/security/audit-chain/simulate-tampering`, {
      method: 'POST',
    }).then(handleResponse),
};
