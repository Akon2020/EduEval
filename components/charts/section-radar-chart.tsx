'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { SectionScores } from '@/lib/types';
import { SECTION_NAMES } from '@/lib/types';
import { scoreToPercentage } from '@/lib/csv-utils';

interface SectionRadarChartProps {
  data: SectionScores;
  title?: string;
  className?: string;
  showLegend?: boolean;
}

// Couleur principale de l'application (bleu indigo)
const PRIMARY_COLOR = '#5B4FE5';
const PRIMARY_COLOR_LIGHT = 'rgba(91, 79, 229, 0.2)';

export function SectionRadarChart({ data, title = 'Performance par section', className, showLegend = true }: SectionRadarChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    section: SECTION_NAMES[key as keyof typeof SECTION_NAMES],
    shortSection: SECTION_NAMES[key as keyof typeof SECTION_NAMES].split(' ').slice(0, 2).join(' '),
    score: scoreToPercentage(value),
    fullMark: 100,
  }));

  return (
    <div className={className}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Performance globale par dimension</p>
        </div>
      )}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="65%">
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity={0.8} />
                <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity={0.2} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <PolarGrid 
              stroke="var(--color-border)" 
              strokeDasharray="3 3"
              gridType="polygon"
            />
            <PolarAngleAxis 
              dataKey="shortSection" 
              tick={{ 
                fill: 'var(--color-foreground)', 
                fontSize: 11,
                fontWeight: 500,
              }}
              tickLine={false}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
              tickCount={5}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke={PRIMARY_COLOR}
              fill="url(#radarGradient)"
              strokeWidth={2.5}
              dot={{ 
                r: 5, 
                fill: PRIMARY_COLOR, 
                strokeWidth: 2,
                stroke: '#fff'
              }}
              activeDot={{
                r: 7,
                fill: PRIMARY_COLOR,
                stroke: '#fff',
                strokeWidth: 3,
                filter: 'url(#glow)'
              }}
            />
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
                const item = chartData.find(d => d.shortSection === label);
                return item?.section || label;
              }}
            />
            {showLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={() => <span className="text-sm text-muted-foreground">Score moyen</span>}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
