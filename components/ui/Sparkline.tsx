import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
  data: { value: number; index: number }[];
}

export const Sparkline: React.FC<SparklineProps> = ({ data }) => {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
           <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <YAxis domain={[0, 5]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={false}
            animationDuration={500}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};