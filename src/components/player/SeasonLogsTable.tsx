import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import type { SeasonLog } from '../../types/player.types';

interface SeasonLogsTableProps {
  logs: SeasonLog[];
}

const SeasonLogsTable: React.FC<SeasonLogsTableProps> = ({ logs }) => {
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
        Season Logs
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Season</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>League</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Team</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>GP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>MPG</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>PPG</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>RPG</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>APG</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>FG%</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>3P%</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>FT%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow
                key={`${log.Season}-${log.League}-${index}`}
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <TableCell>{log.Season}</TableCell>
                <TableCell>{log.League}</TableCell>
                <TableCell>{log.Team}</TableCell>
                <TableCell>{log.GP}</TableCell>
                <TableCell>{(log.MP ?? 0).toFixed(1)}</TableCell>
                <TableCell>{(log.PTS ?? 0).toFixed(1)}</TableCell>
                <TableCell>{(log.REB ?? 0).toFixed(1)}</TableCell>
                <TableCell>{(log.AST ?? 0).toFixed(1)}</TableCell>
                <TableCell>{(log["FG%"] ?? 0).toFixed(1)}%</TableCell>
                <TableCell>{(log["3P%"] ?? 0).toFixed(1)}%</TableCell>
                <TableCell>{(log["FT%"] ?? 0).toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SeasonLogsTable; 