import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#06b6d4', '#a78bfa', '#fb7185'];
const DEVICE_LABELS: Record<string, string> = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
};

interface DeviceTypePieChartProps {
  breakdown: { device_type: string; visitors: number }[];
}

export default function DeviceTypePieChart({ breakdown }: DeviceTypePieChartProps) {
  const total = breakdown.reduce((sum, d) => sum + d.visitors, 0);
  const data = breakdown.map((d, i) => ({
    ...d,
    percent: total ? Math.round((d.visitors / total) * 100) : 0,
    color: COLORS[i % COLORS.length],
    label: DEVICE_LABELS[d.device_type] || d.device_type,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <h2 className="text-lg font-bold text-gray-900 mb-1 w-full">Devices</h2>
      <p className="text-sm text-gray-500 mb-4 w-full">Visitors by device type</p>
      <div className="w-full flex flex-col items-center">
        <ResponsiveContainer width={220} height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={2}
              label={false}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => value.toLocaleString()} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4">
          {data.map((entry, idx) => (
            <div key={entry.device_type} className="flex items-center gap-1 text-sm">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium text-gray-700">{entry.label}</span>
              <span className="text-gray-500">{entry.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 