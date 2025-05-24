import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import type { GameLog } from '../../types/player.types';

interface GameLogsTableProps {
  logs: GameLog[];
}

const GameLogsTable: React.FC<GameLogsTableProps> = ({ logs }) => {
  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'white',
          fontWeight: 'bold',
          mb: 4
        }}
      >
        Game Logs
      </Typography>
      <TableContainer component={Paper} sx={{ 
        elevation: 3,
        borderRadius: 2,
        overflow: 'hidden',
        '& .MuiTableHead-root': {
          backgroundColor: 'primary.main',
          '& .MuiTableCell-root': {
            color: 'primary.contrastText',
            fontWeight: 'bold',
            borderBottom: 'none'
          }
        },
        '& .MuiTableBody-root': {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid',
            borderColor: 'divider'
          }
        }
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Opponent</TableCell>
              <TableCell>Min</TableCell>
              <TableCell>FGM</TableCell>
              <TableCell>FGA</TableCell>
              <TableCell>3PM</TableCell>
              <TableCell>3PA</TableCell>
              <TableCell>FTM</TableCell>
              <TableCell>FTA</TableCell>
              <TableCell>REB</TableCell>
              <TableCell>AST</TableCell>
              <TableCell>STL</TableCell>
              <TableCell>PTS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.gameId}>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>{log.opponent}</TableCell>
                <TableCell>{log.timePlayed}</TableCell>
                <TableCell>{log.fgm}</TableCell>
                <TableCell>{log.fga}</TableCell>
                <TableCell>{log.tpm}</TableCell>
                <TableCell>{log.tpa}</TableCell>
                <TableCell>{log.ftm}</TableCell>
                <TableCell>{log.fta}</TableCell>
                <TableCell>{log.reb}</TableCell>
                <TableCell>{log.ast}</TableCell>
                <TableCell>{log.stl}</TableCell>
                <TableCell>{log.pts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GameLogsTable; 