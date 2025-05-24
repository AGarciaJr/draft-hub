import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Paper } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TopScorersChart from './TopScorerChart';
import EfficiencyChart from './EfficiencyChart';
import ScoringDistributionChart from './ScoringDistributionChart';
import DefensiveImpactChart from './DefensiveImpactChart';
import { playerDataService } from '../../services/playerDataService';
import type { SeasonLog } from '../../types/player.types';

const chartCarouselSettings = {
  dots: true,
  arrows: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
};

const ChartCarousel: React.FC = () => {
  const allSeasonLogs = playerDataService.getAllSeasonLogs();

  // Get most recent season for each player
  const latestSeasonLogs = allSeasonLogs.reduce((acc, log) => {
    const existing = acc.find(l => l.playerId === log.playerId);
    if (!existing || log.Season > existing.Season) {
      return [...acc.filter(l => l.playerId !== log.playerId), log];
    }
    return acc;
  }, [] as SeasonLog[]);

  // Get top 10 scorers
  const topScorers = latestSeasonLogs
    .filter(log => log.PTS !== undefined)
    .sort((a, b) => b.PTS - a.PTS)
    .slice(0, 10)
    .map(log => {
      const player = playerDataService.getPlayerById(log.playerId);
      return {
        playerId: player?.playerId ?? 0,
        name: player?.name || 'Unknown Player',
        PTS: Number(log.PTS.toFixed(1)),
      };
    });

  // Get top 10 most efficient shooters (by eFG%)
  const efficiencyData = latestSeasonLogs
    .map(log => {
      const player = playerDataService.getPlayerById(log.playerId);
      const eFG = log.FGA > 0 ? ((log.FGM + 0.5 * log.FGM3) / log.FGA) * 100 : 0;
      const TS = (log.FGA > 0 || log.FTA > 0) ? (log.PTS / (2 * (log.FGA + 0.44 * log.FTA))) * 100 : 0;
      
      return {
        playerId: log.playerId,
        name: player?.name || 'Unknown Player',
        eFG: Number(eFG.toFixed(1)),
        TS: Number(TS.toFixed(1)),
        FG: log["FG%"] !== undefined ? Number(log["FG%"].toFixed(1)) : 0,
      };
    })
    .sort((a, b) => b.eFG - a.eFG)
    .slice(0, 10);

  // Get top 10 players by total makes for scoring distribution
  const scoringDistributionData = latestSeasonLogs
    .map(log => {
      const player = playerDataService.getPlayerById(log.playerId);
      return {
        playerId: log.playerId,
        name: player?.name || 'Unknown Player',
        twoPointMakes: log.FG2M,
        threePointMakes: log['3PM'],
        freeThrowMakes: log.FT,
      };
    })
    .sort((a, b) => (b.twoPointMakes + b.threePointMakes + b.freeThrowMakes) - (a.twoPointMakes + a.threePointMakes + a.freeThrowMakes))
    .slice(0, 10);

  // Get top 10 defensive players (combined blocks and steals)
  const defensiveData = latestSeasonLogs
    .map(log => {
      const player = playerDataService.getPlayerById(log.playerId);
      const defensiveScore = log.BLK + log.STL; // Combined defensive metric
      return {
        playerId: log.playerId,
        name: player?.name || 'Unknown Player',
        blocks: log.BLK,
        steals: log.STL,
        defRebounds: log.DREB,
        defensiveScore,
      };
    })
    .sort((a, b) => b.defensiveScore - a.defensiveScore)
    .slice(0, 10);

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Slider {...chartCarouselSettings}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Top Scorers (PPG)
          </Typography>
          <TopScorersChart data={topScorers} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Most Efficient Shooters
          </Typography>
          <EfficiencyChart data={efficiencyData} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Scoring Distribution
          </Typography>
          <ScoringDistributionChart data={scoringDistributionData} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Top Defensive Players
          </Typography>
          <DefensiveImpactChart data={defensiveData} />
        </Paper>
      </Slider>
    </Box>
  );
};

export default ChartCarousel;
