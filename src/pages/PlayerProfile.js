import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useParams } from 'react-router-dom';
import { playerDataService } from '../services/playerDataService';
import { Box, Typography, Paper, Container, Divider } from '@mui/material';
import playerSummaries from '../data/player_summaries.json';
const PlayerProfile = () => {
    const { playerId } = useParams();
    const player = playerDataService.getPlayerById(Number(playerId));
    const summaryEntry = playerSummaries.find((s) => s.playerId === player?.playerId);
    const playerSummary = summaryEntry?.summary || null;
    if (!player) {
        return (_jsx(Container, { children: _jsx(Typography, { variant: "h4", align: "center", sx: { mt: 4 }, children: "Player not found" }) }));
    }
    const heightFeet = player.height ? Math.floor(player.height / 12) : 0;
    const heightInches = player.height ? player.height % 12 : 0;
    return (_jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsx(Paper, { elevation: 3, sx: { p: { xs: 2, md: 4 } }, children: _jsxs(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 2fr'
                    },
                    gap: 4
                }, children: [_jsx(Box, { children: player.photoUrl ? (_jsx(Box, { component: "img", src: player.photoUrl, alt: player.name, sx: {
                                width: '100%',
                                height: 'auto',
                                borderRadius: 2,
                                boxShadow: 3
                            } })) : (_jsx(Box, { sx: {
                                width: '100%',
                                height: 300,
                                bgcolor: 'grey.200',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2
                            }, children: _jsx(Typography, { variant: "h6", color: "text.secondary", children: "No Photo Available" }) })) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h3", gutterBottom: true, children: player.name }), playerSummary && (_jsx(Typography, { variant: "subtitle1", fontStyle: "italic", color: "text.secondary", sx: { mb: 2 }, gutterBottom: true, children: playerSummary })), _jsxs(Box, { sx: {
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)'
                                    },
                                    gap: 2
                                }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "Current Team" }), _jsx(Typography, { variant: "body1", gutterBottom: true, children: player.currentTeam })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "League" }), _jsx(Typography, { variant: "body1", gutterBottom: true, children: player.league })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "Height" }), _jsxs(Typography, { variant: "body1", gutterBottom: true, children: [heightFeet, "' ", heightInches, "\""] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "Weight" }), _jsxs(Typography, { variant: "body1", gutterBottom: true, children: [player.weight, " lbs"] })] }), _jsx(Box, { sx: { gridColumn: { xs: '1', sm: '1 / -1' } }, children: _jsx(Divider, { sx: { my: 2 } }) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "Hometown" }), _jsxs(Typography, { variant: "body1", gutterBottom: true, children: [player.homeTown, player.homeState && `, ${player.homeState}`, player.homeCountry && `, ${player.homeCountry}`] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "Nationality" }), _jsx(Typography, { variant: "body1", gutterBottom: true, children: player.nationality })] }), player.highSchool && (_jsxs(Box, { sx: { gridColumn: { xs: '1', sm: '1 / -1' } }, children: [_jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "High School" }), _jsxs(Typography, { variant: "body1", gutterBottom: true, children: [player.highSchool, player.highSchoolState && `, ${player.highSchoolState}`] })] }))] })] })] }) }) }));
};
export default PlayerProfile;
