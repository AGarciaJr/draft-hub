import { Box, Stack, Typography } from '@mui/material';
import StatCard from '../../components/StatCard';
import type { Stat } from '../../components/StatCard';
import { getTopPlayers } from '../../utils/statUtils';

const StatsPage = () => {
  return (
    <Box maxWidth="lg" mx="auto" p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4} sx={{ color: 'white' }}>
        Individual Leaders
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        flexWrap="wrap"
        spacing={3}
        useFlexGap
        justifyContent="center"
      >
        {(['points', 'rebounds', 'assists', 'blocks', 'steals', 'fieldGoalPercentage'] as Stat[]).map((stat) => {
          const data = getTopPlayers(stat);
          console.log('Top players for', stat, data);
          return (
            <Box key={stat} flex={1} minWidth={275} maxWidth={350}>
              <StatCard
                stat={stat}
                label={
                  stat === 'points' ? 'Scoring' :
                  stat === 'rebounds' ? 'Rebounds' :
                  stat === 'assists' ? 'Assists' :
                  stat === 'blocks' ? 'Blocks' :
                  stat === 'steals' ? 'Steals' :
                  'Field Goal %'
                }
                unit={
                  stat === 'points' ? 'pts' :
                  stat === 'rebounds' ? 'reb' :
                  stat === 'blocks' ? 'blk' :
                  stat === 'steals' ? 'stl' :
                  stat === 'fieldGoalPercentage' ? 'FG%' :
                  stat === 'assists' ? 'ast' :
                  (stat as string).slice(0, 6)
                }
                data={data}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default StatsPage;
