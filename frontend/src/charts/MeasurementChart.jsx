import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function MeasurementChart({ data, title = "Quantum State Measurement Statistics" }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        No measurement data available. Run simulation to populate.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
        {title}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="outcome" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 1.0]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0c1427',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.8rem'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
          <Bar dataKey="expected_probability" name="Expected Theoretical P" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="observed_probability" name="Observed Empirical P" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
