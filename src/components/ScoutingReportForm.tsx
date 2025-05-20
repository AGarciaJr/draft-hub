// src/components/ScoutingReportForm.tsx
import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, List, ListItem, Divider } from '@mui/material';

interface ScoutingReport {
  user: string;
  report: string;
  date: string;
}

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
      user: "Alejandro", // You could replace with actual user context
      report: text.trim(),
      date: new Date().toISOString()
    };

    setReports([...reports, newReport]);
    setText('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add Scouting Report
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

      {reports.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Scouting Reports
          </Typography>
          <List>
            {reports.map((report, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ display: 'block', py: 2 }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {report.user}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {report.report}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {new Date(report.date).toLocaleString()}
                  </Typography>
                </ListItem>
                {index < reports.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ScoutingReportForm;
