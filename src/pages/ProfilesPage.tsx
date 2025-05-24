import React from 'react';
import { useNavigate } from 'react-router-dom';
import { playerDataService } from '../services/playerDataService';
import { usePageTooltips } from '../components/onboarding-tooltips/usePageTooltips';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  CardActionArea
} from '@mui/material';

const DEFAULT_IMAGE = 'https://cdn.nba.com/headshots/nba/latest/1040x760/1631244.png';

const CARD_HEIGHT = 420;
const IMAGE_HEIGHT = 300;

const ProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const players = playerDataService.getAllPlayers();
  usePageTooltips('profiles');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, color: '#fff' }}>
        Player Profiles
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3,
        mx: 'auto',
        width: {
          xs: '100%',
          sm: '90%',
          md: '80%',
          lg: '75%'
        }
      }}>
        {players.map((player) => {
          const heightFeet = player.height ? Math.floor(player.height / 12) : 0;
          const heightInches = player.height ? player.height % 12 : 0;

          return (
            <Card 
              key={player.playerId}
              sx={{ 
                height: CARD_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardActionArea onClick={() => navigate(`/profiles/${player.playerId}`)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <CardMedia
                  component="img"
                  height={IMAGE_HEIGHT}
                  image={player.photoUrl || DEFAULT_IMAGE}
                  alt={player.name}
                  sx={{ objectFit: 'cover', height: IMAGE_HEIGHT }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {player.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {player.currentTeam} • {player.league}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {heightFeet}' {heightInches}" • {player.weight} lbs
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default ProfilesPage;
