import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import type { ScoutingReport } from '../types/player.types';

interface ScoutingReportListProps {
  reports: ScoutingReport[];
}

const ScoutingReportList: React.FC<ScoutingReportListProps> = ({ reports }) => {
  // Sort reports by date (newest first)
  const sortedReports = [...reports].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  if (sortedReports.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="#ffff">
          No scouting reports available for this player.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Scouting Reports ({sortedReports.length})
      </Typography>
      <Box sx={{ mt: 2 }}>
        {sortedReports.map((report) => (
          <Paper 
            key={report.reportId} 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 2,
              backgroundColor: 'background.paper',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {report.scout || 'Anonymous Scout'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {report.date || 'No date provided'}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {report.report || 'No content available'}
            </Typography>
            {report.user && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Added by: {report.user}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {report.date ? new Date(report.date).toLocaleDateString() : 'No date provided'}
            </Typography>

          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ScoutingReportList; 