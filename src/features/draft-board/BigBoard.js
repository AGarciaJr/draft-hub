import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Link as MuiLink, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scoutRankings } from '../../data';
import { playerBios as rawPlayerBios } from '../../data';
// Type the playerBios
const playerBios = rawPlayerBios;
// Update the getPlayerScoutRanking function with proper typing
const getPlayerScoutRanking = (playerId) => scoutRankings.find((r) => r.playerId === playerId);
const getHeightString = (inches) => {
    if (!inches)
        return 'N/A';
    const feet = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${feet}'${inch}"`;
};
// Update calculateAverageRank with proper typing
const calculateAverageRank = (playerRankingData) => {
    if (!playerRankingData)
        return { avg: Infinity, count: 0 };
    const rankValues = Object.entries(playerRankingData)
        .filter(([key]) => key !== 'playerId' && playerRankingData[key] != null)
        .map(([, value]) => Number(value))
        .filter(value => !isNaN(value));
    const count = rankValues.length;
    const avg = count > 0
        ? rankValues.reduce((sum, rank) => sum + rank, 0) / count
        : Infinity;
    return { avg, count };
};
const BigBoard = () => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('avgRank');
    // Update the sortedPlayers useMemo to remove unnecessary dependencies
    const sortedPlayers = useMemo(() => {
        const players = [...playerBios];
        // Filter players based on sorting criteria before sorting
        let filteredPlayers = players;
        if (sortBy !== 'avgRank') {
            filteredPlayers = players.filter(player => {
                const ranking = getPlayerScoutRanking(player.playerId);
                return ranking && ranking[sortBy] != null;
            });
        }
        filteredPlayers.sort((a, b) => {
            const rankingA = getPlayerScoutRanking(a.playerId);
            const rankingB = getPlayerScoutRanking(b.playerId);
            // Handle cases where players might not have ranking data
            // This is still needed for 'avgRank' sorting and robustness, even with filtering for specific scouts
            if (!rankingA && !rankingB)
                return 0;
            if (!rankingA)
                return 1; // Player B has ranking, A doesn't, A goes lower
            if (!rankingB)
                return -1; // Player A has ranking, B doesn't, B goes lower
            if (sortBy === 'avgRank') {
                const rankDataA = calculateAverageRank(rankingA);
                const rankDataB = calculateAverageRank(rankingB);
                console.log(`Comparing Player ${a.playerId} (Avg Rank: ${rankDataA.avg}, Count: ${rankDataA.count}) with Player ${b.playerId} (Avg Rank: ${rankDataB.avg}, Count: ${rankDataB.count})`);
                // Primary sort by average rank (lower average is better)
                if (rankDataA.avg !== rankDataB.avg) {
                    return rankDataA.avg - rankDataB.avg;
                }
                // Secondary sort by the count of rankings (more rankings first, for tie-breaking)
                return rankDataB.count - rankDataA.count;
            }
            else {
                // Sort by a specific scout rank (we already filtered out players without this rank)
                // Use type assertion here assuming rankingA and rankingB are ScoutRanking
                const rankA = Number(rankingA[sortBy]);
                const rankB = Number(rankingB[sortBy]);
                // Since we filtered, rankA and rankB should be numbers here if the data is clean,
                // but keeping isNaN checks for robustness.
                if (isNaN(rankA) && isNaN(rankB))
                    return 0;
                if (isNaN(rankA))
                    return 1; // Should not happen often after filtering
                if (isNaN(rankB))
                    return -1; // Should not happen often after filtering
                return rankA - rankB;
            }
        });
        // Apply the slice after sorting if you still want to limit the number of displayed players
        const displayedPlayers = filteredPlayers.slice(0, 60); // Display up to 60 players
        return displayedPlayers; // Return the sorted and sliced array
    }, [sortBy]); // Remove unnecessary dependencies
    // Update the second useMemo to remove unnecessary dependencies
    const scoutNames = useMemo(() => {
        if (!scoutRankings || scoutRankings.length === 0)
            return [];
        const firstRanking = scoutRankings[0];
        return Object.keys(firstRanking).filter(key => key !== 'playerId');
    }, []); // Remove scoutRankings dependency
    return (_jsxs(Box, { sx: { px: 2, py: 4 }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "NextGen Draft Board " }), _jsxs(Box, { sx: { mb: 3, display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "body1", sx: { mr: 1 }, children: "Sort by:" }), _jsxs(FormControl, { size: "small", sx: { width: 200 }, children: [_jsx(InputLabel, { children: "Sort By" }), _jsxs(Select, { value: sortBy, label: "Sort By", onChange: (e) => setSortBy(e.target.value), children: [_jsx(MenuItem, { value: "avgRank", children: "Average Rank" }), scoutNames.map(scoutName => (_jsx(MenuItem, { value: scoutName, children: scoutName }, scoutName)))] })] })] }), _jsx(Box, { sx: { display: 'grid', gap: 4 }, children: sortedPlayers.map((player, idx) => {
                    const ranking = getPlayerScoutRanking(player.playerId);
                    const scoutNames = ranking ? Object.keys(ranking).filter(key => key !== 'playerId') : []; // Recalculate scoutNames here if needed per player
                    // Basic logic for high/low ranking indication (can be refined)
                    // This logic might need adjustment based on the overall sorted list position, not just idx
                    const playerAvgRankData = calculateAverageRank(ranking);
                    const playerAvgRank = playerAvgRankData.avg; // Use the calculated average
                    // Example thresholds based on player's position in the sorted list
                    const isHighRanking = (scoutRank) => {
                        if (scoutRank === null)
                            return false;
                        const rank = Number(scoutRank);
                        return !isNaN(rank) && rank < playerAvgRank * 0.8;
                    };
                    const isLowRanking = (scoutRank) => {
                        if (scoutRank === null)
                            return false;
                        const rank = Number(scoutRank);
                        return !isNaN(rank) && rank > playerAvgRank * 1.2;
                    };
                    return (_jsxs(Paper, { elevation: 3, sx: { borderRadius: 2, overflow: 'hidden' }, children: [_jsxs(Box, { sx: {
                                    bgcolor: idx % 2 === 0 ? 'primary.main' : '#012B5E', // Alternating theme colors
                                    color: 'primary.contrastText',
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }, children: [_jsxs(Typography, { variant: "h6", sx: { fontWeight: 700 }, children: ["Rank ", idx + 1] }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 700 }, children: player.name })] }), _jsxs(Box, { sx: { display: 'flex', p: 2, gap: 3, flexDirection: { xs: 'column', md: 'row' } }, children: [_jsxs(Box, { sx: { flexShrink: 0, width: { xs: '100%', md: 250 }, textAlign: 'center' }, children: [_jsx(Box, { component: "img", src: player.photoUrl || 'https://cdn.nba.com/headshots/nba/latest/1040x760/1631244.png', alt: player.name, sx: { width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 1 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-around', mt: 1 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: getHeightString(player.height) }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Height" })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: player.weight }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Weight" })] }), player.class && (_jsxs(Box, { children: [_jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: player.class }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Class" })] })), player.age && (_jsxs(Box, { children: [_jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: player.age }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Age" })] }))] })] }), _jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Summary" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 2 }, children: player.summary || 'No summary available.' }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: "Scout Rankings" }), _jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 1 }, children: scoutNames.map(scoutName => {
                                                    // Use type assertion assuming ranking is ScoutRanking
                                                    const scoutRank = ranking ? ranking[scoutName] : undefined;
                                                    if (scoutRank == null)
                                                        return null;
                                                    const rankColor = isHighRanking(scoutRank) ? 'success' : isLowRanking(scoutRank) ? 'error' : 'default';
                                                    return (_jsx(Chip, { label: `${scoutName}: ${scoutRank}`, color: rankColor, size: "small" }, scoutName));
                                                }) }), _jsx(Box, { sx: { mt: 3, textAlign: 'right' }, children: _jsx(MuiLink, { component: "button", variant: "button", onClick: () => navigate(`/profiles/${player.playerId}`), children: "See full player report" }) })] })] })] }, player.playerId));
                }) })] }));
};
export default BigBoard;
