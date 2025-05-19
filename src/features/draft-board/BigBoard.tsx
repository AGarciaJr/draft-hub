import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Link as MuiLink, Divider, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { playerBios, scoutRankings } from '../../data'; // Import real data

// Helper to get a player's scout ranking object by playerId
const getPlayerScoutRanking = (playerId: number) =>
  scoutRankings.find((r: any) => r.playerId === playerId);

const getHeightString = (inches: number) => {
  if (!inches) return 'N/A';
  const feet = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${feet}'${inch}"`;
};

// Calculate average ranking and count of rankings for a player
const calculateAverageRank = (playerRankingData: any): { avg: number, count: number } => {
  if (!playerRankingData) return { avg: Infinity, count: 0 };

  // Extract only the ranking values, excluding playerId
  const rankValues: number[] = Object.entries(playerRankingData)
    .filter(([key]) => key !== 'playerId' && playerRankingData[key] != null) // Filter out null/undefined ranks as well
    .map(([, value]) => Number(value))
    .filter(value => !isNaN(value));

  const count = rankValues.length; // This is the number of scouts who provided a valid rank
  const avg = count > 0
    ? rankValues.reduce((sum, rank) => sum + rank, 0) / count // Sum of valid rankings / Number of valid ranked scouts
    : Infinity;

  return { avg, count };
};

const BigBoard: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'avgRank' | string>('avgRank');

  // Get unique scout names from the rankings data
  const scoutNames = useMemo(() => {
    if (!scoutRankings || scoutRankings.length === 0) return [];
    // Assuming the first ranking object has all the keys we need
    const firstRanking = scoutRankings[0];
    return Object.keys(firstRanking).filter(key => key !== 'playerId');
  }, [scoutRankings]);

  // Sort players based on selected criteria
  const sortedPlayers = useMemo(() => {
    let players = [...playerBios];

    // Filter players based on sorting criteria before sorting
    let filteredPlayers = players;
    if (sortBy !== 'avgRank') {
      // When sorting by a specific scout, only include players ranked by that scout
      filteredPlayers = players.filter(player => {
        const ranking = getPlayerScoutRanking(player.playerId);
        // Use type assertion here assuming ranking is ScoutRanking | undefined
        return ranking && (ranking as any)[sortBy] != null; // Check if the scout's rank exists and is not null/undefined
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
        const rankA = Number((rankingA as any)[sortBy]);
        const rankB = Number((rankingB as any)[sortBy]);

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

  }, [playerBios, scoutRankings, sortBy, scoutNames]); // Add scoutNames as dependency

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
          const currentRankInList = idx + 1;
          const playerAvgRankData = calculateAverageRank(ranking);
          const playerAvgRank = playerAvgRankData.avg; // Use the calculated average

          // Example thresholds based on player's position in the sorted list
          const isHighRanking = (scoutRank: number) => playerAvgRank !== Infinity && scoutRank < playerAvgRank * 0.8; // Example: 20% better than avg
          const isLowRanking = (scoutRank: number) => playerAvgRank !== Infinity && scoutRank > playerAvgRank * 1.2; // Example: 20% worse than avg

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
                <Typography variant="body1">{player.position} • {player.currentTeam}</Typography>
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
                    {/* Player class and age might not be in playerBios directly - need to check data */}
                     {/* For now, using placeholders or omitting if not available */}
                     {(player as any).class && ( // Use type assertion
                       <Box>
                         <Typography variant="body1" sx={{ fontWeight: 600 }}>{(player as any).class}</Typography>
                         <Typography variant="body2" color="text.secondary">Class</Typography>
                       </Box>
                     )}
                     {(player as any).age && ( // Use type assertion
                       <Box>
                         <Typography variant="body1" sx={{ fontWeight: 600 }}>{(player as any).age}</Typography>
                         <Typography variant="body2" color="text.secondary">Age</Typography>
                       </Box>
                     )}
                  </Box>
                </Box>

                {/* Player Details (Summary, Scout Rankings, etc.) */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {(player as any).summary || 'No summary available.'} {/* Use type assertion */}
                  </Typography>

                  {/* Scout Rankings */}
                  <Typography variant="h6" gutterBottom>Scout Rankings</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {scoutNames.map(scoutName => {
                      // Use type assertion assuming ranking is ScoutRanking
                      const scoutRank = ranking ? (ranking as any)[scoutName] : undefined;
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