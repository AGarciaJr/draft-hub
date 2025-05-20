import React, { useState, useMemo } from 'react';
import { playerDataService } from '../services/playerDataService';
import { Box, Typography, TextField, Paper, Checkbox, FormControlLabel, Select, MenuItem, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import rawData from '../data/intern_project_data.json'; // Import raw JSON data

// Define a type for the raw data structure if needed, or use a generic type
interface RawData {
  [key: string]: any;
}

// Define interfaces for scout data types
interface ScoutData {
  rankedCount: number;
  reports: any[];
}

interface ScoutStat {
  scoutName: string;
  scoutData: ScoutData;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'rankings' | 'measurements' | 'gameLogs' | 'seasonLogs' | 'scouting' | 'raw' >('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('avgRank');
  const [filters, setFilters] = useState({
    leagueType: 'All',
    nationality: 'All',
    ageRange: 'All',
  });
  const [rawDataSortBy, setRawDataSortBy] = useState<'name' | 'avgRank' | 'id'>('avgRank');
  const [rawDataFilter, setRawDataFilter] = useState({
    search: '',
    leagueType: 'All',
    nationality: 'All'
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

  // Calculate average ranking for a player from grouped data
  const calculateAverageRank = (playerGroupedData: { [category: string]: any[] | any }) => {
    const rankings = playerGroupedData.scoutRankings?.[0]; // Access the first item in the scoutRankings array
    if (!rankings) return Infinity; // Return Infinity if no rankings object exists

    const rankValues: number[] = Object.entries(rankings)
      .filter(([key]) => key !== 'playerId')
      .map(([, value]) => Number(value))
      .filter(value => !isNaN(value));

    return rankValues.length > 0
      ? rankValues.reduce((sum, rank) => sum + rank, 0) / rankValues.length
      : Infinity;
  };

  // Apply sorting to filtered players
  const sortedPlayers = useMemo(() => {
    let players = [...filteredPlayers];
    
    switch (sortBy) {
      case 'avgRank':
        players.sort((a, b) => {
          const rankA = calculateAverageRank(a);
          const rankB = calculateAverageRank(b);
          return rankA - rankB;
        });
        break;
      case 'name-asc':
        players.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        players.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // Add more sorting options as needed
    }
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

  // Example data for facets (you would generate these from the allPlayers data)
  const uniqueLeagueTypes = useMemo(() => [
    'All', ...Array.from(new Set(allPlayers.map(player => player.leagueType))).sort()
  ], [allPlayers]);
  const uniqueNationalities = useMemo(() => [
    'All', ...Array.from(new Set(allPlayers.map(player => player.nationality))).sort()
  ], [allPlayers]);
  // Age ranges would need calculation and grouping

  // Group raw data by playerID
  const groupedRawData = useMemo(() => {
    const grouped: { [playerId: number]: { [category: string]: any[] | any } } = {};

    Object.keys(rawData as RawData).forEach(category => {
      const data = (rawData as RawData)[category];

      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item.playerId !== undefined) {
            if (!grouped[item.playerId]) {
              grouped[item.playerId] = {};
            }
            if (!grouped[item.playerId][category]) {
                 grouped[item.playerId][category] = [];
            }
            // If it's an array in the original data, push the item
            grouped[item.playerId][category].push(item);
          }
        });
      } else if (typeof data === 'object' && data !== null) {
          // Handle cases where a category might be a single object with playerID
           if (data.playerId !== undefined) {
             if (!grouped[data.playerId]) {
               grouped[data.playerId] = {};
             }
             // If it's a single object, assign it directly
             grouped[data.playerId][category] = data;
           }
      }
       // Note: Data types other than arrays of objects or single objects with playerID will be ignored in this grouping.
    });

    // Optional: Sort player IDs for consistent display
    const sortedPlayerIds = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));
    const sortedGroupedData: typeof grouped = {};
    sortedPlayerIds.forEach(id => {
        sortedGroupedData[parseInt(id)] = grouped[parseInt(id)];
    });

    return sortedGroupedData;
  }, [rawData]); // Dependency on rawData ensures re-grouping if data changes (though unlikely for this file)

  // Calculate scout statistics for the five specific scouts (ranked count and reports)
  const scoutStats: ScoutStat[] = useMemo(() => {
    const specificScouts = ['ESPN Rank', 'Sam Vecenie Rank', 'Kevin O\'Connor Rank', 'Kyle Boone Rank', 'Gary Parrish Rank'];
    const stats: { [scoutName: string]: ScoutData } = {};

    // Initialize stats for the specific scouts
    specificScouts.forEach(scoutKey => {
      stats[scoutKey] = { rankedCount: 0, reports: [] };
    });

    // Process rankings to count how many players each scout ranked
    if (Array.isArray(rawData.scoutRankings)) {
      rawData.scoutRankings.forEach((playerRankingEntry: any) => {
        specificScouts.forEach(scoutKey => {
          const hasScoutKey = playerRankingEntry.hasOwnProperty(scoutKey);
          const isRankNotNull = playerRankingEntry[scoutKey] != null;
          if (hasScoutKey && isRankNotNull) {
            stats[scoutKey].rankedCount++;
          }
        });
      });
    }

    // Process reports for the specific scouts
    if (Array.isArray(rawData.scoutingReports)) {
      rawData.scoutingReports.forEach((report: any) => {
        const scoutNameFromReport = report.scout;
        // Find the corresponding key in specificScouts array
        const scoutKey = specificScouts.find(key => 
          key.startsWith(scoutNameFromReport.replace(' Rank', ''))
        );

        if (scoutKey && stats[scoutKey]) {
          stats[scoutKey].reports.push(report);
        }
      });
    }

    // Return stats as an array of objects { scoutName (display name), scoutData }
    return specificScouts.map(scoutKey => ({
      scoutName: scoutKey.replace(' Rank', ''),
      scoutData: stats[scoutKey]
    }));
  }, [rawData.scoutRankings, rawData.scoutingReports]);

  // Calculate average ranking for a player from grouped data
  const calculateAverageRankRawData = (playerGroupedData: { [category: string]: any[] | any }) => {
    const rankingsArray = playerGroupedData.scoutRankings; // This should be an array with one ranking object
    if (!Array.isArray(rankingsArray) || rankingsArray.length === 0) return Infinity;

    const rankings = rankingsArray[0]; // Get the single ranking object
    if (!rankings) return Infinity;

    const rankValues: number[] = Object.entries(rankings)
      .filter(([key]) => key !== 'playerId' && rankings[key] != null) // Filter out null/undefined ranks as well
      .map(([, value]) => Number(value))
      .filter(value => !isNaN(value));

    const count = rankValues.length; // This is the number of scouts who provided a valid rank

    return count > 0
      ? rankValues.reduce((sum, rank) => sum + rank, 0) / count // Sum of valid rankings / Number of valid ranked scouts
      : Infinity;
  };

  // Apply sorting and filtering to raw data
  const processedRawData = useMemo(() => {
    let filteredEntries = Object.entries(groupedRawData);

    // Apply filters
    if (rawDataFilter.search) {
      filteredEntries = filteredEntries.filter(([_, data]) => {
        const bio = data.bio?.[0];
        return bio?.name?.toLowerCase().includes(rawDataFilter.search.toLowerCase());
      });
    }

    if (rawDataFilter.leagueType !== 'All') {
      filteredEntries = filteredEntries.filter(([_, data]) => {
        const bio = data.bio?.[0];
        return bio?.leagueType === rawDataFilter.leagueType;
      });
    }

    if (rawDataFilter.nationality !== 'All') {
      filteredEntries = filteredEntries.filter(([_, data]) => {
        const bio = data.bio?.[0];
        return bio?.nationality === rawDataFilter.nationality;
      });
    }

    // Sort the filtered data
    filteredEntries.sort(([idA, dataA], [idB, dataB]) => {
      const bioA = dataA.bio?.[0];
      const bioB = dataB.bio?.[0];

      switch (rawDataSortBy) {
        case 'name':
          return (bioA?.name || '').localeCompare(bioB?.name || '');
        case 'avgRank':
          // Use the specific raw data average rank calculation
          const avgRankA = calculateAverageRankRawData(dataA);
          const avgRankB = calculateAverageRankRawData(dataB);
          // console.log(`Comparing Player ${idA} (Avg Rank: ${avgRankA}) with Player ${idB} (Avg Rank: ${avgRankB})`); // Remove console.log after debugging
          return avgRankA - avgRankB;
        case 'id':
          return parseInt(idA) - parseInt(idB);
        default:
          return 0;
      }
    });

    // Return the sorted array directly
    return filteredEntries;
  }, [groupedRawData, rawDataSortBy, rawDataFilter]);

  // Overview Content using MUI Components
  const overviewContent = (
    <Box sx={{ px: 2, py: 4, maxWidth: 600, mx: 'auto' }}>
      {/* Player Statistics Overview */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
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
                    ))
                }
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
                    ))
                }
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
                    ))
                }
                </Box>
              </AccordionDetails>
            </Accordion>
        </Box>
      </Paper>

      {/* Scout Statistics Overview */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Scout Statistics Overview
        </Typography>
        <Box sx={{ mt: 3 }}>
          {scoutStats.map(({ scoutName, scoutData }) => (
            <Accordion key={scoutName} elevation={1} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">{scoutName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ mb: 1 }}>Players Ranked: {scoutData?.rankedCount ?? 0}</Typography>
                
                {/* Scouting Reports Section */}
                {scoutData?.reports && scoutData.reports.length > 0 ? (
                    <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #eee' }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Scouting Reports ({scoutData.reports.length})</Typography>
                        <Box>
                            {scoutData.reports.map((report: any, index: number) => (
                                <Box key={report.reportId || index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                                    <Typography variant="body2" fontWeight="medium">Player ID: {report.playerId}</Typography>
                                    <Typography variant="body2" color="text.secondary">Report:</Typography>
                                    <Typography variant="body2">{report.report}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : (scoutData && (
                    <Typography variant="body2" color="text.secondary">No scouting reports available for this scout.</Typography>
                ))}

                {/* Add more scout-specific details here later */}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Box>
  );

  // Raw Data Content
  const rawDataContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>Raw Data by Player</Typography>
      
      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          label="Search Players"
          value={rawDataFilter.search}
          onChange={(e) => setRawDataFilter(prev => ({ ...prev, search: e.target.value }))}
          sx={{ width: 200 }}
        />
        
        <Select
          size="small"
          value={rawDataFilter.leagueType}
          onChange={(e) => setRawDataFilter(prev => ({ ...prev, leagueType: e.target.value }))}
          sx={{ width: 150 }}
        >
          <MenuItem value="All">All Leagues</MenuItem>
          {uniqueLeagueTypes.filter(type => type !== 'All').map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={rawDataFilter.nationality}
          onChange={(e) => setRawDataFilter(prev => ({ ...prev, nationality: e.target.value }))}
          sx={{ width: 150 }}
        >
          <MenuItem value="All">All Nationalities</MenuItem>
          {uniqueNationalities.filter(nat => nat !== 'All').map(nat => (
            <MenuItem key={nat} value={nat}>{nat}</MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={rawDataSortBy}
          onChange={(e) => setRawDataSortBy(e.target.value as 'name' | 'avgRank' | 'id')}
          sx={{ width: 150 }}
        >
          <MenuItem value="avgRank">Sort by Avg Rank</MenuItem>
          <MenuItem value="name">Sort by Name</MenuItem>
          <MenuItem value="id">Sort by ID</MenuItem>
        </Select>
      </Stack>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {processedRawData.length} players
      </Typography>

      {/* Player list */}
      {
        processedRawData.length > 0 ? (
          processedRawData.map(([playerId, playerCategories]) => {
            const playerBio = Array.isArray(playerCategories.bio) ? playerCategories.bio[0] : null;
            const playerName = playerBio?.name || `Player ${playerId}`;
            const avgRank = calculateAverageRankRawData(playerCategories);
            const rankDisplay = avgRank === Infinity ? 'N/A' : avgRank.toFixed(1);

    return (
              <Accordion key={playerId} elevation={1} sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{playerName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      (ID: {playerId} | Avg Rank: {rankDisplay})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    {
                      Object.keys(playerCategories).map((category) => {
                        const categoryData = playerCategories[category];

                        return (
                          <Box key={category} sx={{ mb: 2 }}>
                             <Typography variant="h6" component="h3" gutterBottom>{category.charAt(0).toUpperCase() + category.slice(1)} Data</Typography>
                             {
                                Array.isArray(categoryData) && categoryData.length > 0 ? (
                                  <TableContainer component={Paper} sx={{ mt: 1 }}>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          {Object.keys(categoryData[0]).map((header) => (
                                            <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {categoryData.map((row: any, rowIndex: number) => (
                                          <TableRow key={rowIndex}>
                                            {Object.values(row).map((cellValue: any, cellIndex: number) => (
                                              <TableCell key={cellIndex}>
                                                {typeof cellValue === 'object' && cellValue !== null
                                                  ? JSON.stringify(cellValue, null, 2)
                                                  : String(cellValue)}
                                              </TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                ) : (typeof categoryData === 'object' && categoryData !== null) ? (
                                   <pre style={{ margin: 0, overflowX: 'auto' }}>
                                      <code>{JSON.stringify(categoryData, null, 2)}</code>
                                    </pre>
                                ) : (
                                  <Typography variant="body2">{String(categoryData)}</Typography>
                                )
                             }
                          </Box>
                        );
                      })
                    }
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography>No players match the current filters.</Typography>
        )
      }
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Add other tabs here */}
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
                  <MenuItem value="avgRank">Average Rank</MenuItem>
                  <MenuItem value="name-asc">Name - ascending</MenuItem>
                  <MenuItem value="name-desc">Name - descending</MenuItem>
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