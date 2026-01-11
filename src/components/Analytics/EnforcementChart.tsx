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
    <div className="bg-background border-2 border-accent-dim p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-[10px] tracking-wider glow-text">[{title}]</span>
        <span className="text-accent-muted text-[8px] tracking-wider">{subtitle}</span>
      </div>
      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a1a" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#33FF00', fontSize: 8, fontFamily: 'var(--font-terminal)' }}
              tickLine={{ stroke: '#33FF00' }}
              axisLine={{ stroke: '#33FF00' }}
            />
            <YAxis
              tick={{ fill: '#33FF00', fontSize: 8, fontFamily: 'var(--font-terminal)' }}
              tickLine={{ stroke: '#33FF00' }}
              axisLine={{ stroke: '#33FF00' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#000000',
                border: '2px solid #33FF00',
                borderRadius: 0,
                fontSize: 8,
                fontFamily: 'var(--font-terminal)',
              }}
              labelStyle={{ color: '#33FF00' }}
              itemStyle={{ color: '#33FF00' }}
              formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
            />
            <Legend
              wrapperStyle={{ fontSize: 8, fontFamily: 'var(--font-terminal)' }}
              iconType="line"
            />
            <Line
              type="stepAfter"
              dataKey="deportations"
              stroke="#FF3333"
              strokeWidth={2}
              dot={{ fill: '#FF3333', r: 2, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: '#FF3333', strokeWidth: 0 }}
              name="DEPORTATIONS"
            />
            <Line
              type="stepAfter"
              dataKey="arrests"
              stroke="#FFAA00"
              strokeWidth={2}
              dot={{ fill: '#FFAA00', r: 2, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: '#FFAA00', strokeWidth: 0 }}
              name="ARRESTS"
            />
            <Line
              type="stepAfter"
              dataKey="detentions"
              stroke="#33FF00"
              strokeWidth={2}
              dot={{ fill: '#33FF00', r: 2, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: '#33FF00', strokeWidth: 0 }}
              name="AVG DAILY DETENTIONS"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
