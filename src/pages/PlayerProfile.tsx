import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { playerDataService } from '../services/playerDataService';
import { Box, Typography, Paper, Container, Divider } from '@mui/material';
import ScoutingReportForm from '../components/ScoutingReportForm';
import ScoutingReportList from '../components/ScoutingReportList';
import type { ScoutingReport } from '../types/player.types';
import  playerSummaries  from '../data/player_summaries.json';

const PlayerProfile: React.FC = () => {
  const { playerId } = useParams();
  console.log(playerId);
  const numericPlayerId = Number(playerId);
  console.log(numericPlayerId);

  const player = playerDataService.getPlayerById(numericPlayerId);

  // Get existing reports from the JSON
  const existingReports = playerDataService.getScoutingReportsByPlayerId(numericPlayerId);
  console.log(existingReports);

  // Track user-added reports
  const [userReports, setUserReports] = useState<ScoutingReport[]>([]);

  // Combine both for display
  const combinedReports = [...existingReports, ...userReports];

  const player = playerDataService.getPlayerById(Number(playerId));
  
  const summaryEntry = playerSummaries.find(
    (s) => s.playerId === player?.playerId
  );
  const playerSummary = summaryEntry?.summary || null;
  
  if (!player) {
    return (
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          Player not found
        </Typography>
      </Container>
    );
  }

  const heightFeet = player.height ? Math.floor(player.height / 12) : 0;
  const heightInches = player.height ? player.height % 12 : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 2fr',
            },
            gap: 4,
          }}
        >
          <Box>
            {player.photoUrl ? (
              <Box
                component="img"
                src={player.photoUrl}
                alt={player.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No Photo Available
                </Typography>
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="h3" gutterBottom>
              {player.name}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: 2,
              }}
            >

            {playerSummary && (
              <Typography 
                variant="subtitle1"
                fontStyle="italic"
                color="text.secondary"
                sx={{ mb: 2 }}
                gutterBottom>
                {playerSummary}
              </Typography>
            )}
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)'
              },
              gap: 2
            }}>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Current Team
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {player.currentTeam}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  League
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {player.league}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Height
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {heightFeet}' {heightInches}"
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {player.weight} lbs
                </Typography>
              </Box>

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Divider sx={{ my: 2 }} />
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Hometown
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {player.homeTown}
                  {player.homeState && `, ${player.homeState}`}
                  {player.homeCountry && `, ${player.homeCountry}`}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Nationality
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {player.nationality}
                </Typography>
              </Box>

              {player.highSchool && (
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    High School
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {player.highSchool}
                    {player.highSchoolState && `, ${player.highSchoolState}`}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Scouting Report Section */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
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
