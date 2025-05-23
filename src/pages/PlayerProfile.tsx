import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { playerDataService } from '../services/playerDataService';
import { playerStatsService } from '../services/playerStatsService';
import { Box, Typography, Container } from '@mui/material';
import ScoutingReportForm from '../components/scouting/ScoutingReportForm';
import ScoutingReportList from '../components/scouting/ScoutingReportList';
import PlayerInfo from '../components/player/PlayerInfo';
import PlayerStatCard from '../components/player/PlayerStatCard';
import type { ScoutingReport } from '../types/player.types';
import playerSummaries from '../data/player_summaries.json' with { type: 'json' };
import scrapedPositions from '../data/processed/scraped_positions.json' with { type: 'json' };

const nameToPositionMap = new Map<string, string>(Object.entries(scrapedPositions));

const PlayerProfile: React.FC = () => {
  const { playerId } = useParams();
  const numericPlayerId = Number(playerId);
  const player = playerDataService.getPlayerById(numericPlayerId);

  // Get existing reports from the JSON
  const existingReports = playerDataService.getScoutingReportsByPlayerId(numericPlayerId);

  // Track user-added reports
  const [userReports, setUserReports] = useState<ScoutingReport[]>([]);

  // Combine both for display
  const combinedReports = [...existingReports, ...userReports];

  const summaryEntry = playerSummaries.find(
    (s) => s.playerId === player?.playerId
  );
  const playerSummary = summaryEntry?.summary || null;

  // Get player stats
  const playerStats = playerStatsService.getPlayerStats(numericPlayerId);

  if (!player) {
    return (
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          Player not found
        </Typography>
      </Container>
    );
  }

  const position = nameToPositionMap.get(player.name) || 'Unknown';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: 4,
        }}
      >
        <PlayerInfo
          player={player}
          playerSummary={playerSummary}
          position={position}
        />
        <PlayerStatCard
          stats={playerStats || {
            gamesPlayed: 0,
            totals: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0,
              turnovers: 0,
              fgPercentage: 0,
              tpPercentage: 0,
              ftPercentage: 0,
            },
            perGame: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0,
              turnovers: 0,
              minutes: 0,
            }
          }}
        />
      </Box>

      {/* Scouting Report Section */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom color="#fff">
          Scouting Reports
        </Typography>

        <ScoutingReportForm
          playerId={numericPlayerId}
          reports={userReports}
          setReports={setUserReports}
        />

        <Box mt={4}>
          <ScoutingReportList reports={combinedReports} />
        </Box>
      </Box>
    </Container>
  );
};

export default PlayerProfile;