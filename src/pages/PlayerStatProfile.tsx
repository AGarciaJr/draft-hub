import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { playerDataService } from '../services/playerDataService';
import GameLogsTable from '../components/player/GameLogsTable';
import SeasonLogsTable from '../components/player/SeasonLogsTable';
import PlayerStatCard from '../components/player/PlayerStatCard';

const PlayerStatProfile: React.FC = () => {
  const { playerId } = useParams();
  const numericPlayerId = Number(playerId);
  const gameLogs = playerDataService.getPlayerGameLogs(numericPlayerId);
  const seasonLogs = playerDataService.getPlayerSeasonLogs(numericPlayerId);
  const player = playerDataService.getPlayerById(numericPlayerId);
  const [viewMode, setViewMode] = useState<'game' | 'season'>('game');

  if (!player) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <PlayerStatCard player={player} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          aria-label="view mode"
          size="small"
          fullWidth
          sx={{
            '& .MuiToggleButton-root': {
              bgcolor: 'white',          // unselected background
              color: 'primary.main',     // unselected text
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'grey.100',     // subtle hover effect
              },
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
          
        >
          <ToggleButton value="game">Game Logs</ToggleButton>
          <ToggleButton value="season">Season Logs</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'game' ? (
        <GameLogsTable logs={gameLogs} />
      ) : (
        <SeasonLogsTable logs={seasonLogs} />
      )}
    </Container>
  );
};

export default PlayerStatProfile;
