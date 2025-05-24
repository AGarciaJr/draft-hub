import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface ScoringData {
  name: string;
  playerId: number;
  twoPointMakes: number;
  threePointMakes: number;
  freeThrowMakes: number;
}

const ScoringDistributionChart: React.FC<{ data: ScoringData[] }> = ({ data }) => {
  const navigate = useNavigate();

  const handleBarClick = (data: ScoringData) => {
    navigate(`/profiles/${data.playerId}`);
  };

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 40, bottom: 20, left: 80 }}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis type="number" tick={{ fill: '#333', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" tick={{ fill: '#333', fontSize: 14, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip
          cursor={{ fill: '#f5f5f5' }}
          contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }}
        />
        <Bar dataKey="twoPointMakes" stackId="a" fill="#1976d2" radius={[4, 4, 4, 4]} name="2PT Makes">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
          ))}
        </Bar>
        <Bar dataKey="threePointMakes" stackId="a" fill="#2e7d32" radius={[4, 4, 4, 4]} name="3PT Makes">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
          ))}
        </Bar>
        <Bar dataKey="freeThrowMakes" stackId="a" fill="#ed6c02" radius={[4, 4, 4, 4]} name="FT Makes">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoringDistributionChart;