import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface DefensiveData {
  name: string;
  playerId: number;
  blocks: number;
  steals: number;
  defRebounds: number;
}

const DefensiveImpactChart: React.FC<{ data: DefensiveData[] }> = ({ data }) => {
  const navigate = useNavigate();

  const handleBarClick = (data: DefensiveData) => {
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
        <Bar dataKey="blocks" fill="#1565c0" radius={[4, 4, 4, 4]} name="Blocks">
            {data.map((entry, index) => (
                <Cell key={`cell-blocks-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
            ))}
        </Bar>
        <Bar dataKey="steals" fill="#0d47a1" radius={[4, 4, 4, 4]} name="Steals">
            {data.map((entry, index) => (
                <Cell key={`cell-steals-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
            ))}
        </Bar>
        <Bar dataKey="defRebounds" fill="#64b5f6" radius={[4, 4, 4, 4]} name="Def Rebounds">
            {data.map((entry, index) => (
                <Cell key={`cell-rebounds-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
            ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
};

export default DefensiveImpactChart; 