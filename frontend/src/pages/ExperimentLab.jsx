import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  Sliders,
  Download,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  Settings
} from 'lucide-react';
import { api } from '../services/api';
import AttackChart from '../charts/AttackChart';

export default function ExperimentLab() {
  // Experiment inputs
  const [experimentMode, setExperimentMode] = useState('MULTI_TRIAL'); // BASELINE, MULTI_TRIAL, WHAT_IF, ATTACK_COMPARISON
  const [shots, setShots] = useState(1000);
  const [basis, setBasis] = useState('Z');
  const [attackType, setAttackType] = useState('QUANTUM_CHANNEL_MANIPULATION');
  const [intensity, setIntensity] = useState(0.20);
  const [numTrials, setNumTrials] = useState(10);
  const [seed, setSeed] = useState(42);

  // Threshold tuning inputs
  const [maxErrorRate, setMaxErrorRate] = useState(0.10);
  const [minAgreementRate, setMinAgreementRate] = useState(0.90);
  const [replayWindow, setReplayWindow] = useState(300);
  const [maxAttempts, setMaxAttempts] = useState(3);

  // Results
  const [experimentResult, setExperimentResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isUpdatingThresholds, setIsUpdatingThresholds] = useState(false);
  const [thresholdMessage, setThresholdMessage] = useState(null);

  useEffect(() => {
    api.getThresholds().then(t => {
      setMaxErrorRate(t.max_error_rate);
      setMinAgreementRate(t.min_agreement_rate);
      setReplayWindow(t.replay_time_window_seconds);
      setMaxAttempts(t.max_verification_attempts);
    }).catch(console.error);
  }, []);

  const handleUpdateThresholds = async () => {
    try {
      setIsUpdatingThresholds(true);
      await api.updateThresholds({
        max_error_rate: Number(maxErrorRate),
        min_agreement_rate: Number(minAgreementRate),
        replay_time_window_seconds: Number(replayWindow),
        max_verification_attempts: Number(maxAttempts)
      });
      setThresholdMessage('Verification thresholds updated deterministically.');
      setTimeout(() => setThresholdMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingThresholds(false);
    }
  };

  const handleRunExperiment = async () => {
    try {
      setIsRunning(true);
      const res = await api.runExperiment({
        mode: experimentMode,
        attack_type: attackType,
        intensity: Number(intensity),
        shots: Number(shots),
        num_trials: Number(numTrials),
        basis: basis,
        threshold_max_error: Number(maxErrorRate),
        seed: Number(seed)
      });
      setExperimentResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportJSON = () => {
    if (!experimentResult) return;
    const blob = new Blob([JSON.stringify(experimentResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qds_experiment_${experimentMode.toLowerCase()}_seed${seed}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Scientific Experimentation & Parameter Tuning Lab
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
          Configure reproducible stochastic quantum experiments with fixed random seeds and tune deterministic decision thresholds.
        </p>
      </div>

      {/* Threshold Tuning Box */}
      <div className="q-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div className="q-card-title" style={{ marginBottom: 0 }}>
            <Settings size={18} color="#06b6d4" />
            <span>Deterministic Threshold Tuning (No Machine Learning)</span>
          </div>
          {thresholdMessage && (
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>{thresholdMessage}</span>
          )}
        </div>
        <div className="q-card-subtitle">
          Dynamically alter verification decision boundaries to evaluate sensitivity, False Acceptance Rates, and tolerance.
        </div>

        <div className="grid-4" style={{ marginTop: '14px' }}>
          <div className="form-group">
            <label className="form-label">Max Allowable Error Rate: {(maxErrorRate * 100).toFixed(1)}%</label>
            <input
              type="range" min="0.01" max="0.30" step="0.01" value={maxErrorRate}
              onChange={(e) => setMaxErrorRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#06b6d4' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Min Agreement Rate: {(minAgreementRate * 100).toFixed(1)}%</label>
            <input
              type="range" min="0.70" max="0.99" step="0.01" value={minAgreementRate}
              onChange={(e) => setMinAgreementRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Replay Time Window</label>
            <input
              type="number" className="q-input" value={replayWindow}
              onChange={(e) => setReplayWindow(Number(e.target.value))}
              placeholder="Seconds (e.g. 300)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Max Probing Attempts</label>
            <input
              type="number" className="q-input" value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
              placeholder="Attempts (e.g. 3)"
            />
          </div>
        </div>

        <button
          onClick={handleUpdateThresholds}
          disabled={isUpdatingThresholds}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem' }}
        >
          {isUpdatingThresholds ? 'Saving...' : 'Apply Threshold Updates'}
        </button>
      </div>

      {/* Experiment Setup Card */}
      <div className="q-card" style={{ marginBottom: '24px' }}>
        <div className="q-card-title">
          <FlaskConical size={18} color="#8b5cf6" />
          <span>Experiment Protocol & Random Seed Configuration</span>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Experiment Protocol Mode</label>
            <select
              className="q-select"
              value={experimentMode}
              onChange={(e) => setExperimentMode(e.target.value)}
            >
              <option value="MULTI_TRIAL">1. Multi-Trial Statistical Runner (N Trials)</option>
              <option value="BASELINE">2. Legitimate Control Baseline (Zero Noise)</option>
              <option value="WHAT_IF">3. What-If Intensity Sweep (0% to 50%)</option>
              <option value="ATTACK_COMPARISON">4. Full Multi-Vector Benchmark</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reproducible Random Seed</label>
            <input
              type="number"
              className="q-input"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              placeholder="e.g. 42"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Measurement Shots (N)</label>
            <select
              className="q-select"
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
            >
              <option value={100}>100 Shots</option>
              <option value={500}>500 Shots</option>
              <option value={1000}>1,000 Shots (Standard)</option>
              <option value={5000}>5,000 Shots</option>
              <option value={10000}>10,000 Shots</option>
            </select>
          </div>
        </div>

        {experimentMode === 'MULTI_TRIAL' && (
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Number of Repeated Trials</label>
              <input
                type="number" className="q-input" min="1" max="50" value={numTrials}
                onChange={(e) => setNumTrials(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attack Type</label>
              <select
                className="q-select"
                value={attackType}
                onChange={(e) => setAttackType(e.target.value)}
              >
                <option value="NONE">None (Legitimate Baseline)</option>
                <option value="QUANTUM_CHANNEL_MANIPULATION">Quantum Channel Manipulation</option>
                <option value="FORGERY">Digital Forgery</option>
                <option value="IMPERSONATION">Signer Impersonation</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Attack Intensity: {(intensity * 100).toFixed(0)}%</label>
              <input
                type="range" min="0" max="0.5" step="0.05" value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6', marginTop: '8px' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button
            onClick={handleRunExperiment}
            disabled={isRunning}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <Play size={16} />
            {isRunning ? 'Running Experiment...' : 'EXECUTE EXPERIMENT PROTOCOL'}
          </button>

          {experimentResult && (
            <button
              onClick={handleExportJSON}
              className="btn btn-secondary"
            >
              <Download size={16} />
              Export Data (JSON)
            </button>
          )}
        </div>
      </div>

      {/* Experiment Results Display */}
      {experimentResult && (
        <div>
          {/* Summary Box */}
          {experimentResult.average_error_rate !== undefined && (
            <div className="grid-4" style={{ marginBottom: '20px' }}>
              <div className="q-card">
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Detection Rate</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {(experimentResult.detection_rate * 100).toFixed(1)}%
                </div>
              </div>
              <div className="q-card">
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avg Error Rate</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                  {(experimentResult.average_error_rate * 100).toFixed(2)}%
                </div>
              </div>
              <div className="q-card">
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avg Agreement Rate</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {(experimentResult.average_agreement_rate * 100).toFixed(2)}%
                </div>
              </div>
              <div className="q-card">
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avg Statistical Dist (TVD)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                  {experimentResult.average_tvd?.toFixed(4)}
                </div>
              </div>
            </div>
          )}

          {/* Trials Table */}
          {experimentResult.trials && (
            <div className="q-card">
              <div className="q-card-title">
                <span>Multi-Trial Experimental Results (Seed: {experimentResult.seed})</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="q-table">
                  <thead>
                    <tr>
                      <th>Trial #</th>
                      <th>Attack Vector</th>
                      <th>Intensity</th>
                      <th>Error Rate</th>
                      <th>Agreement</th>
                      <th>Statistical Dist</th>
                      <th>Decision</th>
                      <th>Trial Seed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experimentResult.trials.map((tr) => (
                      <tr key={tr.trial}>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>#{tr.trial}</td>
                        <td>{tr.attack}</td>
                        <td>{(tr.intensity * 100).toFixed(0)}%</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: tr.error_rate > 0.10 ? '#f87171' : '#f1f5f9' }}>
                          {(tr.error_rate * 100).toFixed(2)}%
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: tr.agreement_rate >= 0.90 ? '#34d399' : '#f87171' }}>
                          {(tr.agreement_rate * 100).toFixed(2)}%
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{tr.statistical_distance.toFixed(4)}</td>
                        <td>
                          <span style={{
                            padding: '3px 8px', borderRadius: '4px',
                            background: tr.decision === 'VALID_SIGNATURE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: tr.decision === 'VALID_SIGNATURE' ? '#34d399' : '#f87171',
                            fontSize: '0.72rem', fontWeight: 700
                          }}>
                            {tr.decision}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>{tr.trial_seed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* What-If Sensitivity Chart */}
          {experimentResult.curve_data && (
            <div className="q-card">
              <AttackChart data={experimentResult.curve_data} maxErrorThreshold={maxErrorRate} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
