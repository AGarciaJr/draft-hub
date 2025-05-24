import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface EfficiencyData {
  name: string;
  playerId: number;
  eFG: number;  // Effective Field Goal %
  TS: number;   // True Shooting %
  FG: number;   // Field Goal %
}

const EfficiencyChart: React.FC<{ data: EfficiencyData[] }> = ({ data }) => {
  const navigate = useNavigate();

  const handleBarClick = (data: EfficiencyData) => {
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
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#333', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" tick={{ fill: '#333', fontSize: 14, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip 
          cursor={{ fill: '#f5f5f5' }} 
          contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }} 
          formatter={(value: number) => [`${value}%`, '']} 
        />
        <Bar dataKey="eFG" fill="#1565c0" radius={[4, 4, 4, 4]} name="eFG%">
            {data.map((entry, index) => (
                <Cell key={`cell-eFG-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
            ))}
        </Bar>
        <Bar dataKey="TS" fill="#0d47a1" radius={[4, 4, 4, 4]} name="TS%">
            {data.map((entry, index) => (
                <Cell key={`cell-TS-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
            ))}
        </Bar>
        <Bar dataKey="FG" fill="#64b5f6" radius={[4, 4, 4, 4]} name="FG%">
            {data.map((entry, index) => (
                <Cell key={`cell-FG-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
            ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
};

export default EfficiencyChart; 