import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Slider from 'react-slick';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { playerBios } from '../data';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const carouselSettings = {
    dots: false,
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
const PlayerCarousel = () => {
    console.log(playerBios);
    const playersWithPhotos = playerBios.filter((player) => !!player.photoUrl);
    return (_jsx(Box, { sx: { mt: 6, mb: 6 }, children: _jsx(Slider, { ...carouselSettings, children: playersWithPhotos.slice(0, 10).map((player) => (_jsx(Box, { px: 2, children: _jsxs(Card, { sx: {
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
                    }, children: [player.photoUrl && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, mb: 2, width: '100%', overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }, children: _jsx(CardMedia, { component: "img", sx: {
                                    objectFit: 'contain',
                                    borderRadius: '20px 20px 0 0',
                                    width: '100%',
                                    height: 260,
                                }, image: player.photoUrl, alt: player.name }) })), _jsxs(CardContent, { sx: { flex: '0 0 auto', minHeight: 0, p: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h5", component: "div", sx: { fontWeight: 700, color: '#fff' }, children: player.name }), _jsxs(Typography, { variant: "body2", color: "#B8C4CA", children: [player.currentTeam, " ", player.league ? `(${player.league})` : ''] }), _jsxs(Typography, { variant: "body2", color: "#B8C4CA", children: [player.height ? `${Math.floor(player.height / 12)}'${player.height % 12}"` : '', " | ", player.weight, " lbs"] }), _jsxs(Typography, { variant: "body2", color: "#B8C4CA", children: [player.highSchool ? `${player.highSchool}, ` : '', player.homeState || player.homeCountry] }), _jsx(Box, { mt: 2, children: _jsx(Typography, { variant: "body2", color: "#B8C4CA", fontStyle: "italic", children: "Rising star with elite potential." }) })] })] }) }, player.playerId))) }) }));
};
export default PlayerCarousel;
