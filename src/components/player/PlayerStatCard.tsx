import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { playerDataService } from '../../services/playerDataService';
import schoolColorsLogos from '../../data/school_colors_logos.json' with { type: 'json' };
import playerStatsInfo from '../../data/player_stats_info.json' with { type: 'json' };
import type { PlayerBio, SeasonLog } from '../../types/player.types';
import scrapedPositions from '../../data/processed/scraped_positions.json' with { type: 'json' };

interface PlayerCardMinimalProps {
  player: PlayerBio;
}

const nameToPositionMap = new Map<string, string>(Object.entries(scrapedPositions));

const PlayerCardMinimal: React.FC<PlayerCardMinimalProps> = ({ player }) => {
  const navigate = useNavigate();
  const schoolInfo = player.currentTeam && schoolColorsLogos.schools[player.currentTeam as keyof typeof schoolColorsLogos.schools];
  const schoolColor = (schoolInfo && typeof schoolInfo === 'object' && 'colors' in schoolInfo) ? schoolInfo.colors.primary : '#00538C';
  const schoolLogo = (schoolInfo && typeof schoolInfo === 'object' && 'logo' in schoolInfo) ? `/assets/logos/${schoolInfo.logo}` : '';
  
  // Get the position from the nameToPositionMap
  const position = nameToPositionMap.get(player.name) || 'Unknown';

  const seasonLogs = playerDataService.getPlayerSeasonLogs(player.playerId);
  const latestSeasonLog: SeasonLog | undefined = seasonLogs.length > 0 ? seasonLogs[0] : undefined; 
  // Get most recent season log if available

  // Find the player's AI-generated stats analysis
  const playerAnalysis = playerStatsInfo.find(p => p.playerName === player.name);

  // Define which stats to display and map them to season log keys and analysis keys
  const statMapping = [
    { seasonKey: 'PTS', analysisStat: 'Points Per Game', label: 'Points Per Game' },
    { seasonKey: 'TRB', analysisStat: 'Rebounds Per Game', label: 'Rebounds Per Game' },
    { seasonKey: 'FG%', analysisStat: 'Field Goal Percentage', label: 'Field Goal Percentage' },
  ];
  
  const statsToDisplay = statMapping.map(({ seasonKey, analysisStat, label }) => {
    const seasonValue = latestSeasonLog ? (latestSeasonLog[seasonKey as keyof SeasonLog] as number | undefined) : undefined;
  
    // Look for a matching explanation in stat1/stat2/stat3
    let explanation = 'No explanation available.';
    if (playerAnalysis?.analysis) {
      for (const key of ['stat1', 'stat2', 'stat3'] as const) {
        if (playerAnalysis.analysis[key].stat === analysisStat) {
          explanation = playerAnalysis.analysis[key].explanation;
          break;
        }
      }
    }
  
    return {
      stat: label,
      value: seasonValue !== undefined && seasonValue !== null ? seasonValue.toFixed(1) : 'N/A',
      explanation
    };
  });
  

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
      {/* Header Bar */}
      <Box
        sx={{
          bgcolor: schoolColor,
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #ccc',
        }}
      >
        {/* School Logo and Player Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
          <Box
            component="img"
            src={schoolLogo || '/assets/logos/logo.png'}
            alt={player.currentTeam}
            onError={e => { e.currentTarget.src = '/assets/logos/logo.png'; }}
            sx={{ height: 36, width: 36, borderRadius: 1, bgcolor: '#fff', p: 0.5 }}
          />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            {player.name} • {position} {player.currentTeam && `• ${player.currentTeam}`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'white', p: 4, gap: 4 }}>
        {/* Left: Image */}
        <Box sx={{ width: { xs: '100%', md: 320 }, mb: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: '100%',
              height: 320,
              background: '#f3f3f3',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 0 0 4px #075A9933' },
            }}
            onClick={() => navigate(`/profiles/${player.playerId}`)}
            title={`View ${player.name}'s profile`}
          >
            <Box
              component="img"
              src={player.photoUrl || 'https://cdn.nba.com/headshots/nba/latest/1040x760/1631244.png'}
              alt={player.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
                display: 'block',
              }}
            />
          </Box>
        </Box>

        {/* Right: Stats Analysis */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Key Stats Analysis</Typography>
          {statsToDisplay.length > 0 ? (
            statsToDisplay.map((stat, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stat.stat}
                  </Typography>
                  <Chip 
                    label={stat.value} 
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {stat.explanation}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No key season stats analysis available.
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default PlayerCardMinimal; 