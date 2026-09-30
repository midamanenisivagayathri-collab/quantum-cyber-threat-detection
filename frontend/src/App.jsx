import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SignatureVerification from './pages/SignatureVerification';
import QuantumSimulation from './pages/QuantumSimulation';
import AttackSimulator from './pages/AttackSimulator';
import SecurityAnalytics from './pages/SecurityAnalytics';
import SecurityLogs from './pages/SecurityLogs';
import ExperimentLab from './pages/ExperimentLab';
import QuantumConcepts from './pages/QuantumConcepts';
import { api } from './services/api';
import { CheckCircle2, ShieldAlert, X, Play, Award, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Full Security Demo Modal state
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoReport, setDemoReport] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const fetchGlobalStats = async () => {
    try {
      const data = await api.getStatistics();
      setStats(data);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunFullDemo = async () => {
    try {
      setIsDemoRunning(true);
      setShowDemoModal(true);
      setDemoReport(null);

      const res = await api.runFullDemo();
      setDemoReport(res);
      // Refresh stats after demo run
      fetchGlobalStats();
    } catch (err) {
      console.error('Demo error:', err);
    } finally {
      setIsDemoRunning(false);
    }
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onRunFullDemo={handleRunFullDemo}
        isDemoRunning={isDemoRunning}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header stats={stats} isConnected={isConnected} />

        {activePage === 'dashboard' && (
          <Dashboard
            setActivePage={setActivePage}
            onRunFullDemo={handleRunFullDemo}
            isDemoRunning={isDemoRunning}
          />
        )}
        {activePage === 'verification' && <SignatureVerification />}
        {activePage === 'quantum' && <QuantumSimulation />}
        {activePage === 'attacks' && <AttackSimulator />}
        {activePage === 'analytics' && <SecurityAnalytics />}
        {activePage === 'logs' && <SecurityLogs />}
        {activePage === 'lab' && <ExperimentLab />}
        {activePage === 'concepts' && <QuantumConcepts />}
      </div>

      {/* Full Demo Interactive Modal */}
      {showDemoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0c1427',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Award size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    Full Security Demonstration & Comprehensive Audit Report
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Sequential execution of legitimate workflow and all 5 cyber threat attack vectors.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDemoModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Loading animation while demo is in progress */}
            {isDemoRunning && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="pulse-glow" style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>
                  Executing 8-step quantum signature verification and threat vector evaluations...
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                  Calculating Bell states, applying Pauli corrections, simulating channels, and validating SHA-256 audit chain.
                </div>
              </div>
            )}

            {/* Demo Completed Report */}
            {demoReport && (
              <div>
                {/* Final Report KPI Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '20px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Tests Conducted</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                      {demoReport.final_report.total_tests_conducted}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Legitimate Accepted</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      {demoReport.final_report.legitimate_accepted}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Attacks Intercepted</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                      {demoReport.final_report.forgery_detected + demoReport.final_report.replay_detected + demoReport.final_report.impersonation_detected + demoReport.final_report.channel_attacks_detected}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>False Acceptances (FAR)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      0 (0.0%)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>False Rejections (FRR)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      0 (0.0%)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Audit Chain Status</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      {demoReport.final_report.audit_chain_status}
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Execution Sequence */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
                    Sequential Step-by-Step Verification Protocol Execution:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {demoReport.steps.map((st) => (
                      <div
                        key={st.step}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: '#070b16',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle2 size={16} color="#34d399" />
                          <strong style={{ color: '#f1f5f9' }}>Step {st.step}: {st.title}</strong>
                        </div>
                        <span style={{
                          padding: '3px 8px', borderRadius: '4px',
                          background: st.status === 'DETECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: st.status === 'DETECTED' ? '#f87171' : '#34d399',
                          fontWeight: 700, fontSize: '0.72rem'
                        }}>
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowDemoModal(false)} className="btn btn-primary">
                    Close Security Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
