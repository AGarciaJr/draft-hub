import React, { useState, useMemo } from 'react';
import { playerDataService } from '../services/playerDataService';
import { Box, Typography, TextField, Paper, Checkbox, FormControlLabel, Select, MenuItem, Button, Divider } from '@mui/material';
//import type { PlayerBio, ScoutRanking, PlayerMeasurements, GameLog, SeasonLog, ScoutingReport } from '../types/player.types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'rankings' | 'measurements' | 'gameLogs' | 'seasonLogs' | 'scouting'>('overview');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
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

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  const renderOverview = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Player Statistics Overview</h2>

        <div className="space-y-4">
          {/* Basic Stats */}
          <div className="rounded-lg border border-gray-200 bg-gray-50">
            <button
              className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg"
              onClick={() => toggleDropdown('basicStats')}
            >
              <span>Basic Statistics</span>
              <span>{openDropdowns.basicStats ? '▲' : '▼'}</span>
            </button>
            {openDropdowns.basicStats && (
              <div className="p-4 pt-0">
                <div className="space-y-2 text-center">
                  <p><span className="font-medium">Total Players:</span> {stats.totalPlayers}</p>
                  <p><span className="font-medium">Players with Photos:</span> {stats.playersWithPhotos}</p>
                  <p><span className="font-medium">Average Height:</span> {stats.averageHeight.toFixed(1)} inches</p>
                  <p><span className="font-medium">Average Weight:</span> {stats.averageWeight.toFixed(1)} lbs</p>
                </div>
              </div>
            )}
          </div>

          {/* League Distribution */}
          <div className="rounded-lg border border-gray-200 bg-gray-50">
            <button
              className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg"
              onClick={() => toggleDropdown('leagueDistribution')}
            >
              <span>League Distribution</span>
              <span>{openDropdowns.leagueDistribution ? '▲' : '▼'}</span>
            </button>
            {openDropdowns.leagueDistribution && (
              <div className="p-4 pt-0">
                <div className="space-y-2 text-center">
                  {Object.entries(stats.playersByLeague)
                    .sort(([, a], [, b]) => b - a)
                    .map(([league, count]) => (
                      <p key={league}><span className="font-medium">{league}:</span> {count} players</p>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Nationality Distribution */}
          <div className="rounded-lg border border-gray-200 bg-gray-50">
            <button
              className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg"
              onClick={() => toggleDropdown('nationalityDistribution')}
            >
              <span>Nationality Distribution</span>
              <span>{openDropdowns.nationalityDistribution ? '▲' : '▼'}</span>
            </button>
            {openDropdowns.nationalityDistribution && (
              <div className="p-4 pt-0">
                <div className="space-y-2 text-center">
                  {Object.entries(stats.playersByNationality)
                    .sort(([, a], [, b]) => b - a)
                    .map(([nationality, count]) => (
                      <p key={nationality}><span className="font-medium">{nationality}:</span> {count} players</p>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Age Distribution */}
          <div className="rounded-lg border border-gray-200 bg-gray-50">
            <button
              className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg"
              onClick={() => toggleDropdown('ageDistribution')}
            >
              <span>Age Distribution</span>
              <span>{openDropdowns.ageDistribution ? '▲' : '▼'}</span>
            </button>
            {openDropdowns.ageDistribution && (
              <div className="p-4 pt-0">
                <div className="space-y-2 text-center">
                  {Object.entries(stats.ageDistribution)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([age, count]) => (
                      <p key={age}><span className="font-medium">Age {age}:</span> {count} players</p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlayers = () => (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
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
          {/* <Button variant="contained" size="small">Sort</Button> */}

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
  );

  const renderPlayerDetails = () => {
    if (!selectedPlayer) return null;

    const player = playerDataService.getPlayerById(selectedPlayer);
    const rankings = playerDataService.getPlayerRankings(selectedPlayer);
    const measurements = playerDataService.getPlayerMeasurements(selectedPlayer);
    const gameLogs = playerDataService.getPlayerGameLogs(selectedPlayer);
    const seasonLogs = playerDataService.getPlayerSeasonLogs(selectedPlayer);
    const scoutingReports = playerDataService.getPlayerScoutingReports(selectedPlayer);

    if (!player) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <button
              onClick={() => setSelectedPlayer(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Basic Info</h3>
              <p>Team: {player.currentTeam}</p>
              <p>League: {player.league}</p>
              <p>Nationality: {player.nationality}</p>
              <p>Height: {player.height} inches</p>
              <p>Weight: {player.weight} lbs</p>
            </div>

            {rankings && (
              <div>
                <h3 className="font-semibold mb-2">Scout Rankings</h3>
                <p>ESPN: {rankings["ESPN Rank"]}</p>
                <p>Sam Vecenie: {rankings["Sam Vecenie Rank"]}</p>
                <p>Kevin O'Connor: {rankings["Kevin O'Connor Rank"]}</p>
                <p>Kyle Boone: {rankings["Kyle Boone Rank"]}</p>
                <p>Gary Parrish: {rankings["Gary Parrish Rank"]}</p>
              </div>
            )}

            {measurements && (
              <div>
                <h3 className="font-semibold mb-2">Measurements</h3>
                <p>Wingspan: {measurements.wingspan} inches</p>
                <p>Reach: {measurements.reach} inches</p>
                <p>Max Vertical: {measurements.maxVertical} inches</p>
                <p>Hand Length: {measurements.handLength} inches</p>
                <p>Hand Width: {measurements.handWidth} inches</p>
              </div>
            )}

            {gameLogs.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Recent Games</h3>
                <div className="max-h-40 overflow-y-auto">
                  {gameLogs.slice(0, 5).map((log) => (
                    <div key={log.gameId} className="mb-2">
                      <p>{log.date} vs {log.opponent}</p>
                      <p>PTS: {log.pts} | REB: {log.reb} | AST: {log.ast}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {seasonLogs.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Season Stats</h3>
                {seasonLogs.map((log) => (
                  <div key={`${log.playerId}-${log.Season}`} className="mb-2">
                    <p>Season: {log.Season}</p>
                    <p>PPG: {log.PTS} | RPG: {log.REB} | APG: {log.AST}</p>
                  </div>
                ))}
              </div>
            )}

            {scoutingReports.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Scouting Reports</h3>
                {scoutingReports.map((report) => (
                  <div key={report.reportId} className="mb-2">
                    <p className="font-medium">Scout: {report.scout}</p>
                    <p className="text-sm">{report.report}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <nav className="ml-6 flex space-x-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('players')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'players' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Players
                </button>
                <button
                  onClick={() => setActiveTab('rankings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'rankings' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Rankings
                </button>
                <button
                  onClick={() => setActiveTab('measurements')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'measurements' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Measurements
                </button>
                <button
                  onClick={() => setActiveTab('gameLogs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'gameLogs' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Game Logs
                </button>
                <button
                  onClick={() => setActiveTab('seasonLogs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'seasonLogs' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Season Logs
                </button>
                <button
                  onClick={() => setActiveTab('scouting')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'scouting' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Scouting
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'players' && renderPlayers()}
        {/* Add other tab content renderers here */}
      </main>

      {selectedPlayer && renderPlayerDetails()}
    </div>
  );
};

export default AdminDashboard; 