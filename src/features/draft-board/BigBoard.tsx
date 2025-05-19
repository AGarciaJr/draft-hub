import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Link as MuiLink } from '@mui/material';
import { playerBios, scoutRankings } from '../../data';
import { useNavigate } from 'react-router-dom';

// Dynamically get all unique scout names from the first scoutRankings entry (excluding playerId)
const scoutNames = scoutRankings.length > 0
  ? Object.keys(scoutRankings[0]).filter((key) => key !== 'playerId')
  : [];

const getHeightString = (inches: number) => {
  const feet = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${feet}'${inch}"`;
};

// Helper to get a player's scout ranking object by playerId
const getPlayerScoutRanking = (playerId: number) =>
  scoutRankings.find((r: any) => r.playerId === playerId);

const BigBoard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ p: 2 }}>
        Big Board
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>School/Team</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Weight</TableCell>
              {scoutNames.map((scout) => (
                <TableCell key={scout}>{scout}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {playerBios.slice(0, 20).map((player, idx) => {
              const ranking = getPlayerScoutRanking(player.playerId);
              return (
                <TableRow hover key={player.playerId}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <MuiLink
                      component="button"
                      variant="body1"
                      onClick={() => navigate(`/profiles/${player.playerId}`)}
                      sx={{ fontWeight: 600 }}
                    >
                      {player.name}
                    </MuiLink>
                  </TableCell>
                  <TableCell>{/* Position placeholder */}</TableCell>
                  <TableCell>{player.currentTeam}</TableCell>
                  <TableCell>{getHeightString(player.height)}</TableCell>
                  <TableCell>{player.weight} lbs</TableCell>
                  {scoutNames.map((scout) => (
                    <TableCell key={scout}>
                      {ranking && ranking[scout] != null ? ranking[scout] : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BigBoard; 