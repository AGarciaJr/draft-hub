import React from 'react';
import { Box } from '@mui/material';

const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '60vh',
        backgroundImage: 'url(/assets/logo-transparent-svg.svg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mb: 4,
      }}
    />
  );
};

export default Hero;
