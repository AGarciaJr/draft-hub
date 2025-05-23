import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';

interface PlayerFiltersProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  filters: { leagueType: string; nationality: string; ageRange: string }; 
  setFilters: (filters: { leagueType: string; nationality: string; ageRange: string }) => void;
  uniqueLeagueTypes: string[];
  uniqueNationalities: string[];
}

const PlayerFilters: React.FC<PlayerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  uniqueLeagueTypes,
  uniqueNationalities,
}) => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
      <TextField
        label="Search Players"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>League Type</InputLabel>
        <Select
          value={filters.leagueType}
          label="League Type"
          onChange={(e) => setFilters({ ...filters, leagueType: e.target.value })}
        >
          {uniqueLeagueTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Nationality</InputLabel>
        <Select
          value={filters.nationality}
          label="Nationality"
          onChange={(e) => setFilters({ ...filters, nationality: e.target.value })}
        >
          {uniqueNationalities.map(nationality => (
            <MenuItem key={nationality} value={nationality}>{nationality}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Age Range Filter could go here if implemented */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <MenuItem value="avgRank">Average Rank</MenuItem>
          <MenuItem value="name-asc">Name (A-Z)</MenuItem>
          <MenuItem value="name-desc">Name (Z-A)</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default PlayerFilters; 