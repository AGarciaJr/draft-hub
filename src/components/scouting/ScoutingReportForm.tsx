// src/components/ScoutingReportForm.tsx
import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';
import type { ScoutingReport } from '../../types/player.types';

interface Props {
  playerId: number;
  reports: ScoutingReport[];
  setReports: (reports: ScoutingReport[]) => void;
}

const ScoutingReportForm: React.FC<Props> = ({ playerId, reports, setReports }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;

    const newReport: ScoutingReport = {
      reportId: `report_${Date.now()}`, // Generate a unique ID
      playerId: playerId,
      scout: "Alejandro", // You could replace with actual user context
      user: "Alejandro", // You could replace with actual user context
      report: text.trim(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setReports([...reports, newReport]);
    setText('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          New Scouting Report
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your scouting report..."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          Save Report
        </Button>
      </Paper>
    </Box>
  );
};

export default ScoutingReportForm;
