import React from 'react';
import { Box, Typography } from '@mui/material';
import { playerDataService } from '../services/playerDataService';

interface SummaryItem {
  label: string;
  value: string | number;
}

const getSummaryData = (): SummaryItem[] => {
    const allPlayers = playerDataService.getAllPlayers();
    const allReports = playerDataService.getAllScoutingReports();
    const topPlayer = allPlayers[0];
    const allScouts = playerDataService.getAllScouts();
  
    return [
      { label: 'Total Prospects', value: allPlayers.length },
      { label: 'Scouting Reports', value: allReports.length },
      { label: 'Top-Ranked Player', value: topPlayer?.name || 'N/A' },
      { label: 'Scouts Active', value: allScouts.length },
    ];
  };
  

const ExecutiveSummaryPanel: React.FC = () => {
  const summaryData = getSummaryData();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 4, flexWrap: 'wrap', gap: 4 }}>
      {summaryData.map(({ label, value }) => (
        <Box
          key={label}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            p: 3,
            minWidth: 220,
            textAlign: 'center',
            flexGrow: 1,
            maxWidth: 280,
          }}
        >
          <Typography variant="h6" color="text.secondary">{label}</Typography>
          <Typography variant="h4" color="primary">{value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ExecutiveSummaryPanel;
