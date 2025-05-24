import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

interface PlayerStat {
  playerId: number;
  name: string;
  PTS: number;
}

interface TopScorersChartProps {
  data: PlayerStat[];
}

const TopScorersChart: React.FC<TopScorersChartProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleBarClick = (data: PlayerStat) => {
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
        <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }} formatter={(value: number) => [`${value} PPG`, 'Points']} />
        <Bar dataKey="PTS" fill="#1976d2" radius={[4, 4, 4, 4]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} cursor="pointer" onClick={() => handleBarClick(entry)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopScorersChart;
