'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyEnforcementData } from '@/types/analytics';

interface EnforcementChartProps {
  data: MonthlyEnforcementData[];
  title?: string;
  subtitle?: string;
}

export default function EnforcementChart({ data, title = 'TRENDS', subtitle = 'MONTHLY ENFORCEMENT DATA' }: EnforcementChartProps) {
  return (
    <div className="bg-black/50 border border-accent-dim/30 p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-xs">[{title}]</span>
        <span className="text-accent-dim text-xs">{subtitle}</span>
      </div>
      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#00aa00', fontSize: 10 }}
              tickLine={{ stroke: '#00aa00' }}
              axisLine={{ stroke: '#00aa00' }}
            />
            <YAxis
              tick={{ fill: '#00aa00', fontSize: 10 }}
              tickLine={{ stroke: '#00aa00' }}
              axisLine={{ stroke: '#00aa00' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #00aa00',
                borderRadius: 0,
                fontSize: 11,
              }}
              labelStyle={{ color: '#00ff00' }}
              itemStyle={{ color: '#00ff00' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10 }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="deportations"
              stroke="#ff3333"
              strokeWidth={2}
              dot={{ fill: '#ff3333', r: 2 }}
              activeDot={{ r: 4, fill: '#ff3333' }}
              name="Deportations"
            />
            <Line
              type="monotone"
              dataKey="arrests"
              stroke="#ffaa00"
              strokeWidth={2}
              dot={{ fill: '#ffaa00', r: 2 }}
              activeDot={{ r: 4, fill: '#ffaa00' }}
              name="Arrests"
            />
            <Line
              type="monotone"
              dataKey="detentions"
              stroke="#00ff00"
              strokeWidth={2}
              dot={{ fill: '#00ff00', r: 2 }}
              activeDot={{ r: 4, fill: '#00ff00' }}
              name="Avg Daily Detentions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
