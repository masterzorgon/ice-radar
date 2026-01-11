'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CountryOfOriginData, AgeGroupData, ApprehensionMethodData } from '@/types/analytics';

interface CountriesChartProps {
  data: CountryOfOriginData[];
  title?: string;
  subtitle?: string;
}

export function CountriesChart({ data, title = 'ORIGIN', subtitle = 'TOP COUNTRIES' }: CountriesChartProps) {
  return (
    <div className="bg-background border-2 border-accent-dim p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-[10px] tracking-wider glow-text">[{title}]</span>
        <span className="text-accent-dim text-[8px] tracking-wider">{subtitle}</span>
      </div>
      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.slice(0, 8)}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a1a" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#33FF00', fontSize: 8, fontFamily: 'var(--font-terminal)' }}
              tickLine={{ stroke: '#33FF00' }}
              axisLine={{ stroke: '#33FF00' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
            />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fill: '#33FF00', fontSize: 8, fontFamily: 'var(--font-terminal)' }}
              tickLine={{ stroke: '#33FF00' }}
              axisLine={{ stroke: '#33FF00' }}
              width={55}
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
              formatter={(value, _name, props) => {
                const numValue = value as number;
                const payload = props.payload as CountryOfOriginData;
                return [`${numValue.toLocaleString()} (${payload.percentage}%)`, 'COUNT'];
              }}
            />
            <Bar dataKey="count" fill="#33FF00" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface AgeChartProps {
  data: AgeGroupData[];
  title?: string;
  subtitle?: string;
}

const AGE_COLORS = ['#33FF00', '#29CC00', '#1F9900', '#146600', '#0A3300'];

export function AgeChart({ data, title = 'AGE', subtitle = 'DISTRIBUTION' }: AgeChartProps) {
  return (
    <div className="bg-background border-2 border-accent-dim p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-[10px] tracking-wider glow-text">[{title}]</span>
        <span className="text-accent-dim text-[8px] tracking-wider">{subtitle}</span>
      </div>
      <div className="h-[calc(100%-2rem)] flex">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="group"
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                strokeWidth={2}
                stroke="#000000"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  border: '2px solid #33FF00',
                  borderRadius: 0,
                  fontSize: 8,
                  fontFamily: 'var(--font-terminal)',
                }}
                itemStyle={{ color: '#33FF00' }}
                labelStyle={{ color: '#33FF00' }}
                formatter={(value, _name, props) => {
                  const numValue = value as number;
                  const payload = props.payload as AgeGroupData;
                  return [`${numValue.toLocaleString()} (${payload.percentage}%)`, payload.group];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-1 text-[8px] tracking-wider pr-2">
          {data.map((item, index) => (
            <div key={item.group} className="flex items-center gap-2">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: AGE_COLORS[index % AGE_COLORS.length] }}
              />
              <span className="text-accent-dim">{item.group}</span>
              <span className="text-accent glow-text">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ApprehensionMethodChartProps {
  data: ApprehensionMethodData[];
  title?: string;
  subtitle?: string;
}

const METHOD_COLORS = ['#33FF00', '#29CC00', '#1F9900', '#146600', '#0A3300', '#051A00'];

export function ApprehensionMethodChart({ data = [], title = 'METHOD', subtitle = 'APPREHENSION TYPE' }: ApprehensionMethodChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-background border-2 border-accent-dim p-4 h-full flex items-center justify-center">
        <span className="text-accent-dim text-[8px] tracking-wider">{'>'} NO DATA AVAILABLE</span>
      </div>
    );
  }

  return (
    <div className="bg-background border-2 border-accent-dim p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-[10px] tracking-wider glow-text">[{title}]</span>
        <span className="text-accent-dim text-[8px] tracking-wider">{subtitle}</span>
      </div>
      <div className="h-[calc(100%-2rem)] flex">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                strokeWidth={2}
                stroke="#000000"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={METHOD_COLORS[index % METHOD_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  border: '2px solid #33FF00',
                  borderRadius: 0,
                  fontSize: 8,
                  fontFamily: 'var(--font-terminal)',
                }}
                itemStyle={{ color: '#33FF00' }}
                labelStyle={{ color: '#33FF00' }}
                formatter={(value, _name, props) => {
                  const numValue = value as number;
                  const payload = props.payload as ApprehensionMethodData;
                  return [`${numValue.toLocaleString()} (${payload.percentage}%)`, payload.method];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-1 text-[8px] tracking-wider pr-2">
          {data.map((item, index) => (
            <div key={item.method} className="flex items-center gap-2">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: METHOD_COLORS[index % METHOD_COLORS.length] }}
              />
              <span className="text-accent-dim whitespace-nowrap">{item.method}</span>
              <span className="text-accent glow-text">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
