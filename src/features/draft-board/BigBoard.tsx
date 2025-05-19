import React from 'react';
import { Box, Typography, Paper, Link as MuiLink, Divider, Chip } from '@mui/material';
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

const BigBoard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        NextGen Draft Board {/* Updated Title */}
      </Typography>

      <Box sx={{ display: 'grid', gap: 4 }}>
        {playerBios.slice(0, 20).map((player, idx) => {
          const ranking = getPlayerScoutRanking(player.playerId);
          const scoutNames = ranking ? Object.keys(ranking).filter(key => key !== 'playerId') : [];

          // Basic logic for high/low ranking indication (can be refined)
          // For simplicity, comparing to the player's index in the current sliced list
          const isHighRanking = (scoutRank: number) => scoutRank < (idx + 1) * 0.8; // Example threshold
          const isLowRanking = (scoutRank: number) => scoutRank > (idx + 1) * 1.2; // Example threshold

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
                    src={player.photoUrl || 'placeholder-image-url'} // Use real photo or a placeholder
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
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{player.class}</Typography>
                      <Typography variant="body2" color="text.secondary">Class</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{player.age}</Typography>
                      <Typography variant="body2" color="text.secondary">Age</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Player Details (Summary, Scout Rankings, etc.) */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {player.summary || 'No summary available.'} {/* Use real summary if available */}
                  </Typography>

                  {/* Scout Rankings */}
                  <Typography variant="h6" gutterBottom>Scout Rankings</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {scoutNames.map(scoutName => {
                      const scoutRank = ranking ? ranking[scoutName] : undefined;
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