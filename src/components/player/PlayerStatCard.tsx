import React, { useState } from 'react';
import { Box, Typography, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface PerGameStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  minutes: number;
}

interface TotalStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgPercentage: number;
  tpPercentage: number;
  ftPercentage: number;
}

interface PlayerStats {
  gamesPlayed: number;
  totals: TotalStats;
  perGame: PerGameStats;
}

interface PlayerStatCardProps {
  stats: PlayerStats;
}

const PlayerStatCard: React.FC<PlayerStatCardProps> = ({ stats }) => {
  const [viewMode, setViewMode] = useState<'perGame' | 'totals'>('perGame');

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newViewMode: 'perGame' | 'totals' | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const displayStats = viewMode === 'perGame' ? stats.perGame : stats.totals;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Season Stats
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Games Played: {stats.gamesPlayed}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="stats view mode"
          size="small"
          fullWidth
        >
          <ToggleButton value="perGame" aria-label="per game stats">
            Per Game
          </ToggleButton>
          <ToggleButton value="totals" aria-label="total stats">
            Totals
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        <StatItem
          label="Points"
          value={displayStats.points}
          suffix={viewMode === 'perGame' ? ' PPG' : ''}
        />
        <StatItem
          label="Rebounds"
          value={displayStats.rebounds}
          suffix={viewMode === 'perGame' ? ' RPG' : ''}
        />
        <StatItem
          label="Assists"
          value={displayStats.assists}
          suffix={viewMode === 'perGame' ? ' APG' : ''}
        />
        <StatItem
          label="Steals"
          value={displayStats.steals}
          suffix={viewMode === 'perGame' ? ' SPG' : ''}
        />
        <StatItem
          label="Blocks"
          value={displayStats.blocks}
          suffix={viewMode === 'perGame' ? ' BPG' : ''}
        />
        <StatItem
          label="Turnovers"
          value={displayStats.turnovers}
          suffix={viewMode === 'perGame' ? ' TPG' : ''}
        />
        {viewMode === 'perGame' && (
          <StatItem
            label="Minutes"
            value={(displayStats as PerGameStats).minutes}
            suffix=" MPG"
          />
        )}
        {viewMode === 'totals' && (
          <>
            <StatItem
              label="FG%"
              value={(displayStats as TotalStats).fgPercentage}
              suffix="%"
            />
            <StatItem
              label="3P%"
              value={(displayStats as TotalStats).tpPercentage}
              suffix="%"
            />
            <StatItem
              label="FT%"
              value={(displayStats as TotalStats).ftPercentage}
              suffix="%"
            />
          </>
        )}
      </Box>
    </Paper>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, suffix = '' }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6">
      {value.toFixed(1)}
      {suffix}
    </Typography>
  </Box>
);

export default PlayerStatCard;
