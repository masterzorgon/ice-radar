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
    <div className="bg-black/50 border border-accent-dim/30 p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-xs">[{title}]</span>
        <span className="text-accent-dim text-xs">{subtitle}</span>
      </div>
      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.slice(0, 8)}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#00aa00', fontSize: 10 }}
              tickLine={{ stroke: '#00aa00' }}
              axisLine={{ stroke: '#00aa00' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
            />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fill: '#00aa00', fontSize: 10 }}
              tickLine={{ stroke: '#00aa00' }}
              axisLine={{ stroke: '#00aa00' }}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #00aa00',
                borderRadius: 0,
                fontSize: 11,
              }}
              labelStyle={{ color: '#00ff00' }}
              formatter={(value, _name, props) => {
                const numValue = value as number;
                const payload = props.payload as CountryOfOriginData;
                return [`${numValue.toLocaleString()} (${payload.percentage}%)`, 'Count'];
              }}
            />
            <Bar dataKey="count" fill="#00ff00" radius={[0, 2, 2, 0]} />
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

const AGE_COLORS = ['#00ff00', '#00cc00', '#009900', '#006600', '#003300'];

export function AgeChart({ data, title = 'AGE', subtitle = 'DISTRIBUTION' }: AgeChartProps) {
  return (
    <div className="bg-black/50 border border-accent-dim/30 p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-xs">[{title}]</span>
        <span className="text-accent-dim text-xs">{subtitle}</span>
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
                strokeWidth={1}
                stroke="#0a0a0a"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #00aa00',
                  borderRadius: 0,
                  fontSize: 11,
                }}
                itemStyle={{ color: '#00ff00' }}
                labelStyle={{ color: '#00ff00' }}
                formatter={(value, _name, props) => {
                  const numValue = value as number;
                  const payload = props.payload as AgeGroupData;
                  return [`${numValue.toLocaleString()} (${payload.percentage}%)`, payload.group];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-1 text-[10px] pr-2">
          {data.map((item, index) => (
            <div key={item.group} className="flex items-center gap-2">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: AGE_COLORS[index % AGE_COLORS.length] }}
              />
              <span className="text-foreground/70">{item.group}</span>
              <span className="text-accent">{item.percentage}%</span>
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

const METHOD_COLORS = ['#00ff00', '#00cc00', '#009900', '#006600', '#003300', '#001a00'];

export function ApprehensionMethodChart({ data = [], title = 'METHOD', subtitle = 'APPREHENSION TYPE' }: ApprehensionMethodChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-black/50 border border-accent-dim/30 p-4 h-full flex items-center justify-center">
        <span className="text-accent-dim text-xs">NO DATA AVAILABLE</span>
      </div>
    );
  }

  return (
    <div className="bg-black/50 border border-accent-dim/30 p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-xs">[{title}]</span>
        <span className="text-accent-dim text-xs">{subtitle}</span>
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
                strokeWidth={1}
                stroke="#0a0a0a"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={METHOD_COLORS[index % METHOD_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #00aa00',
                  borderRadius: 0,
                  fontSize: 11,
                }}
                itemStyle={{ color: '#00ff00' }}
                labelStyle={{ color: '#00ff00' }}
                formatter={(value, _name, props) => {
                  const numValue = value as number;
                  const payload = props.payload as ApprehensionMethodData;
                  return [`${numValue.toLocaleString()} (${payload.percentage}%)`, payload.method];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-1 text-[10px] pr-2">
          {data.map((item, index) => (
            <div key={item.method} className="flex items-center gap-2">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: METHOD_COLORS[index % METHOD_COLORS.length] }}
              />
              <span className="text-foreground/70 whitespace-nowrap">{item.method}</span>
              <span className="text-accent">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
