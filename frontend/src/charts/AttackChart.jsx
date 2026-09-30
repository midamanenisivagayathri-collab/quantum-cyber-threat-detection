import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function AttackChart({ data, maxErrorThreshold = 0.10, title = "Attack Intensity vs Quantum Error & Agreement Rates" }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        No sensitivity data available. Run attack or what-if sweep.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
        {title}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="intensity_pct" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
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
          <ReferenceLine
            y={maxErrorThreshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: `Max Error Threshold (${(maxErrorThreshold * 100).toFixed(0)}%)`, fill: '#f87171', fontSize: 11, position: 'top' }}
          />
          <Line
            type="monotone"
            dataKey="error_rate"
            name="Error Rate (E)"
            stroke="#f87171"
            strokeWidth={3}
            dot={{ r: 5, fill: '#ef4444' }}
          />
          <Line
            type="monotone"
            dataKey="agreement_rate"
            name="Agreement Rate (A)"
            stroke="#34d399"
            strokeWidth={3}
            dot={{ r: 5, fill: '#10b981' }}
          />
          <Line
            type="monotone"
            dataKey="statistical_distance"
            name="Statistical Distance (TVD)"
            stroke="#38bdf8"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 4, fill: '#06b6d4' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
