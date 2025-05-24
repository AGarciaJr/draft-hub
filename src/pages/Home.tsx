import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TopScorersChart from '../components/charts/TopScorerChart';
import Hero from '../components/home/Hero'
import PlayerCarousel from '../components/home/PlayerCarousel';
import { playerDataService } from '../services/playerDataService';
import type { SeasonLog } from '../types/player.types';

const Home: React.FC = () => {
  const allSeasonLogs = playerDataService.getAllSeasonLogs();

  // Get top 10 scorers
  const topScorers = allSeasonLogs
    // Group by playerId and get their most recent season
    .reduce((acc, log) => {
      const existing = acc.find(l => l.playerId === log.playerId);
      if (!existing || log.Season > existing.Season) {
        return [...acc.filter(l => l.playerId !== log.playerId), log];
      }
      return acc;
    }, [] as SeasonLog[])
    .filter(log => log.PTS !== undefined)
    .sort((a, b) => b.PTS - a.PTS)
    .slice(0, 10)
    .map(log => {
        const player = playerDataService.getPlayerById(log.playerId);
        return {
          playerId: player?.playerId ?? 0,
          name: player?.name || 'Unknown Player',
          PTS: Number(log.PTS.toFixed(1)),
        };
      });
      

  return (
    <Box sx={{ px: 4, py: 6 }}>

      <Hero />

      <PlayerCarousel />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
            fontWeight: 700,
            color: 'primary.main',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            letterSpacing: 0.5,
            mb: 3
        }}
        >
        🏀 Next Gen Insights
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Top 10 Scorers (PPG)</Typography>
        <TopScorersChart data={topScorers} />
      </Paper>
    </Box>
  );
};

export default Home; 