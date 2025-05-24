import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { scoutRankings } from '../../data';
import type { PlayerBio as BasePlayerBio } from '../../types/player.types';
import { playerBios as rawPlayerBios } from '../../data';
import { playerDataService } from '../../services/playerDataService';
import scrapedPositions from '../../data/processed/scraped_positions.json' with { type: 'json' };
import PlayerCard from '../../components/player/PlayerCard';
import DraftBoardControls from '../../components/draft-board/DraftBoardControls';
import { usePageTooltips } from '../../components/onboarding-tooltips/usePageTooltips';

const nameToPositionMap = new Map<string, string>(Object.entries(scrapedPositions));

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
  usePageTooltips('draftBoard');
  
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
    // Explicitly filter out null/undefined and cast to string[]
    const scouts = Array.from(new Set(reports.map(report => report.scout))).filter((scout): scout is string => typeof scout === 'string');
    return scouts;
  }, []);

  const playerTrueRanks = useMemo(() => {
    const sorted = [...playerBios];
  
    // Sort players based on the current sortBy criteria
    sorted.sort((a, b) => {
      const rankingA = getPlayerScoutRanking(a.playerId);
      const rankingB = getPlayerScoutRanking(b.playerId);
  
      if (!rankingA && !rankingB) return 0;
      if (!rankingA) return 1;
      if (!rankingB) return -1;
  
      if (sortBy === 'avgRank') {
        const avgA = calculateAverageRank(rankingA).avg;
        const avgB = calculateAverageRank(rankingB).avg;
        return avgA - avgB || calculateAverageRank(rankingB).count - calculateAverageRank(rankingA).count; // Tie-breaking by number of scout ranks
      } else {
        const rankA = Number(rankingA[sortBy]);
        const rankB = Number(rankingB[sortBy]);
        // Handle cases where ranks might be NaN or null, pushing them to the end
        const valA = isNaN(rankA) ? Infinity : rankA;
        const valB = isNaN(rankB) ? Infinity : rankB;
        return valA - valB;
      }
    });
  
    const map = new Map<number, number | null>();
    sorted.forEach((player, i) => {
      if (sortBy === 'avgRank') {
        // When sorting by average rank, store the sequential rank (1, 2, 3...)
        map.set(player.playerId, i + 1);
      } else {
        // When sorting by a specific scout, store that scout's actual rank
        const ranking = getPlayerScoutRanking(player.playerId);
        const scoutRank = ranking?.[sortBy] ?? null;
        map.set(player.playerId, scoutRank !== null ? Number(scoutRank) : null);
      }
    });
  
    return map;
  }, [sortBy]); // Dependency on sortBy

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
  
    
    if (selectedScout !== 'allScouts') {
      const scoutReports = playerDataService.getAllScoutingReports().filter(r => r.scout === selectedScout);
      const playerIdsWithReport = new Set(scoutReports.map(r => r.playerId));
      filteredPlayers = filteredPlayers.filter(player => playerIdsWithReport.has(player.playerId));
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
        return rankDataA.avg - rankDataB.avg || rankDataB.count - rankDataA.count;
      } else {
        const rankA = Number(rankingA[sortBy]);
        const rankB = Number(rankingB[sortBy]);
        return rankA - rankB;
      }
    });
  
    return filteredPlayers.slice(0, 60);
  }, [sortBy, positionFilter, schoolFilter, attributeFilter, selectedScout]);
  

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
      <div className="draft-board-controls">
        <DraftBoardControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedScout={selectedScout}
          setSelectedScout={setSelectedScout}
          positionFilter={positionFilter}
          setPositionFilter={setPositionFilter}
          schoolFilter={schoolFilter}
          setSchoolFilter={setSchoolFilter}
          attributeFilter={attributeFilter}
          setAttributeFilter={setAttributeFilter}
          condensedView={condensedView}
          setCondensedView={setCondensedView}
          scoutNames={scoutNames}
          availableScouts={availableScouts}
          playerBios={playerBios}
          nameToPositionMap={nameToPositionMap}
        />
      </div>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedPlayers.map((player, idx) => {
          const ranking = getPlayerScoutRanking(player.playerId);
          const scoutNames = ranking ? Object.keys(ranking).filter(key => key !== 'playerId') : [];
          const playerAvgRankData = calculateAverageRank(ranking);
          const playerAvgRank = playerAvgRankData.avg;

          return (
            <PlayerCard
              key={player.playerId}
              player={player}
              index={idx}
              condensed={condensedView}
              expandedPlayerId={expandedPlayerId}
              setExpandedPlayerId={setExpandedPlayerId}
              selectedScout={selectedScout}
              scoutNames={scoutNames}
              ranking={ranking}
              avgRank={playerAvgRank}
              sortBy={sortBy}
              sortedPlayers={sortedPlayers}
              trueRank={playerTrueRanks.get(player.playerId) ?? null}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default BigBoard; 