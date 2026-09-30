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

export default function SecurityChart({ data, title = "Attack Vectors Comparison (Error Rate & Statistical Distance)" }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        No comparison data available. Run attack comparison.
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
          <XAxis dataKey="vector" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 1.0]} />
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
          <Bar dataKey="error_rate" name="Error Rate" fill="#f87171" radius={[4, 4, 0, 0]} />
          <Bar dataKey="statistical_distance" name="Statistical Dist (TVD)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="agreement_rate" name="Agreement Rate" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
