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
  LabelList,
} from 'recharts';
import type { SectionScores } from '@/lib/types';
import { SECTION_NAMES } from '@/lib/types';
import { scoreToPercentage } from '@/lib/csv-utils';

interface SectionsBreakdownChartProps {
  data: SectionScores;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'vertical' | 'horizontal';
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

export function SectionsBreakdownChart({ 
  data, 
  title = 'Scores par section',
  description,
  className,
  variant = 'vertical',
}: SectionsBreakdownChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: SECTION_NAMES[key as keyof typeof SECTION_NAMES],
    shortName: SECTION_NAMES[key as keyof typeof SECTION_NAMES].split(' ')[0],
    score: scoreToPercentage(value),
    rawScore: value,
  }));

  const getBarColors = (percentage: number) => {
    if (percentage >= 87.5) return { main: SUCCESS_COLOR, light: SUCCESS_COLOR_LIGHT };
    if (percentage >= 62.5) return { main: PRIMARY_COLOR, light: PRIMARY_COLOR_LIGHT };
    if (percentage >= 37.5) return { main: WARNING_COLOR, light: WARNING_COLOR_LIGHT };
    return { main: DESTRUCTIVE_COLOR, light: DESTRUCTIVE_COLOR_LIGHT };
  };

  const renderCustomLabel = (props: { x?: number; y?: number; width?: number; height?: number; value?: number }) => {
    const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props;
    if (variant === 'horizontal') {
      return (
        <text
          x={x + width + 8}
          y={y + height / 2}
          fill="var(--color-foreground)"
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={600}
        >
          {value}%
        </text>
      );
    }
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="var(--color-foreground)"
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
      >
        {value}%
      </text>
    );
  };

  return (
    <div className={className}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout={variant === 'horizontal' ? 'vertical' : 'horizontal'}
            margin={variant === 'horizontal' 
              ? { top: 5, right: 50, left: 10, bottom: 5 }
              : { top: 25, right: 10, left: 10, bottom: 40 }
            }
          >
            <defs>
              {chartData.map((entry, index) => {
                const colors = getBarColors(entry.score);
                return (
                  <linearGradient 
                    key={`gradient-${index}`} 
                    id={`sectionGradient-${index}`} 
                    x1="0" 
                    y1="0" 
                    x2={variant === 'horizontal' ? '1' : '0'} 
                    y2={variant === 'horizontal' ? '0' : '1'}
                  >
                    <stop offset="0%" stopColor={colors.main} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors.light} stopOpacity={0.8} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--color-border)" 
              vertical={variant === 'horizontal'}
              horizontal={variant !== 'horizontal'}
            />
            {variant === 'horizontal' ? (
              <>
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
                  dataKey="shortName"
                  tick={{ fill: 'var(--color-foreground)', fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey="shortName"
                  tick={{ fill: 'var(--color-foreground)', fontSize: 10, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={50}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
              </>
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
              labelFormatter={(label) => {
                const item = chartData.find(d => d.shortName === label);
                return item?.name || label;
              }}
              cursor={{ fill: 'rgba(91, 79, 229, 0.1)' }}
            />
            <Bar 
              dataKey="score" 
              radius={variant === 'horizontal' ? [0, 8, 8, 0] : [8, 8, 0, 0]}
              maxBarSize={variant === 'horizontal' ? 28 : 50}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#sectionGradient-${index})`}
                  className="transition-all duration-300"
                />
              ))}
              <LabelList 
                dataKey="score" 
                content={renderCustomLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
