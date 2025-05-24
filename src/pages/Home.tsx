import React from 'react';
import { Box, Typography } from '@mui/material';
import Hero from '../components/home/Hero';
import PlayerCarousel from '../components/home/PlayerCarousel';
import ChartCarousel from '../components/charts/ChartCarousel';
import { usePageTooltips } from '../components/onboarding-tooltips/usePageTooltips';

const Home: React.FC = () => {
  usePageTooltips('home');

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Hero />
      <PlayerCarousel />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          letterSpacing: 0.5,
          mb: 3
        }}
      >
        🏀 Next Gen Insights
      </Typography>
      <ChartCarousel />
    </Box>
  );
};

export default Home; 