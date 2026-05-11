'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { scoreToPercentage } from '@/lib/csv-utils';

interface ScoresBarChartProps {
  data: { name: string; average: number }[];
  title: string;
  description?: string;
  className?: string;
  maxItems?: number;
  showAverage?: boolean;
}

// Couleurs de l'application
const PRIMARY_COLOR = '#5B4FE5';
const PRIMARY_COLOR_LIGHT = '#7C73E8';
const SUCCESS_COLOR = '#22C55E';
const SUCCESS_COLOR_LIGHT = '#4ADE80';
const WARNING_COLOR = '#F59E0B';
const WARNING_COLOR_LIGHT = '#FBBF24';
const DESTRUCTIVE_COLOR = '#EF4444';
const DESTRUCTIVE_COLOR_LIGHT = '#F87171';

export function ScoresBarChart({ 
  data, 
  title, 
  description, 
  className,
  maxItems = 10,
  showAverage = true,
}: ScoresBarChartProps) {
  const chartData = data.slice(0, maxItems).map(item => ({
    ...item,
    percentage: scoreToPercentage(item.average),
  }));

  const globalAverage = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.percentage, 0) / chartData.length)
    : 0;

  const getBarColors = (percentage: number) => {
    if (percentage >= 87.5) return { main: SUCCESS_COLOR, light: SUCCESS_COLOR_LIGHT };
    if (percentage >= 62.5) return { main: PRIMARY_COLOR, light: PRIMARY_COLOR_LIGHT };
    if (percentage >= 37.5) return { main: WARNING_COLOR, light: WARNING_COLOR_LIGHT };
    return { main: DESTRUCTIVE_COLOR, light: DESTRUCTIVE_COLOR_LIGHT };
  };

  return (
    <div className={className}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              {chartData.map((entry, index) => {
                const colors = getBarColors(entry.percentage);
                return (
                  <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={colors.main} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors.light} stopOpacity={0.8} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--color-border)" 
              horizontal={false}
              vertical={true}
            />
            <XAxis 
              type="number" 
              domain={[0, 100]}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name"
              tick={{ fill: 'var(--color-foreground)', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            {showAverage && globalAverage > 0 && (
              <ReferenceLine 
                x={globalAverage} 
                stroke={PRIMARY_COLOR}
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Moy: ${globalAverage}%`,
                  position: 'top',
                  fill: PRIMARY_COLOR,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '13px',
                padding: '12px 16px',
                boxShadow: '0 10px 40px -10px rgba(91, 79, 229, 0.3)',
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
              cursor={{ fill: 'rgba(91, 79, 229, 0.1)' }}
            />
            <Bar 
              dataKey="percentage" 
              radius={[0, 8, 8, 0]}
              maxBarSize={28}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#barGradient-${index})`}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
