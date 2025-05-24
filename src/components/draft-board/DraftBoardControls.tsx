import React from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import type { PlayerBio as BasePlayerBio } from '../../types/player.types';

interface DraftBoardControlsProps {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  selectedScout: string;
  setSelectedScout: (selectedScout: string) => void;
  positionFilter: string;
  setPositionFilter: (positionFilter: string) => void;
  schoolFilter: string;
  setSchoolFilter: (schoolFilter: string) => void;
  attributeFilter: string;
  setAttributeFilter: (attributeFilter: string) => void;
  condensedView: boolean;
  setCondensedView: (condensedView: boolean) => void;
  scoutNames: string[];
  availableScouts: (string | undefined | null)[];
  playerBios: BasePlayerBio[];
  nameToPositionMap: Map<string, string>;
}

const DraftBoardControls: React.FC<DraftBoardControlsProps> = ({
  sortBy,
  setSortBy,
  selectedScout,
  setSelectedScout,
  positionFilter,
  setPositionFilter,
  schoolFilter,
  setSchoolFilter,
  attributeFilter,
  setAttributeFilter,
  condensedView,
  setCondensedView,
  scoutNames,
  availableScouts,
  playerBios,
  nameToPositionMap,
}) => {
  return (
    <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {/* Sort */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ color: '#fff' }}>Sort By</InputLabel>
        <Select 
          value={sortBy} 
          label="Sort By" 
          onChange={(e) => setSortBy(e.target.value)} 
          sx={{ 
            color: '#fff',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
          }}
        >
          <MenuItem value="avgRank">Average Rank</MenuItem>
          {scoutNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ color: '#fff' }}>Reports By</InputLabel>
        <Select 
          value={selectedScout} 
          label="Reports By" 
          onChange={(e) => setSelectedScout(e.target.value)} 
          sx={{ 
            color: '#fff',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
          }}
        >
          <MenuItem value="allScouts">All Scouts</MenuItem>
          {availableScouts
            .filter((scout): scout is string => typeof scout === 'string')
            .map(scout => (
              <MenuItem key={scout} value={scout}>
                {scout}
              </MenuItem>
          ))}

        </Select>
      </FormControl>


      {/* Filters */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ color: '#fff' }}>Position</InputLabel>
        <Select 
          value={positionFilter} 
          label="Position" 
          onChange={(e) => setPositionFilter(e.target.value as string)} 
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
          onChange={(e) => setSchoolFilter(e.target.value as string)} 
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
          onChange={(e) => setAttributeFilter(e.target.value as string)} 
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

      {/* Scout Reports By filter remains in BigBoard for now */}
    </Box>
  );
};

export default DraftBoardControls; 