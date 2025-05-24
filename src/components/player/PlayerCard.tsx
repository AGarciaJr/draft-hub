import React from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { playerDataService } from '../../services/playerDataService';
import schoolColorsLogos from '../../data/school_colors_logos.json' with { type: 'json' };
import { playerSummaries } from '../../data';
import scrapedPositions from '../../data/processed/scraped_positions.json' with { type: 'json' };
import playerClassesPositionsData from '../../data/player_classes_positions.json' with { type: 'json' };
import type { PlayerBio } from '../../types/player.types';

const nameToPositionMap = new Map<string, string>(Object.entries(scrapedPositions));

const getPlayerClassAndPosition = (playerName: string) => {
  const playerData = playerClassesPositionsData.players.find(p => p.name === playerName);
  return {
    class: playerData?.class || null,
    position: playerData?.position || null
  };
};

const getAgeFromBirthDate = (birthDate: string): number | null => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const getHeightString = (inches: number) => {
  if (!inches) return 'N/A';
  const feet = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${feet}'${inch}"`;
};

const getPlayerSummary = (playerId: number): string | undefined => {
  const summary = playerSummaries.find(s => s.playerId === playerId);
  return summary?.summary;
};

const getBaseScoutName = (scoutName: string) => scoutName.replace(/ Rank.*$/, '').trim();

const hasScoutingReport = (playerId: number, scoutName: string): boolean => {
  const baseName = getBaseScoutName(scoutName);
  return playerDataService.getAllScoutingReports().some(
    (report) => report.playerId === playerId && report.scout === baseName
  );
};

interface PlayerCardProps {
  player: PlayerBio;
  index: number;
  condensed: boolean;
  expandedPlayerId: number | null;
  setExpandedPlayerId: (id: number | null) => void;
  selectedScout: string;
  scoutNames: string[];
  ranking: { [key: string]: number | string | null } | undefined;
  avgRank: number;
  sortBy: string;
  sortedPlayers: PlayerBio[];
  trueRank: number | null;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  condensed,
  expandedPlayerId,
  setExpandedPlayerId,
  selectedScout,
  scoutNames,
  ranking,
  avgRank,
  sortedPlayers,
  trueRank,
}) => {
  const navigate = useNavigate();

  const isHighRanking = (scoutRank: string | number | null) => {
    if (scoutRank === null) return false;
    const rank = Number(scoutRank);
    return !isNaN(rank) && rank < avgRank * 0.8;
  };

  const isLowRanking = (scoutRank: string | number | null) => {
    if (scoutRank === null) return false;
    const rank = Number(scoutRank);
    return !isNaN(rank) && rank > avgRank * 1.2;
  };

  const schoolInfo = player.currentTeam && schoolColorsLogos.schools[player.currentTeam as keyof typeof schoolColorsLogos.schools];
  const schoolColor = (schoolInfo && typeof schoolInfo === 'object' && 'colors' in schoolInfo) ? schoolInfo.colors.primary : '#00538C';
  const schoolLogo = (schoolInfo && typeof schoolInfo === 'object' && 'logo' in schoolInfo) ? `/assets/logos/${schoolInfo.logo}` : '';

  const displayRank = trueRank ?? null;

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
            {player.name} • {nameToPositionMap.get(player.name)} {player.currentTeam && `• ${player.currentTeam}`}
          </Typography>
        </Box>

        <Chip
          label={`Rank ${displayRank ?? 'N/A'}`}
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            bgcolor: '#fff',
            color: schoolColor,
            ml: 2
          }}
        />


      </Box>

      {!condensed && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'white', p: 4, gap: 4 }}>
          {/* Left: Image + Info */}
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
              {/* Animated overlay on hover */}
              <Box
                className="profile-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  opacity: 0,
                  transition: 'opacity 0.2s', // Reduced transition duration
                  fontSize: 24,
                  fontWeight: 600,
                  pointerEvents: 'none', // Disable pointer events so hover on parent works
                  zIndex: 2,
                  userSelect: 'none',
                  '.MuiBox-root:hover > &': { // Target the overlay when the parent Box is hovered
                    opacity: 1,
                  },
                }}
              >
                View Profile
              </Box>
            </Box>
            {/* Player Info Row */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, width: '100%', mt: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{getHeightString(player.height)}</Typography>
                <Typography variant="body2" color="text.secondary">Height</Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{player.weight}</Typography>
                <Typography variant="body2" color="text.secondary">Weight</Typography>
              </Box>
              {(() => {
                const { class: playerClass } = getPlayerClassAndPosition(player.name);
                return playerClass ? (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{playerClass}</Typography>
                    <Typography variant="body2" color="text.secondary">Class</Typography>
                  </Box>
                ) : null;
              })()}
              {player.birthDate && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{getAgeFromBirthDate(player.birthDate)}</Typography>
                  <Typography variant="body2" color="text.secondary">Age</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right: Summary and Rankings */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Summary</Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {getPlayerSummary(player.playerId) || 'No summary available.'}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Scout Rankings</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, rowGap: 2 }}>
              {scoutNames.map(scoutName => {
                const scoutRank = ranking ? ranking[scoutName] : null;
                if (scoutRank == null) return null;
                const rankColor = isHighRanking(scoutRank) ? 'success' : isLowRanking(scoutRank) ? 'error' : 'default';
                const showStar = hasScoutingReport(player.playerId, scoutName);
                return (
                  <Chip
                    key={scoutName}
                    label={
                      <span>
                        {scoutName}: {scoutRank}
                        {showStar && (
                          <StarIcon sx={{ ml: 0.5, color: '#FFD700', verticalAlign: 'middle' }} fontSize="small" />
                        )}
                      </span>
                    }
                    color={rankColor}
                  />
                );
              })}
            </Box>

            {/* Scouting Reports (Expanded Section) */}
            {expandedPlayerId === player.playerId && ( // Only render if expandedPlayerId matches this player
              <Box sx={{ mt: 4, px: 2, width: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Scouting Report by {selectedScout === "allScouts" ? "All Scouts" : selectedScout}
                </Typography>
                {(() => {
                  const allReports = playerDataService.getPlayerScoutingReports(player.playerId);
                  const filteredReports = selectedScout === "allScouts"
                    ? allReports
                    : allReports.filter(report => report.scout === selectedScout);
                  return filteredReports.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No reports available for this player by {selectedScout === "allScouts" ? "All Scouts" : selectedScout}.
                    </Typography>
                  ) : (
                    filteredReports.map(report => (
                      <Box key={report.reportId} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700 }}>
                          {report.scout}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {report.report}
                        </Typography>
                      </Box>
                    ))
                  );
                })()}
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => setExpandedPlayerId(expandedPlayerId === player.playerId ? null : player.playerId)}
                variant="outlined"
                sx={{
                  border: '1px solid #075A99',
                  borderRadius: '999px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#075A99',
                  bgcolor: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#f5fafd',
                    borderColor: '#075A99',
                  },
                }}
              >
                {expandedPlayerId === player.playerId ? 'Hide Report' : 'See Full Report'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PlayerCard;
