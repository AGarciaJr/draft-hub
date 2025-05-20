import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Link as MuiLink, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scoutRankings } from '../../data';
import type { PlayerBio as BasePlayerBio } from '../../types/player.types';
import { playerBios as rawPlayerBios } from '../../data';

// Extend the base PlayerBio with additional properties
interface PlayerBio extends BasePlayerBio {
  class?: string;
  age?: number;
}

// Type the playerBios
const playerBios: PlayerBio[] = rawPlayerBios as PlayerBio[];

// Define proper types for scout rankings
interface ScoutRanking {
  playerId: number;
  [scoutName: string]: number | string | null;
}

// Update the getPlayerScoutRanking function with proper typing
const getPlayerScoutRanking = (playerId: number): ScoutRanking | undefined =>
  scoutRankings.find((r) => r.playerId === playerId);

const getHeightString = (inches: number) => {
  if (!inches) return 'N/A';
  const feet = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${feet}'${inch}"`;
};

// Update calculateAverageRank with proper typing
const calculateAverageRank = (playerRankingData: ScoutRanking | undefined): { avg: number, count: number } => {
  if (!playerRankingData) return { avg: Infinity, count: 0 };

  const rankValues: number[] = Object.entries(playerRankingData)
    .filter(([key]) => key !== 'playerId' && playerRankingData[key] != null)
    .map(([, value]) => Number(value))
    .filter(value => !isNaN(value));

  const count = rankValues.length;
  const avg = count > 0
    ? rankValues.reduce((sum, rank) => sum + rank, 0) / count
    : Infinity;

  return { avg, count };
};

// Add interface for player summary
interface PlayerSummary {
  summary?: string;
  class?: string;
  age?: number;
  name: string;
  playerId: number;
  height: number;
  weight: number;
  photoUrl?: string;
}

const BigBoard: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'avgRank' | string>('avgRank');

  // Update the sortedPlayers useMemo to remove unnecessary dependencies
  const sortedPlayers = useMemo(() => {
    const players = [...playerBios];

    // Filter players based on sorting criteria before sorting
    let filteredPlayers = players;
    if (sortBy !== 'avgRank') {
      filteredPlayers = players.filter(player => {
        const ranking = getPlayerScoutRanking(player.playerId);
        return ranking && ranking[sortBy] != null;
      });
    }

    filteredPlayers.sort((a, b) => {
      const rankingA = getPlayerScoutRanking(a.playerId);
      const rankingB = getPlayerScoutRanking(b.playerId);

      // Handle cases where players might not have ranking data
      // This is still needed for 'avgRank' sorting and robustness, even with filtering for specific scouts
      if (!rankingA && !rankingB) return 0;
      if (!rankingA) return 1; // Player B has ranking, A doesn't, A goes lower
      if (!rankingB) return -1; // Player A has ranking, B doesn't, B goes lower

      if (sortBy === 'avgRank') {
        const rankDataA = calculateAverageRank(rankingA);
        const rankDataB = calculateAverageRank(rankingB);

        console.log(`Comparing Player ${a.playerId} (Avg Rank: ${rankDataA.avg}, Count: ${rankDataA.count}) with Player ${b.playerId} (Avg Rank: ${rankDataB.avg}, Count: ${rankDataB.count})`);

        // Primary sort by average rank (lower average is better)
        if (rankDataA.avg !== rankDataB.avg) {
          return rankDataA.avg - rankDataB.avg;
        }
        // Secondary sort by the count of rankings (more rankings first, for tie-breaking)
        return rankDataB.count - rankDataA.count;
      } else {
        // Sort by a specific scout rank (we already filtered out players without this rank)
        // Use type assertion here assuming rankingA and rankingB are ScoutRanking
        const rankA = Number((rankingA as ScoutRanking)[sortBy]);
        const rankB = Number((rankingB as ScoutRanking)[sortBy]);

        // Since we filtered, rankA and rankB should be numbers here if the data is clean,
        // but keeping isNaN checks for robustness.
        if (isNaN(rankA) && isNaN(rankB)) return 0;
        if (isNaN(rankA)) return 1; // Should not happen often after filtering
        if (isNaN(rankB)) return -1; // Should not happen often after filtering

        return rankA - rankB;
      }
    });

    // Apply the slice after sorting if you still want to limit the number of displayed players
    const displayedPlayers = filteredPlayers.slice(0, 60); // Display up to 60 players

    return displayedPlayers; // Return the sorted and sliced array
  }, [sortBy]); // Remove unnecessary dependencies

  // Update the second useMemo to remove unnecessary dependencies
  const scoutNames = useMemo(() => {
    if (!scoutRankings || scoutRankings.length === 0) return [];
    const firstRanking = scoutRankings[0];
    return Object.keys(firstRanking).filter(key => key !== 'playerId');
  }, []); // Remove scoutRankings dependency

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        NextGen Draft Board {/* Updated Title */}
      </Typography>

      {/* Sorting Control */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 1 }}>Sort by:</Typography>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as 'avgRank' | string)}
          >
            <MenuItem value="avgRank">Average Rank</MenuItem>
            {scoutNames.map(scoutName => (
              <MenuItem key={scoutName} value={scoutName}>{scoutName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'grid', gap: 4 }}>
        {sortedPlayers.map((player, idx) => {
          const ranking = getPlayerScoutRanking(player.playerId);
          const scoutNames = ranking ? Object.keys(ranking).filter(key => key !== 'playerId') : []; // Recalculate scoutNames here if needed per player

          // Basic logic for high/low ranking indication (can be refined)
          // This logic might need adjustment based on the overall sorted list position, not just idx
          const playerAvgRankData = calculateAverageRank(ranking);
          const playerAvgRank = playerAvgRankData.avg; // Use the calculated average

          // Example thresholds based on player's position in the sorted list
          const isHighRanking = (scoutRank: string | number | null): boolean => {
            if (scoutRank === null) return false;
            const rank = Number(scoutRank);
            return !isNaN(rank) && rank < playerAvgRank * 0.8;
          };

          const isLowRanking = (scoutRank: string | number | null): boolean => {
            if (scoutRank === null) return false;
            const rank = Number(scoutRank);
            return !isNaN(rank) && rank > playerAvgRank * 1.2;
          };

          return (
            <Paper key={player.playerId} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {/* Player Header */}
              <Box
                sx={{
                  bgcolor: idx % 2 === 0 ? 'primary.main' : '#012B5E', // Alternating theme colors
                  color: 'primary.contrastText',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Rank {idx + 1}</Typography>
                {/* Placeholder for team logo/icon */}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{player.name}</Typography>
                {/* <Typography variant="body1">{player.position} • {player.currentTeam}</Typography> */}
              </Box>

              {/* Player Main Content */}
              <Box sx={{ display: 'flex', p: 2, gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Player Image and Basic Info */}
                <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 250 }, textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={player.photoUrl || 'https://cdn.nba.com/headshots/nba/latest/1040x760/1631244.png'} // Use real photo or the placeholder
                    alt={player.name}
                    sx={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{getHeightString(player.height)}</Typography>
                      <Typography variant="body2" color="text.secondary">Height</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{player.weight}</Typography>
                      <Typography variant="body2" color="text.secondary">Weight</Typography>
                    </Box>
                    {player.class && (
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{player.class}</Typography>
                        <Typography variant="body2" color="text.secondary">Class</Typography>
                      </Box>
                    )}
                    {player.age && (
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{player.age}</Typography>
                        <Typography variant="body2" color="text.secondary">Age</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Player Details (Summary, Scout Rankings, etc.) */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {(player as PlayerSummary).summary || 'No summary available.'}
                  </Typography>

                  {/* Scout Rankings */}
                  <Typography variant="h6" gutterBottom>Scout Rankings</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {scoutNames.map(scoutName => {
                      // Use type assertion assuming ranking is ScoutRanking
                      const scoutRank = ranking ? (ranking as ScoutRanking)[scoutName] : undefined;
                      if (scoutRank == null) return null;

                      const rankColor = isHighRanking(scoutRank) ? 'success' : isLowRanking(scoutRank) ? 'error' : 'default';

                      return (
                        <Chip
                          key={scoutName}
                          label={`${scoutName}: ${scoutRank}`}
                          color={rankColor}
                          size="small"
                        />
                      );
                    })}
                  </Box>

                  {/* Placeholder for Comparisons/Attributes if needed later */}

                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <MuiLink component="button" variant="button" onClick={() => navigate(`/profiles/${player.playerId}`)}>
                      See full player report
                    </MuiLink>
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default BigBoard; 