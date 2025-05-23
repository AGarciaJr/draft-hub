import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Chip, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scoutRankings, playerSummaries } from '../../data';
import type { PlayerBio as BasePlayerBio } from '../../types/player.types';
import { playerBios as rawPlayerBios } from '../../data';
import StarIcon from '@mui/icons-material/Star';
import { playerDataService } from '../../services/playerDataService';
import playerClassesPositionsData from '../../data/player_classes_positions.json' with { type: 'json' };
import schoolColorsLogos from '../../data/school_colors_logos.json' with { type: 'json' };
import scrapedPositions from '../../data/processed/scraped_positions.json' with { type: 'json' };

const nameToPositionMap = new Map<string, string>(Object.entries(scrapedPositions));

// Helper function to get player class and position
const getPlayerClassAndPosition = (playerName: string) => {
  const playerData = playerClassesPositionsData.players.find(p => p.name === playerName);
  return {
    class: playerData?.class || null,
    position: playerData?.position || null
  };
};

// Extend the base PlayerBio with additional properties
interface PlayerBio extends BasePlayerBio {
  class?: string;
  age?: number;
  position?: string;
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

// Add this helper function to get player summary
const getPlayerSummary = (playerId: number): string | undefined => {
  const summary = playerSummaries.find(s => s.playerId === playerId);
  return summary?.summary;
};

const getBaseScoutName = (scoutName: string) => scoutName.replace(/ Rank.*$/, '').trim();

const hasScoutingReport = (playerId: number, scoutName: string): boolean => {
  const baseName = getBaseScoutName(scoutName);
  // Use .scout, not .scoutName
  return playerDataService.getAllScoutingReports().some(
    (report) => report.playerId === playerId && report.scout === baseName
  );
};

// Add this helper function to calculate age from birthDate
function getAgeFromBirthDate(birthDate: string): number | null {
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
}

const BigBoard: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'avgRank' | string>('avgRank');
  const [selectedScout, setSelectedScout] = useState<string>('allScouts');
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);
  const [positionFilter, setPositionFilter] = useState<string>('All Positions');
  const [schoolFilter, setSchoolFilter] = useState<string>('All Schools');
  const [attributeFilter, setAttributeFilter] = useState<string>('All Attributes');
  const [condensedView, setCondensedView] = useState<boolean>(false);

  // Get unique scout names from the scouting reports
  const availableScouts = useMemo(() => {
    const reports = playerDataService.getAllScoutingReports();
    const scouts = new Set(reports.map(report => report.scout));
    return Array.from(scouts);
  }, []);

  // Update the sortedPlayers useMemo to include new filters
  const sortedPlayers = useMemo(() => {
    let filteredPlayers = [...playerBios];

    if (positionFilter !== 'All Positions') {
      filteredPlayers = filteredPlayers.filter(p => nameToPositionMap.get(p.name) === positionFilter);
    }

    if (schoolFilter !== 'All Schools') {
      filteredPlayers = filteredPlayers.filter(p => p.currentTeam === schoolFilter);
    }

    if (attributeFilter === 'Age < 19') {
      filteredPlayers = filteredPlayers.filter(p => {
        const age = getAgeFromBirthDate(p.birthDate || '');
        return age !== null && age < 19;
      });
    } else if (attributeFilter === 'Height > 80') {
      filteredPlayers = filteredPlayers.filter(p => p.height && p.height > 80);
    }

    if (sortBy !== 'avgRank') {
      filteredPlayers = filteredPlayers.filter(player => {
        const ranking = getPlayerScoutRanking(player.playerId);
        return ranking && ranking[sortBy] != null;
      });
    }

    filteredPlayers.sort((a, b) => {
      const rankingA = getPlayerScoutRanking(a.playerId);
      const rankingB = getPlayerScoutRanking(b.playerId);

      if (!rankingA && !rankingB) return 0;
      if (!rankingA) return 1;
      if (!rankingB) return -1;

      if (sortBy === 'avgRank') {
        const rankDataA = calculateAverageRank(rankingA);
        const rankDataB = calculateAverageRank(rankingB);

        if (rankDataA.avg !== rankDataB.avg) return rankDataA.avg - rankDataB.avg;
        return rankDataB.count - rankDataA.count;
      } else {
        const rankA = Number(rankingA[sortBy]);
        const rankB = Number(rankingB[sortBy]);

        if (isNaN(rankA) && isNaN(rankB)) return 0;
        if (isNaN(rankA)) return 1;
        if (isNaN(rankB)) return -1;

        return rankA - rankB;
      }
    });

    return filteredPlayers.slice(0, 60);
  }, [sortBy, positionFilter, schoolFilter, attributeFilter]);

  const scoutNames = useMemo(() => {
    if (!scoutRankings || scoutRankings.length === 0) return [];
    const firstRanking = scoutRankings[0];
    return Object.keys(firstRanking).filter(key => key !== 'playerId');
  }, []);

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff' }}>
        NextGen Draft Board
      </Typography>

      {/* Filters & Toggle */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Sort */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: '#fff' }}>Sort By</InputLabel>
          <Select 
            value={sortBy} 
            label="Sort By" 
            onChange={(e) => setSortBy(e.target.value as 'avgRank' | string)} 
            sx={{ 
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            <MenuItem value="avgRank">Average Rank</MenuItem>
            {scoutNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Filters */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: '#fff' }}>Position</InputLabel>
          <Select 
            value={positionFilter} 
            label="Position" 
            onChange={(e) => setPositionFilter(e.target.value)} 
            sx={{ 
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            <MenuItem value="All Positions">All Positions</MenuItem>
            {Array.from(new Set(playerBios.map(p => nameToPositionMap.get(p.name)).filter(Boolean))).map(pos => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: '#fff' }}>School</InputLabel>
          <Select 
            value={schoolFilter} 
            label="School" 
            onChange={(e) => setSchoolFilter(e.target.value)} 
            sx={{ 
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            <MenuItem value="All Schools">All Schools</MenuItem>
            {Array.from(new Set(playerBios.map(p => p.currentTeam).filter(Boolean))).map(school => (
              <MenuItem key={school} value={school}>{school}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: '#fff' }}>Attributes</InputLabel>
          <Select 
            value={attributeFilter} 
            label="Attributes" 
            onChange={(e) => setAttributeFilter(e.target.value)} 
            sx={{ 
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            <MenuItem value="All Attributes">All Attributes</MenuItem>
            <MenuItem value="Age < 19">Age &lt; 19</MenuItem>
            <MenuItem value="Height > 80">Height &gt; 6'8"</MenuItem>
          </Select>
        </FormControl>

        {/* Toggle */}
        <Button
          variant={condensedView ? 'contained' : 'outlined'}
          onClick={() => setCondensedView(!condensedView)}
          sx={{ 
            minWidth: 120, 
            color: '#fff', 
            borderColor: '#fff',
            '&:hover': {
              borderColor: '#fff',
              bgcolor: condensedView ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          {condensedView ? 'Condensed' : 'Default'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedPlayers.map((player, idx) => {
          const ranking = getPlayerScoutRanking(player.playerId);
          const scoutNames = ranking ? Object.keys(ranking).filter(key => key !== 'playerId') : [];
          const playerAvgRankData = calculateAverageRank(ranking);
          const playerAvgRank = playerAvgRankData.avg;

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

          const schoolInfo = player.currentTeam && schoolColorsLogos.schools[player.currentTeam as keyof typeof schoolColorsLogos.schools];
          const schoolColor = (schoolInfo && typeof schoolInfo === 'object' && 'colors' in schoolInfo) ? schoolInfo.colors.primary : '#00538C';
          const schoolLogo = (schoolInfo && typeof schoolInfo === 'object' && 'logo' in schoolInfo) ? `/assets/logos/${schoolInfo.logo}` : '';

          return (
            <Paper key={player.playerId} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4, color: '#000' }}>
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
                    sx={{ height: 36, width: 36, mr: 2, borderRadius: 1, bgcolor: '#fff', p: 0.5 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {player.name}
                    <Typography
                      component="span"
                      sx={{ fontSize: '1.1rem', fontWeight: 400, color: '#fff', ml: 2 }}
                    >
                      {(() => {
                        const position = nameToPositionMap.get(player.name) || 'Unknown';
                        return position ? `${position}` : '';
                      })()} {player.currentTeam ? `• ${player.currentTeam}` : ''}
                    </Typography>
                  </Typography>
                </Box>
                {/* Rank Chip */}
                <Chip
                  label={`Rank ${idx + 1}`}
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: '1rem', bgcolor: '#fff', color: schoolColor, ml: 2 }}
                />
              </Box>

              {!condensedView && (
                <>
                  {/* Main Content: Player Image/Info and Summary/Comparisons/Attributes */}
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
                            transition: 'opacity 0.2s',
                            fontSize: 24,
                            fontWeight: 600,
                            pointerEvents: 'none',
                            zIndex: 2,
                            userSelect: 'none',
                            '.MuiBox-root:hover > &': {
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
                          const scoutRank = ranking ? (ranking as ScoutRanking)[scoutName] : undefined;
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
                                    <StarIcon
                                      sx={{ ml: 0.5, color: '#FFD700', verticalAlign: 'middle' }}
                                      fontSize="small"
                                      titleAccess="Scouting report available"
                                    />
                                  )}
                                </span>
                              }
                              color={rankColor}
                              size="small"
                              sx={{ fontWeight: 500, fontSize: '1rem', px: 2, py: 0.5 }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Box sx={{ height: 8 }} />

                  {/* Scouting Reports (Expanded Section) */}
                  {expandedPlayerId === player.playerId && (
                    <Box sx={{ px: { xs: 2, md: 6 }, py: 4, width: '100%' }}>
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

                  {/* Expand Button */}
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', bgcolor: '#fff', py: 4 }}>
                    <Button
                      onClick={() => setExpandedPlayerId(expandedPlayerId === player.playerId ? null : player.playerId)}
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
                      variant="outlined"
                    >
                      {expandedPlayerId === player.playerId ? 'Hide Report' : 'See Full Report'}
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default BigBoard; 