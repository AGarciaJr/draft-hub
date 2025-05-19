import React, { useState, useMemo } from 'react';
import { playerDataService } from '../services/playerDataService';
import { Box, Typography, TextField, Paper, Checkbox, FormControlLabel, Select, MenuItem, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { PlayerBio } from '../types/player.types'; // Assuming types are still needed
import rawData from '../data/intern_project_data.json'; // Import raw JSON data

// Define a type for the raw data structure if needed, or use a generic type
interface RawData {
  [key: string]: any;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'rankings' | 'measurements' | 'gameLogs' | 'seasonLogs' | 'scouting' | 'raw' >('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('name-asc');
  const [filters, setFilters] = useState({
    leagueType: 'All',
    nationality: 'All',
    ageRange: 'All',
  });

  const stats = playerDataService.getPlayerStats();
  const allPlayers = useMemo(() => playerDataService.getAllPlayers(), []);

  // Derived state based on search and filters
  const filteredPlayers = useMemo(() => {
    let players = allPlayers;

    // Apply search term
    if (searchTerm) {
      players = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters (adapt these based on available data and desired facets)
    if (filters.leagueType !== 'All') {
      players = players.filter(player => player.leagueType === filters.leagueType);
    }
    if (filters.nationality !== 'All') {
      players = players.filter(player => player.nationality === filters.nationality);
    }
    // Age range filtering would go here

    return players;
  }, [allPlayers, searchTerm, filters]);

  // Apply sorting
  const sortedPlayers = useMemo(() => {
    let players = [...filteredPlayers];
    if (sortBy === 'name-asc') {
      players.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      players.sort((a, b) => b.name.localeCompare(a.name));
    } // Add more sorting options here
    return players;
  }, [filteredPlayers, sortBy]);

  const handleSelectPlayer = (playerId: number, isSelected: boolean) => {
    setSelectedPlayers(prev =>
      isSelected ? [...prev, playerId] : prev.filter(id => id !== playerId)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPlayers(sortedPlayers.map(player => player.playerId));
    } else {
      setSelectedPlayers([]);
    }
  };

  const isAllSelected = selectedPlayers.length === sortedPlayers.length && sortedPlayers.length > 0;

  // Example data for facets (you would generate these from your allPlayers data)
  const uniqueLeagueTypes = useMemo(() => [
    'All', ...Array.from(new Set(allPlayers.map(player => player.leagueType))).sort()
  ], [allPlayers]);
  const uniqueNationalities = useMemo(() => [
    'All', ...Array.from(new Set(allPlayers.map(player => player.nationality))).sort()
  ], [allPlayers]);
  // Age ranges would need calculation and grouping

  // Overview Content using MUI Components
  const overviewContent = (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Player Statistics Overview
      </Typography>

      <Box sx={{ mt: 3 }}>
        {/* Basic Stats */}
        <Accordion elevation={1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Basic Statistics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', '& p': { mb: 1 } }}>
              <Typography><Typography component="span" fontWeight="medium">Total Players:</Typography> {stats.totalPlayers}</Typography>
              <Typography><Typography component="span" fontWeight="medium">Players with Photos:</Typography> {stats.playersWithPhotos}</Typography>
              <Typography><Typography component="span" fontWeight="medium">Average Height:</Typography> {stats.averageHeight.toFixed(1)} inches</Typography>
              <Typography><Typography component="span" fontWeight="medium">Average Weight:</Typography> {stats.averageWeight.toFixed(1)} lbs</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* League Distribution */}
        <Accordion elevation={1} sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">League Distribution</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', '& p': { mb: 0.5 } }}>
              {Object.entries(stats.playersByLeague)
                .sort(([, a], [, b]) => b - a)
                .map(([league, count]) => (
                  <Typography key={league}><Typography component="span" fontWeight="medium">{league}:</Typography> {count} players</Typography>
                ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Nationality Distribution */}
        <Accordion elevation={1} sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Nationality Distribution</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', '& p': { mb: 0.5 } }}>
              {Object.entries(stats.playersByNationality)
                .sort(([, a], [, b]) => b - a)
                .map(([nationality, count]) => (
                  <Typography key={nationality}><Typography component="span" fontWeight="medium">{nationality}:</Typography> {count} players</Typography>
                ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Age Distribution */}
        <Accordion elevation={1} sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Age Distribution</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', '& p': { mb: 0.5 } }}>
              {Object.entries(stats.ageDistribution)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([age, count]) => (
                  <Typography key={age}><Typography component="span" fontWeight="medium">Age {age}:</Typography> {count} players</Typography>
                ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );

  // Raw Data Content
  const rawDataContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>Raw Data</Typography>
      {
        Object.keys(rawData as RawData).map((key) => (
          <Accordion key={key} elevation={1} sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ overflowX: 'auto' }}>
                {Array.isArray((rawData as RawData)[key]) && (rawData as RawData)[key].length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {Object.keys((rawData as RawData)[key][0]).map((header) => (
                            <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rawData as RawData)[key].map((row: any, rowIndex: number) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((cellValue: any, cellIndex: number) => (
                              <TableCell key={cellIndex}>
                                {typeof cellValue === 'object' && cellValue !== null
                                  ? JSON.stringify(cellValue)
                                  : String(cellValue)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (typeof (rawData as RawData)[key] === 'object' && (rawData as RawData)[key] !== null) ? (
                  // Handle non-array objects or other types
                   <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify((rawData as RawData)[key], null, 2)}</code>
                    </pre>
                ) : (
                  <Typography variant="body2">{String((rawData as RawData)[key])}</Typography>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      }
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={activeTab === 'overview' ? 'contained' : 'text'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'players' ? 'contained' : 'text'}
            onClick={() => setActiveTab('players')}
          >
            Players
          </Button>
          {/* Add other tabs here */}
          <Button
            variant={activeTab === 'raw' ? 'contained' : 'text'}
            onClick={() => setActiveTab('raw')}
          >
            Raw Data
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      {
        activeTab === 'overview' && (
          <Box>
            {overviewContent}
          </Box>
        )
      }
      {
        activeTab === 'players' && (
          <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 150px)', bgcolor: '#f4f6f8' }}> {/* Adjust height as needed */}
            {/* Sidebar */}
            <Box sx={{ width: 280, p: 2, borderRight: '1px solid #ddd', bgcolor: '#fff', flexShrink: 0 }}>
              <Typography variant="h6" gutterBottom>Current Search</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Find as you type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filteredPlayers.length} search results found
              </Typography>
              {/* Example Facets (adapt based on data) */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>League Type</Typography>
              <Select
                fullWidth
                size="small"
                value={filters.leagueType}
                onChange={(e) => setFilters({...filters, leagueType: e.target.value})}
                sx={{ mb: 2 }}
              >
                {uniqueLeagueTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>

              <Typography variant="subtitle1" gutterBottom>Nationality</Typography>
              <Select
                fullWidth
                size="small"
                value={filters.nationality}
                onChange={(e) => setFilters({...filters, nationality: e.target.value})}
                sx={{ mb: 2 }}
              >
                {uniqueNationalities.map(nat => <MenuItem key={nat} value={nat}>{nat}</MenuItem>)}
              </Select>
              {/* Add Age Facet here */}

            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
              {/* Filter/Action Bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Typography variant="h6">Actions:</Typography>
                <Select size="small" value="" displayEmpty> {/* Add actions here */}
                  <MenuItem value="">Select Action from Drop-down</MenuItem>
                </Select>
                <Button variant="contained" size="small">Perform</Button>

                <Typography variant="h6" sx={{ ml: 'auto' }}>Sort by:</Typography>
                <Select size="small" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                   <MenuItem value="name-asc">Name - ascending</MenuItem>
                   <MenuItem value="name-desc">Name - descending</MenuItem>
                   {/* Add other sort options */} 
                </Select>

                <Typography variant="h6" sx={{ ml: 2 }}>Parties in this search:</Typography>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  {filteredPlayers.length}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Select All and Player List */}
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={selectedPlayers.length > 0 && !isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  }
                  label={`Select All ${sortedPlayers.length > 0 ? `All ${sortedPlayers.length} parties on this page are selected. Select all parties that match this search` : ''}`}
                  sx={{ mb: 2 }}
                />

                {/* Player List Items */}
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {sortedPlayers.map(player => (
                    <Paper key={player.playerId} elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Checkbox
                        checked={selectedPlayers.includes(player.playerId)}
                        onChange={(e) => handleSelectPlayer(player.playerId, e.target.checked)}
                      />
                      {/* Image Placeholder or Player Photo */}
                      <Box sx={{ width: 60, height: 60, bgcolor: 'grey.300', borderRadius: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                         {player.photoUrl ? (
                           <img src={player.photoUrl} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                         ) : (
                           <Typography variant="caption">Image</Typography>
                         )}
                      </Box>
                      {/* Player Details */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{player.name}</Typography>
                        {/* Adapt these fields based on available player data */}
                        <Typography variant="body2" color="text.secondary">{player.currentTeam} | {player.league}</Typography>
                        <Typography variant="body2" color="text.secondary">{player.height} inches | {player.weight} lbs</Typography>
                        {/* Add more relevant details here */} 
                      </Box>
                      {/* Optional: Add scout ranking highlights or other badges here */} 
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )
      }
      {
        activeTab === 'raw' && (
          <Box>
            {rawDataContent}
          </Box>
        )
      }
      {/* Add content for other tabs here */}

    </Container>
  );
};

export default AdminDashboard; 