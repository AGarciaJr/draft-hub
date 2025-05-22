import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';

export type Stat =
  | 'points'
  | 'rebounds'
  | 'fieldGoalPercentage'
  | 'assists'
  | 'blocks'
  | 'steals';

export interface PlayerEntry {
  playerName: string;
  position: string;
  team?: string;
  imageUrl?: string;
  stats: {
    [key in Stat]?: number;
  };
}

interface StatCardProps {
  stat: Stat;
  label: string;
  unit?: string;
  data: PlayerEntry[];
}

const StatCard: React.FC<StatCardProps> = ({ stat, label, unit, data }) => {
  return (
    <Card sx={{ minWidth: 275, mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        {data.map((p, i) => (
          <Box
            key={p.playerName}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1}
            borderBottom={i < data.length - 1 ? '1px solid #eee' : 'none'}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography fontWeight="bold">{i + 1}.</Typography>
              {p.imageUrl && (
                <Avatar src={p.imageUrl} alt={p.playerName} sx={{ width: 32, height: 32 }} />
              )}
              <Box>
                <Typography fontWeight="medium">{p.playerName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.position} {p.team ? `| ${p.team}` : ''}
                </Typography>
              </Box>
            </Box>
            <Typography fontWeight="bold">
              {(p.stats[stat] ?? 0).toFixed(1)} {unit}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default StatCard;
