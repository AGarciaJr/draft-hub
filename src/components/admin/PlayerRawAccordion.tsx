import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PlayerRawAccordionProps {
  playerId: string;
  playerCategories: { [category: string]: unknown };
}


const PlayerRawAccordion: React.FC<PlayerRawAccordionProps> = ({ playerId, playerCategories }) => {
  const playerBio = Array.isArray(playerCategories.bio) ? playerCategories.bio[0] : null;
  const playerName = playerBio?.name || `Player ${playerId}`;
  // You may want to import and use calculateAverageRankRawData here if needed

  return (
    <Accordion key={playerId} elevation={1} sx={{ mt: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">{playerName}</Typography>
          <Typography variant="body2" color="text.secondary">
            (ID: {playerId})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {Object.keys(playerCategories).map((category) => {
            const categoryData = playerCategories[category];
            return (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {category}
                </Typography>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(categoryData, null, 2)}
                </pre>
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PlayerRawAccordion; 