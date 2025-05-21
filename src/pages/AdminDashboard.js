import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { playerDataService } from '../services/playerDataService';
import { Box, Typography, TextField, Paper, Checkbox, FormControlLabel, Select, MenuItem, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import rawData from '../data/intern_project_data.json'; // Import raw JSON data
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [sortBy, setSortBy] = useState('avgRank');
    const [filters, setFilters] = useState({
        leagueType: 'All',
        nationality: 'All',
        ageRange: 'All',
    });
    const [rawDataSortBy, setRawDataSortBy] = useState('avgRank');
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
            players = players.filter(player => player.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
    const calculateAverageRank = (playerGroupedData) => {
        const rankings = playerGroupedData.scoutRankings?.[0];
        if (!rankings)
            return Infinity;
        const rankValues = Object.entries(rankings)
            .filter(([key]) => key !== 'playerId')
            .map(([, value]) => Number(value))
            .filter(value => !isNaN(value));
        return rankValues.length > 0
            ? rankValues.reduce((sum, rank) => sum + rank, 0) / rankValues.length
            : Infinity;
    };
    // Apply sorting to filtered players
    const sortedPlayers = useMemo(() => {
        const players = [...filteredPlayers];
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
        }
        return players;
    }, [filteredPlayers, sortBy]);
    const handleSelectPlayer = (playerId, isSelected) => {
        setSelectedPlayers(prev => isSelected ? [...prev, playerId] : prev.filter(id => id !== playerId));
    };
    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedPlayers(sortedPlayers.map(player => player.playerId));
        }
        else {
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
    // Update the groupedRawData type and data handling
    const groupedRawData = useMemo(() => {
        const grouped = {};
        Object.keys(rawData).forEach(category => {
            const data = rawData[category];
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    if (item.playerId !== undefined) {
                        if (!grouped[item.playerId]) {
                            grouped[item.playerId] = {};
                        }
                        if (!grouped[item.playerId][category]) {
                            grouped[item.playerId][category] = [];
                        }
                        grouped[item.playerId][category].push(item);
                    }
                });
            }
            else if (typeof data === 'object' && data !== null) {
                const typedData = data;
                if (typedData.playerId !== undefined) {
                    if (!grouped[typedData.playerId]) {
                        grouped[typedData.playerId] = {};
                    }
                    grouped[typedData.playerId][category] = data;
                }
            }
        });
        return grouped;
    }, []);
    // Calculate scout statistics for the five specific scouts (ranked count and reports)
    const scoutStats = useMemo(() => {
        const specificScouts = ['ESPN Rank', 'Sam Vecenie Rank', 'Kevin O\'Connor Rank', 'Kyle Boone Rank', 'Gary Parrish Rank'];
        const stats = {};
        // Initialize stats for the specific scouts
        specificScouts.forEach(scoutKey => {
            stats[scoutKey] = { rankedCount: 0, reports: [] };
        });
        // Process rankings to count how many players each scout ranked
        if (Array.isArray(rawData.scoutRankings)) {
            rawData.scoutRankings.forEach((playerRankingEntry) => {
                specificScouts.forEach(scoutKey => {
                    const hasScoutKey = Object.prototype.hasOwnProperty.call(playerRankingEntry, scoutKey);
                    const isRankNotNull = playerRankingEntry[scoutKey] != null;
                    if (hasScoutKey && isRankNotNull) {
                        stats[scoutKey].rankedCount++;
                    }
                });
            });
        }
        // Process reports for the specific scouts
        if (Array.isArray(rawData.scoutingReports)) {
            rawData.scoutingReports.forEach((report) => {
                const scoutNameFromReport = report.scout;
                // Find the corresponding key in specificScouts array
                const scoutKey = specificScouts.find(key => key.startsWith(scoutNameFromReport.replace(' Rank', '')));
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
    }, []); // Remove rawData dependencies
    // Calculate average ranking for a player from grouped data
    const calculateAverageRankRawData = (playerGroupedData) => {
        const rankingsArray = playerGroupedData.scoutRankings; // This should be an array with one ranking object
        if (!Array.isArray(rankingsArray) || rankingsArray.length === 0)
            return Infinity;
        const rankings = rankingsArray[0]; // Get the single ranking object
        if (!rankings)
            return Infinity;
        const rankValues = Object.entries(rankings)
            .filter(([key]) => key !== 'playerId' && rankings[key] != null) // Filter out null/undefined ranks as well
            .map(([, value]) => Number(value))
            .filter(value => !isNaN(value));
        const count = rankValues.length;
        return count > 0
            ? rankValues.reduce((sum, rank) => sum + rank, 0) / count
            : Infinity;
    };
    // Update the filter functions
    const processedRawData = useMemo(() => {
        let filteredEntries = Object.entries(groupedRawData);
        if (rawDataFilter.search) {
            filteredEntries = filteredEntries.filter(([, data]) => {
                const bio = data.bio?.[0];
                return bio?.name?.toLowerCase().includes(rawDataFilter.search.toLowerCase());
            });
        }
        if (rawDataFilter.leagueType !== 'All') {
            filteredEntries = filteredEntries.filter(([, data]) => {
                const bio = data.bio?.[0];
                return bio?.leagueType === rawDataFilter.leagueType;
            });
        }
        if (rawDataFilter.nationality !== 'All') {
            filteredEntries = filteredEntries.filter(([, data]) => {
                const bio = data.bio?.[0];
                return bio?.nationality === rawDataFilter.nationality;
            });
        }
        // Sort the filtered data
        filteredEntries.sort(([idA, dataA], [idB, dataB]) => {
            const bioA = dataA.bio?.[0];
            const bioB = dataB.bio?.[0];
            switch (rawDataSortBy) {
                case 'name': {
                    const nameA = (bioA?.name || '').toLowerCase();
                    const nameB = (bioB?.name || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                }
                case 'avgRank': {
                    const avgRankA = calculateAverageRankRawData(dataA);
                    const avgRankB = calculateAverageRankRawData(dataB);
                    return avgRankA - avgRankB;
                }
                case 'id': {
                    return parseInt(idA) - parseInt(idB);
                }
                default:
                    return 0;
            }
        });
        return filteredEntries;
    }, [groupedRawData, rawDataSortBy, rawDataFilter]);
    // Overview Content using MUI Components
    const overviewContent = (_jsxs(Box, { sx: { px: 2, py: 4, maxWidth: 600, mx: 'auto' }, children: [_jsxs(Paper, { sx: { p: 3, borderRadius: 2, mb: 4 }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, align: "center", children: "Player Statistics Overview" }), _jsxs(Box, { sx: { mt: 3 }, children: [_jsxs(Accordion, { elevation: 1, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: "Basic Statistics" }) }), _jsx(AccordionDetails, { children: _jsxs(Box, { sx: { textAlign: 'center', '& p': { mb: 1 } }, children: [_jsxs(Typography, { children: [_jsx(Typography, { component: "span", fontWeight: "medium", children: "Total Players:" }), " ", stats.totalPlayers] }), _jsxs(Typography, { children: [_jsx(Typography, { component: "span", fontWeight: "medium", children: "Players with Photos:" }), " ", stats.playersWithPhotos] }), _jsxs(Typography, { children: [_jsx(Typography, { component: "span", fontWeight: "medium", children: "Average Height:" }), " ", stats.averageHeight.toFixed(1), " inches"] }), _jsxs(Typography, { children: [_jsx(Typography, { component: "span", fontWeight: "medium", children: "Average Weight:" }), " ", stats.averageWeight.toFixed(1), " lbs"] })] }) })] }), _jsxs(Accordion, { elevation: 1, sx: { mt: 1 }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: "League Distribution" }) }), _jsx(AccordionDetails, { children: _jsx(Box, { sx: { textAlign: 'center', '& p': { mb: 0.5 } }, children: Object.entries(stats.playersByLeague)
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([league, count]) => (_jsxs(Typography, { children: [_jsxs(Typography, { component: "span", fontWeight: "medium", children: [league, ":"] }), " ", count, " players"] }, league))) }) })] }), _jsxs(Accordion, { elevation: 1, sx: { mt: 1 }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: "Nationality Distribution" }) }), _jsx(AccordionDetails, { children: _jsx(Box, { sx: { textAlign: 'center', '& p': { mb: 0.5 } }, children: Object.entries(stats.playersByNationality)
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([nationality, count]) => (_jsxs(Typography, { children: [_jsxs(Typography, { component: "span", fontWeight: "medium", children: [nationality, ":"] }), " ", count, " players"] }, nationality))) }) })] }), _jsxs(Accordion, { elevation: 1, sx: { mt: 1 }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: "Age Distribution" }) }), _jsx(AccordionDetails, { children: _jsx(Box, { sx: { textAlign: 'center', '& p': { mb: 0.5 } }, children: Object.entries(stats.ageDistribution)
                                                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                                .map(([age, count]) => (_jsxs(Typography, { children: [_jsxs(Typography, { component: "span", fontWeight: "medium", children: ["Age ", age, ":"] }), " ", count, " players"] }, age))) }) })] })] })] }), _jsxs(Paper, { sx: { p: 3, borderRadius: 2 }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, align: "center", children: "Scout Statistics Overview" }), _jsx(Box, { sx: { mt: 3 }, children: scoutStats.map(({ scoutName, scoutData }) => (_jsxs(Accordion, { elevation: 1, sx: { mt: 1 }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: scoutName }) }), _jsxs(AccordionDetails, { children: [_jsxs(Typography, { variant: "body2", sx: { mb: 1 }, children: ["Players Ranked: ", scoutData?.rankedCount ?? 0] }), scoutData?.reports && scoutData.reports.length > 0 ? (_jsxs(Box, { sx: { mt: 1, pl: 2, borderLeft: '2px solid #eee' }, children: [_jsxs(Typography, { variant: "subtitle2", fontWeight: "bold", gutterBottom: true, children: ["Scouting Reports (", scoutData.reports.length, ")"] }), _jsx(Box, { children: scoutData.reports.map((report, index) => (_jsxs(Box, { sx: { mb: 2, pb: 2, borderBottom: '1px solid #eee' }, children: [_jsxs(Typography, { variant: "body2", fontWeight: "medium", children: ["Player ID: ", report.playerId] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Report:" }), _jsx(Typography, { variant: "body2", children: report.report })] }, report.reportId || index))) })] })) : (scoutData && (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No scouting reports available for this scout." })))] })] }, scoutName))) })] })] }));
    // Raw Data Content
    const rawDataContent = (_jsxs(Box, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, children: "Raw Data by Player" }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mb: 3 }, children: [_jsx(TextField, { size: "small", label: "Search Players", value: rawDataFilter.search, onChange: (e) => setRawDataFilter(prev => ({ ...prev, search: e.target.value })), sx: { width: 200 } }), _jsxs(Select, { size: "small", value: rawDataFilter.leagueType, onChange: (e) => setRawDataFilter(prev => ({ ...prev, leagueType: e.target.value })), sx: { width: 150 }, children: [_jsx(MenuItem, { value: "All", children: "All Leagues" }), uniqueLeagueTypes.filter(type => type !== 'All').map(type => (_jsx(MenuItem, { value: type, children: type }, type)))] }), _jsxs(Select, { size: "small", value: rawDataFilter.nationality, onChange: (e) => setRawDataFilter(prev => ({ ...prev, nationality: e.target.value })), sx: { width: 150 }, children: [_jsx(MenuItem, { value: "All", children: "All Nationalities" }), uniqueNationalities.filter(nat => nat !== 'All').map(nat => (_jsx(MenuItem, { value: nat, children: nat }, nat)))] }), _jsxs(Select, { size: "small", value: rawDataSortBy, onChange: (e) => setRawDataSortBy(e.target.value), sx: { width: 150 }, children: [_jsx(MenuItem, { value: "avgRank", children: "Sort by Avg Rank" }), _jsx(MenuItem, { value: "name", children: "Sort by Name" }), _jsx(MenuItem, { value: "id", children: "Sort by ID" })] })] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: ["Showing ", processedRawData.length, " players"] }), processedRawData.length > 0 ? (processedRawData.map(([playerId, playerCategories]) => {
                const playerBio = Array.isArray(playerCategories.bio) ? playerCategories.bio[0] : null;
                const playerName = playerBio?.name || `Player ${playerId}`;
                const avgRank = calculateAverageRankRawData(playerCategories);
                const rankDisplay = avgRank === Infinity ? 'N/A' : avgRank.toFixed(1);
                return (_jsxs(Accordion, { elevation: 1, sx: { mt: 1 }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: playerName }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["(ID: ", playerId, " | Avg Rank: ", rankDisplay, ")"] })] }) }), _jsx(AccordionDetails, { children: _jsx(Box, { children: Object.keys(playerCategories).map((category) => {
                                    const categoryData = playerCategories[category];
                                    return (_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Typography, { variant: "h6", component: "h3", gutterBottom: true, children: [category.charAt(0).toUpperCase() + category.slice(1), " Data"] }), Array.isArray(categoryData) && categoryData.length > 0 ? (_jsx(TableContainer, { component: Paper, sx: { mt: 1 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsx(TableRow, { children: Object.keys(categoryData[0]).map((header) => (_jsx(TableCell, { sx: { fontWeight: 'bold' }, children: header }, header))) }) }), _jsx(TableBody, { children: categoryData.map((row, rowIndex) => (_jsx(TableRow, { children: Object.values(row).map((cellValue, cellIndex) => (_jsx(TableCell, { children: typeof cellValue === 'object' && cellValue !== null
                                                                        ? JSON.stringify(cellValue, null, 2)
                                                                        : String(cellValue) }, cellIndex))) }, rowIndex))) })] }) })) : (typeof categoryData === 'object' && categoryData !== null) ? (_jsx("pre", { style: { margin: 0, overflowX: 'auto' }, children: _jsx("code", { children: JSON.stringify(categoryData, null, 2) }) })) : (_jsx(Typography, { variant: "body2", children: String(categoryData) }))] }, category));
                                }) }) })] }, playerId));
            })) : (_jsx(Typography, { children: "No players match the current filters." }))] }));
    return (_jsxs(Container, { maxWidth: "xl", sx: { mt: 2 }, children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider', mb: 2 }, children: _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsx(Button, { variant: activeTab === 'overview' ? 'contained' : 'text', onClick: () => setActiveTab('overview'), children: "Overview" }), _jsx(Button, { variant: activeTab === 'players' ? 'contained' : 'text', onClick: () => setActiveTab('players'), children: "Players" }), _jsx(Button, { variant: activeTab === 'raw' ? 'contained' : 'text', onClick: () => setActiveTab('raw'), children: "Raw Data" })] }) }), activeTab === 'overview' && (_jsx(Box, { children: overviewContent })), activeTab === 'players' && (_jsxs(Box, { sx: { display: 'flex', minHeight: 'calc(100vh - 150px)', bgcolor: '#f4f6f8' }, children: [" ", _jsxs(Box, { sx: { width: 280, p: 2, borderRight: '1px solid #ddd', bgcolor: '#fff', flexShrink: 0 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Current Search" }), _jsx(TextField, { fullWidth: true, size: "small", placeholder: "Find as you type", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), sx: { mb: 2 } }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: [filteredPlayers.length, " search results found"] }), _jsx(Divider, { sx: { my: 2 } }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "League Type" }), _jsx(Select, { fullWidth: true, size: "small", value: filters.leagueType, onChange: (e) => setFilters({ ...filters, leagueType: e.target.value }), sx: { mb: 2 }, children: uniqueLeagueTypes.map(type => _jsx(MenuItem, { value: type, children: type }, type)) }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Nationality" }), _jsx(Select, { fullWidth: true, size: "small", value: filters.nationality, onChange: (e) => setFilters({ ...filters, nationality: e.target.value }), sx: { mb: 2 }, children: uniqueNationalities.map(nat => _jsx(MenuItem, { value: nat, children: nat }, nat)) })] }), _jsxs(Box, { sx: { flexGrow: 1, p: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2, gap: 2 }, children: [_jsx(Typography, { variant: "h6", children: "Actions:" }), _jsxs(Select, { size: "small", value: "", displayEmpty: true, children: [" ", _jsx(MenuItem, { value: "", children: "Select Action from Drop-down" })] }), _jsx(Button, { variant: "contained", size: "small", children: "Perform" }), _jsx(Typography, { variant: "h6", sx: { ml: 'auto' }, children: "Sort by:" }), _jsxs(Select, { size: "small", value: sortBy, onChange: (e) => setSortBy(e.target.value), children: [_jsx(MenuItem, { value: "avgRank", children: "Average Rank" }), _jsx(MenuItem, { value: "name-asc", children: "Name - ascending" }), _jsx(MenuItem, { value: "name-desc", children: "Name - descending" })] }), _jsx(Typography, { variant: "h6", sx: { ml: 2 }, children: "Parties in this search:" }), _jsx(Typography, { variant: "h4", color: "primary.main", sx: { fontWeight: 700 }, children: filteredPlayers.length })] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { children: [_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: isAllSelected, indeterminate: selectedPlayers.length > 0 && !isAllSelected, onChange: (e) => handleSelectAll(e.target.checked) }), label: `Select All ${sortedPlayers.length > 0 ? `All ${sortedPlayers.length} parties on this page are selected. Select all parties that match this search` : ''}`, sx: { mb: 2 } }), _jsx(Box, { sx: { display: 'grid', gap: 1 }, children: sortedPlayers.map(player => (_jsxs(Paper, { elevation: 1, sx: { p: 2, display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Checkbox, { checked: selectedPlayers.includes(player.playerId), onChange: (e) => handleSelectPlayer(player.playerId, e.target.checked) }), _jsx(Box, { sx: { width: 60, height: 60, bgcolor: 'grey.300', borderRadius: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }, children: player.photoUrl ? (_jsx("img", { src: player.photoUrl, alt: player.name, style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 } })) : (_jsx(Typography, { variant: "caption", children: "Image" })) }), _jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: player.name }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [player.currentTeam, " | ", player.league] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [player.height, " inches | ", player.weight, " lbs"] })] })] }, player.playerId))) })] })] })] })), activeTab === 'raw' && (_jsx(Box, { children: rawDataContent }))] }));
};
export default AdminDashboard;
