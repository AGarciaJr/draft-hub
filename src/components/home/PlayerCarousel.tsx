import React from 'react';
import Slider from 'react-slick';
import { Card, CardContent, CardMedia, Typography, Box, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { playerBios } from '../../data';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const carouselSettings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0',
  focusOnSelect: true,
  autoplay: true,
  autoplaySpeed: 2500,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const PlayerCarousel: React.FC = () => {
  const navigate = useNavigate();
  console.log(playerBios);

  const playersWithPhotos = playerBios.filter((player) => !!player.photoUrl);

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      <Slider {...carouselSettings}>
        {playersWithPhotos.slice(0, 10).map((player) => (
          <Box key={player.playerId} px={2}>
            <Card
              sx={{
                width: 300,
                height: 480,
                mx: 'auto',
                boxShadow: 8,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #00538C 60%, #012B5E 100%)',
                color: '#B8C4CA',
                transform: 'scale(0.95)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.03)' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardActionArea 
                onClick={() => navigate(`/profiles/${player.playerId}`)}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                {player.photoUrl && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, mb: 2, width: '100%', overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <CardMedia
                      component="img"
                      sx={{
                        objectFit: 'contain',
                        borderRadius: '20px 20px 0 0',
                        width: '100%',
                        height: 260,
                      }}
                      image={player.photoUrl}
                      alt={player.name}
                    />
                  </Box>
                )}
                <CardContent sx={{ flex: '0 0 auto', minHeight: 0, p: 2 }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700, color: '#fff' }}>
                    {player.name}
                  </Typography>
                  <Typography variant="body2" color="#B8C4CA">
                    {player.currentTeam} {player.league ? `(${player.league})` : ''}
                  </Typography>
                  <Typography variant="body2" color="#B8C4CA">
                    {player.height ? `${Math.floor(player.height / 12)}'${player.height % 12}"` : ''} | {player.weight} lbs
                  </Typography>
                  <Typography variant="body2" color="#B8C4CA">
                    {player.highSchool ? `${player.highSchool}, ` : ''}{player.homeState || player.homeCountry}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2" color="#B8C4CA" fontStyle="italic">
                      Rising star with elite potential.
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PlayerCarousel; 